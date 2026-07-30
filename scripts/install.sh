#!/usr/bin/env bash

set -Eeuo pipefail

readonly SCRIPT_DIR="$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")" && pwd)"
readonly PROJECT_ROOT="$(cd -- "${SCRIPT_DIR}/.." && pwd)"
readonly ENV_FILE="${PROJECT_ROOT}/.env"
readonly ENV_EXAMPLE="${PROJECT_ROOT}/.env.example"

info() { printf '\033[1;34m[Verio]\033[0m %s\n' "$*"; }
success() { printf '\033[1;32m[OK]\033[0m %s\n' "$*"; }
error() { printf '\033[1;31m[ERRO]\033[0m %s\n' "$*" >&2; }

require_command() {
  command -v "$1" >/dev/null 2>&1 || {
    error "O comando '$1' não foi encontrado. $2"
    return 1
  }
}

prompt_secret() {
  local label="$1" value

  while :; do
    read -r -s -p "${label}: " value
    printf '\n' >&2
    if [[ -n "$value" ]]; then
      REPLY="$value"
      return
    fi
    error "O valor não pode ficar vazio."
  done
}

validate_key_formats() {
  local clerk_publishable="$1" clerk_secret="$2" google_key="$3"

  [[ "$clerk_publishable" =~ ^pk_(test|live)_[A-Za-z0-9_-]+$ ]] || {
    error "A publishable key do Clerk deve começar com pk_test_ ou pk_live_."
    return 1
  }
  [[ "$clerk_secret" =~ ^sk_(test|live)_[A-Za-z0-9_-]+$ ]] || {
    error "A secret key do Clerk deve começar com sk_test_ ou sk_live_."
    return 1
  }
  if [[ "$clerk_publishable" == pk_test_* && "$clerk_secret" != sk_test_* ]] ||
    [[ "$clerk_publishable" == pk_live_* && "$clerk_secret" != sk_live_* ]]; then
    error "As chaves Clerk pertencem a ambientes diferentes (test/live)."
    return 1
  fi
  [[ "$google_key" =~ ^AIza[A-Za-z0-9_-]{35}$ ]] || {
    error "A chave Google AI não possui o formato esperado (prefixo AIza)."
    return 1
  }
}

decode_clerk_frontend_host() {
  local encoded="$1" padding decoded
  encoded="${encoded#pk_test_}"
  encoded="${encoded#pk_live_}"
  padding=$(( (4 - ${#encoded} % 4) % 4 ))
  case "$padding" in
    1) encoded="${encoded}=" ;;
    2) encoded="${encoded}==" ;;
    3) encoded="${encoded}===" ;;
  esac
  if base64 --help 2>&1 | grep -q -- '--decode'; then
    decoded="$(printf '%s' "$encoded" | tr '_-' '/+' | base64 --decode 2>/dev/null)" || return 1
  else
    decoded="$(printf '%s' "$encoded" | tr '_-' '/+' | base64 -D 2>/dev/null)" || return 1
  fi
  decoded="${decoded%\$}"
  [[ "$decoded" =~ ^[A-Za-z0-9.-]+$ ]] || return 1
  printf '%s' "$decoded"
}

validate_remote_keys() {
  local clerk_publishable="$1" clerk_secret="$2" google_key="$3" frontend_host status

  frontend_host="$(decode_clerk_frontend_host "$clerk_publishable")" || {
    error "Não foi possível interpretar a publishable key do Clerk."
    return 1
  }

  info "Validando a publishable key do Clerk..."
  status="$(printf 'url = "https://%s/.well-known/jwks.json"\n' "$frontend_host" | \
    curl --config - --silent --show-error --connect-timeout 10 \
      --max-time 20 --output /dev/null --write-out '%{http_code}')" || {
      error "Não foi possível acessar o frontend da instância Clerk."
      return 1
    }
  [[ "$status" == "200" ]] || {
    error "A publishable key do Clerk não identificou uma instância ativa (HTTP ${status})."
    return 1
  }

  info "Validando a chave secreta do Clerk..."
  status="$(printf '%s\n' \
    'url = "https://api.clerk.com/v1/clients?limit=1"' \
    "header = \"Authorization: Bearer ${clerk_secret}\"" \
    'header = "Accept: application/json"' | \
    curl --config - --silent --show-error --connect-timeout 10 \
      --max-time 20 --output /dev/null --write-out '%{http_code}')" || {
      error "Não foi possível acessar a API do Clerk. Verifique sua conexão."
      return 1
    }
  [[ "$status" == "200" ]] || {
    error "O Clerk rejeitou a chave (HTTP ${status})."
    return 1
  }

  info "Validando a chave Google AI..."
  status="$(printf 'url = "https://generativelanguage.googleapis.com/v1beta/models?key=%s"\n' \
    "$google_key" | curl --config - --silent --show-error \
      --connect-timeout 10 --max-time 20 --output /dev/null \
      --write-out '%{http_code}')" || {
    error "Não foi possível acessar a API Google AI. Verifique sua conexão."
    return 1
  }
  [[ "$status" == "200" ]] || {
    error "A Google AI rejeitou a chave (HTTP ${status}). Confirme se a API está habilitada."
    return 1
  }
}

escape_env_value() {
  printf '%s' "$1" | sed 's/\\/\\\\/g; s/"/\\"/g'
}

set_env_value() {
  local key="$1" value escaped temporary
  value="$2"
  escaped="$(escape_env_value "$value")"
  temporary="$(mktemp "${ENV_FILE}.XXXXXX")"
  awk -v key="$key" -v value="$escaped" '
    BEGIN { replaced = 0 }
    $0 ~ "^" key "=" { print key "=\"" value "\""; replaced = 1; next }
    { print }
    END { if (!replaced) print key "=\"" value "\"" }
  ' "$ENV_FILE" >"$temporary"
  chmod 600 "$temporary"
  mv "$temporary" "$ENV_FILE"
}

configure_environment() {
  local clerk_publishable clerk_secret google_key

  while :; do
    prompt_secret "Clerk publishable key (pk_test_... ou pk_live_...)"
    clerk_publishable="$REPLY"
    prompt_secret "Clerk secret key (sk_test_... ou sk_live_...)"
    clerk_secret="$REPLY"
    prompt_secret "Google AI API key (AIza...)"
    google_key="$REPLY"

    if validate_key_formats "$clerk_publishable" "$clerk_secret" "$google_key" &&
      validate_remote_keys "$clerk_publishable" "$clerk_secret" "$google_key"; then
      break
    fi
    info "Informe novamente as três credenciais. Pressione Ctrl+C para cancelar."
  done

  if [[ -e "$ENV_FILE" ]]; then
    local backup_file="${ENV_FILE}.backup.$(date +%Y%m%d%H%M%S)"
    cp "$ENV_FILE" "$backup_file"
    chmod 600 "$backup_file"
    info "Backup do ambiente existente criado antes da atualização."
  else
    cp "$ENV_EXAMPLE" "$ENV_FILE"
  fi
  chmod 600 "$ENV_FILE"
  set_env_value "NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY" "$clerk_publishable"
  set_env_value "CLERK_SECRET_KEY" "$clerk_secret"
  set_env_value "GOOGLE_AI_API_KEY" "$google_key"
  success "Credenciais validadas e gravadas em .env com permissão 600."
}

main() {
  cd "$PROJECT_ROOT"
  info "Instalador interativo do Verio"
  require_command curl "Instale o curl e tente novamente."
  require_command base64 "Instale o utilitário base64 e tente novamente."
  require_command docker "Instale Docker Engine ou Docker Desktop e tente novamente."
  docker compose version >/dev/null 2>&1 || {
    error "Docker Compose v2 não está disponível."
    exit 1
  }
  [[ -f "$ENV_EXAMPLE" ]] || {
    error ".env.example não encontrado. Execute o instalador na cópia completa do projeto."
    exit 1
  }

  configure_environment
  info "Validando a configuração do Docker Compose..."
  docker compose --env-file "$ENV_FILE" config --quiet
  info "Construindo e iniciando banco, migrations e aplicação..."
  docker compose --env-file "$ENV_FILE" up --build --detach --wait
  success "Verio disponível em http://localhost:$(sed -n 's/^APP_PORT="\{0,1\}\([^" ]*\).*/\1/p' "$ENV_FILE" | head -n1)"
  info "Use 'docker compose logs -f app' para acompanhar os logs."
}

if [[ "${BASH_SOURCE[0]}" == "$0" ]]; then
  main "$@"
fi
