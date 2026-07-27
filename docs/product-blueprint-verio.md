# Product Blueprint — Verio

**Fase 2 — Definição do Produto**
**Versão:** 1.0
**Data:** 27 de julho de 2026
**Status:** proposta para validação antes da implementação
**Documento-base:** [Product Foundation — Verio](./product-foundation-verio.md)

> Este blueprint define o comportamento do produto, não sua arquitetura ou implementação. Nada aqui autoriza desenvolvimento antes dos gates de descoberta definidos na Fase 1. Onde a evidência ainda não existe, a decisão está marcada como hipótese ou experimento.

---

## 1. Visão do produto

### 1.1 Visão

Tornar simples para qualquer pequeno negócio local entender, melhorar e acompanhar os sinais digitais que fazem clientes confiarem nele.

### 1.2 Produto em uma frase

O Verio analisa sinais públicos do negócio no Google/Maps, site e canal de contato, explica o que reduz sua credibilidade e recomenda as próximas ações mais relevantes.

### 1.3 Problema que o produto deve resolver

O proprietário sabe que clientes pesquisam sua empresa, mas não consegue responder com segurança:

1. o que um potencial cliente encontra;
2. quais informações parecem incompletas, incoerentes ou pouco confiáveis;
3. quais correções estão sob seu controle;
4. qual correção merece prioridade;
5. se o trabalho realizado de fato melhorou o sinal diagnosticado.

O Verio não existe para entregar mais dados. Existe para transformar sinais dispersos em uma decisão executável.

### 1.4 Público inicial

O produto será desenhado para donos-operadores e gestores generalistas de empresas locais com uma unidade, aproximadamente 2–20 funcionários, Perfil da Empresa no Google e WhatsApp, site simples ou ausente e nenhum especialista digital interno.

O vertical definitivo será escolhido na descoberta. Até essa decisão, exemplos devem evitar regras específicas de clínicas, oficinas ou escolas que não possam ser generalizadas.

### 1.5 Jobs to be Done

**Job principal**

> Quando eu estiver inseguro sobre como minha empresa aparece online, quero descobrir o que prejudica a confiança e o que devo corrigir primeiro, para agir sem depender de um especialista.

**Jobs funcionais**

- Consolidar sinais essenciais de presença digital.
- Entender a razão de cada diagnóstico.
- Comparar o negócio apenas com empresas equivalentes escolhidas.
- Priorizar ações possíveis por impacto e esforço.
- Confirmar que uma correção foi detectada após reanálise.

**Jobs emocionais**

- Sentir controle, não vergonha, sobre a situação atual.
- Ter confiança de que a recomendação não foi inventada.
- Evitar a sensação de desperdiçar dinheiro com marketing.

**Jobs sociais**

- Demonstrar profissionalismo para clientes.
- Compartilhar um plano compreensível com sócios, equipe ou fornecedor.
- Justificar prioridades sem recorrer a jargão técnico.

### 1.6 Proposta de experiência

O produto deve entregar o primeiro insight verificável em até cinco minutos de tempo percebido. O relatório deve responder, nesta ordem:

1. **O que foi possível verificar?**
2. **O que está funcionando e o que merece atenção?**
3. **Por que o Verio chegou a essa conclusão?**
4. **Qual é a ação mais importante agora?**
5. **Como confirmar a melhoria depois?**

### 1.7 Não objetivos

O Verio não é, no MVP:

- uma suíte de SEO;
- um gerenciador de redes sociais;
- um CRM ou central de atendimento;
- uma agência digital;
- um criador automático de sites ou conteúdo;
- um preditor de vendas;
- um ranking público de empresas;
- uma auditoria legal, médica, financeira, de segurança ou acessibilidade;
- uma plataforma para franquias, agências ou múltiplas unidades.

### 1.8 Princípios de decisão

Quando duas soluções competirem, escolher a que:

1. leva mais rápido a uma evidência verificável;
2. exige menos conhecimento técnico;
3. explica melhor suas limitações;
4. gera uma ação sob controle do usuário;
5. coleta menos dados;
6. preserva comparabilidade e confiança;
7. aumenta aprendizado do MVP sem ampliar o produto.

---

## 2. Personas operacionais

As personas da fundação são convertidas aqui em necessidades de produto. Elas continuam sendo hipóteses até entrevistas e observação contextual.

### 2.1 Daniela — dona-operadora e compradora

| Dimensão | Definição |
|---|---|
| Contexto | Opera uma empresa local de seis colaboradores; aprova marketing e fornecedores |
| Frequência esperada | Diagnóstico inicial e retorno após executar uma ação; recorrência mensal ainda não comprovada |
| Dispositivo | Prioritariamente celular; pode abrir o relatório no computador |
| Objetivo imediato | Descobrir se a presença transmite confiança e corrigir algo hoje |
| Sucesso | Identifica uma falha real, conclui um passo e vê a mudança confirmada |
| Necessidades | Linguagem simples, pouco preenchimento, evidências, esforço claro, instruções curtas |
| Ansiedades | Score arbitrário, julgamento, promessa enganosa, tarefa complexa, cobrança surpresa |
| Permissões | Controla cadastro, análise, pagamento, compartilhamento e exclusão |

**Implicações de produto**

- Não exigir cadastro antes do primeiro insight, salvo impedimento de segurança validado.
- Não presumir que Daniela saiba localizar uma URL ou distinguir perfil de Maps de site.
- Mostrar ações pequenas antes de planos extensos.
- Explicar que o score mede sinais observáveis, não qualidade total da empresa.

### 2.2 Rafael — operador e influenciador

| Dimensão | Definição |
|---|---|
| Contexto | Coordena atendimento e marketing, mas depende do dono ou fornecedor para mudanças |
| Frequência esperada | Consulta e acompanha ações com maior frequência que o comprador |
| Dispositivo | Celular e desktop |
| Objetivo imediato | Organizar prioridades e prestar contas do progresso |
| Sucesso | Compartilha evidências, atribui próximos passos informalmente e demonstra evolução |
| Necessidades | Relatório compartilhável, status das ações, data da análise e histórico simples |
| Ansiedades | Recomendações fora de sua autoridade, relatório que o chefe não entende |
| Permissões no MVP | Usa o mesmo acesso do proprietário ou link somente leitura; não há gestão de equipes |

**Implicações de produto**

- Cada recomendação deve informar quem normalmente consegue executá-la: proprietário, pessoa com acesso ao Google, responsável pelo site ou atendimento.
- Compartilhar não pode expor telefone pessoal, dados internos, notas privadas ou controles da conta.
- Gestão sofisticada de tarefas e papéis fica fora do MVP.

### 2.3 Marcelo — parceiro futuro, não persona de design do MVP

Marcelo administra vários clientes e pediria marca branca, exportações, múltiplas contas e permissões. Atendê-lo agora ampliaria escopo e mudaria unidade econômica. No MVP ele pode indicar usuários ou receber um relatório compartilhado, mas seus fluxos não determinam o produto.

### 2.4 Antipersonas

- Empresa multilocal que precisa administrar centenas de perfis.
- Especialista que procura pesquisa de palavras-chave ou auditoria SEO profunda.
- Negócio sem presença pública mínima que espera que o Verio a crie.
- Pessoa buscando avaliar uma empresa de terceiro sem relação legítima com ela.
- Usuário que espera garantia de vendas, posição no Google ou diagnóstico profissional regulado.

---

## 3. Modelo conceitual do produto

Este modelo estabelece a linguagem comum de produto. Não prescreve banco de dados ou componentes técnicos.

| Conceito | Definição de produto |
|---|---|
| Conta | Identidade que pode recuperar análises, controlar consentimento e solicitar exclusão |
| Negócio | Empresa principal analisada, identificada por nome, localidade e canais confirmados |
| Canal | Referência pública confirmada: Google/Maps, site ou WhatsApp comercial |
| Concorrente | Negócio escolhido pelo usuário para comparação privada e opcional |
| Análise | Processo datado que coleta e avalia sinais usando uma versão declarada da metodologia |
| Sinal | Constatação observável e verificável em um canal |
| Evidência | Fonte, trecho ou descrição que sustenta um sinal, respeitando minimização e direitos de uso |
| Dimensão | Grupo explicável de sinais, como descoberta, confiança, clareza e contato |
| Score | Síntese de 0–100 dos sinais verificáveis, com pesos e cobertura informados |
| Recomendação | Próxima ação associada a evidência, justificativa, impacto provável e esforço |
| Ação | Recomendação que o usuário marcou como iniciada, concluída, ignorada ou inaplicável |
| Reanálise | Nova análise destinada a confirmar mudanças desde uma linha de base |
| Melhoria verificada | Alteração positiva no mesmo sinal após ação registrada, sem alegar causalidade comercial |
| Relatório compartilhado | Visão somente leitura, revogável e limitada de uma análise |

### 3.1 Estados essenciais

- **Análise:** rascunho → confirmada → em processamento → concluída, parcial ou falhou → arquivada.
- **Recomendação:** nova → iniciada → concluída, ignorada ou inaplicável → verificada ou não verificada.
- **Relatório compartilhado:** inativo → ativo → expirado ou revogado.

O usuário nunca deve ver apenas “erro”. Deve saber se pode corrigir uma entrada, tentar novamente, continuar com análise parcial ou pedir ajuda.

---

## 4. Jornada do usuário

### 4.1 Jornada ponta a ponta

| Etapa | Objetivo do usuário | Interação principal | Resposta do produto | Critério de saída |
|---|---|---|---|---|
| Descoberta | Entender se o Verio é relevante | Lê promessa e exemplo | Explica resultado, fontes e limites | Inicia análise com expectativa correta |
| Identificação | Encontrar sua empresa | Informa nome e cidade | Sugere correspondências ou entrada manual | Confirma negócio correto |
| Canais | Confirmar o que será analisado | Revisa Google, site e WhatsApp | Mostra origem, permite corrigir ou declarar inexistente | Há ao menos um canal elegível |
| Concorrentes | Adicionar contexto opcional | Busca ou informa até três | Confirma identidade e comparabilidade | Pula ou confirma concorrentes |
| Processamento | Aguardar com segurança | Acompanha status | Explica etapas e resultados parciais | Análise concluída ou parcial |
| Primeiro insight | Entender a situação | Lê síntese e cobertura | Mostra ponto forte, principal atenção e limites | Abre evidências |
| Diagnóstico | Confiar na avaliação | Explora dimensões e sinais | Explica o score e permite contestar | Compreende ao menos uma causa |
| Ação | Decidir o próximo passo | Seleciona recomendação | Exibe motivo, esforço e instruções | Marca ação iniciada |
| Salvamento | Recuperar valor | Cria conta ou recebe acesso seguro | Preserva relatório e preferências | Conta/acesso confirmado |
| Execução | Realizar mudança fora ou dentro do canal | Segue passos e registra conclusão | Mantém status e explica reanálise | Ação marcada concluída |
| Retorno | Confirmar progresso | Solicita/recebe lembrete de reanálise | Compara a mesma evidência no tempo | Mudança verificada ou explicada |
| Continuidade | Decidir se vale acompanhar | Vê histórico e oferta | Expõe benefício, preço e cancelamento | Compra, permanece gratuito ou sai |

### 4.2 Estados emocionais desejados

- **Descoberta:** curiosidade sem medo.
- **Entrada:** sensação de baixo esforço.
- **Resultado:** clareza, não julgamento.
- **Ação:** confiança e capacidade.
- **Retorno:** progresso verificável, não gamificação.
- **Pagamento:** decisão informada, não urgência artificial.

### 4.3 Pontos de abandono a instrumentar

1. promessa → início;
2. busca → confirmação do negócio;
3. confirmação → início do processamento;
4. processamento → relatório;
5. resumo → evidência;
6. evidência → ação iniciada;
7. primeiro valor → criação de conta;
8. ação concluída → reanálise;
9. oferta → pagamento.

---

## 5. Fluxos do produto

### F01 — Iniciar uma análise

1. Usuário seleciona **Analisar minha empresa**.
2. Informa nome e cidade/região.
3. O produto apresenta correspondências com nome e endereço suficientes para diferenciar empresas.
4. Usuário confirma uma correspondência ou escolhe informar dados manualmente.
5. O produto mostra os canais encontrados sem iniciar análise oculta.
6. Usuário confirma, corrige ou marca cada canal como inexistente/não reconhecido.
7. O produto explica o que será analisado e solicita concordância aplicável.
8. Usuário pode seguir para concorrentes ou iniciar sem eles.

**Exceções**

- Nenhuma correspondência: permitir entrada manual e explicar possível redução de cobertura.
- Empresas homônimas: exigir localidade/endereço.
- Somente WhatsApp: informar que talvez não haja sinais suficientes antes de processar.
- Canal pertencente a terceiro: impedir uso quando identidade não puder ser confirmada de forma razoável.

### F02 — Adicionar concorrentes

1. Produto esclarece que comparação é opcional, privada e não altera a avaliação intrínseca do negócio.
2. Usuário adiciona nome/localidade ou link.
3. Produto apresenta a correspondência encontrada.
4. Usuário confirma até três empresas.
5. Produto avisa quando a comparação é limitada por segmento, localidade ou canais incomparáveis.
6. Usuário remove, substitui ou continua.

**Decisão:** o produto não sugere automaticamente “concorrentes” no MVP. Uma sugestão errada compromete confiança e introduz lógica de mercado ainda não validada.

### F03 — Processar a análise

1. Produto cria uma análise confirmada e registra a versão da metodologia.
2. Exibe estado de processamento e expectativa honesta de duração.
3. Avalia cada canal de forma independente.
4. Distingue sucesso, dado ausente, bloqueio e erro.
5. Se houver cobertura mínima, conclui como análise completa ou parcial.
6. Se não houver cobertura mínima, não produz score; mostra o que faltou e como corrigir.
7. Notifica o usuário apenas se ele forneceu canal e consentimento adequados.

### F04 — Entender o relatório

1. Cabeçalho mostra negócio, localidade, data, cobertura e estado.
2. Resumo apresenta uma força, uma prioridade e o principal limite da análise.
3. Score aparece com sua descrição: “síntese dos sinais verificáveis nesta data”.
4. Usuário abre dimensões, sinais e evidências.
5. Cada item informa resultado, origem, data e como influenciou a avaliação.
6. Usuário pode sinalizar fato incorreto ou recomendação inadequada.
7. Produto registra contestação sem alterar silenciosamente a metodologia.

### F05 — Comparar empresas

1. Usuário abre **Comparação**.
2. Produto apresenta apenas dimensões com cobertura comparável.
3. Empresas sem dado recebem “não verificável”, nunca zero por omissão.
4. Ranking é exibido somente quando ao menos duas empresas possuem cobertura mínima equivalente.
5. Empates e intervalos são permitidos.
6. Produto destaca diferenças factuais e evita linguagem depreciativa.

### F06 — Escolher e executar recomendação

1. Produto ordena 3–5 recomendações.
2. Usuário abre uma recomendação e vê evidência, objetivo, impacto provável, esforço, responsável típico e passos.
3. Usuário marca **Começar**, **Não se aplica** ou **Ignorar por agora**.
4. Ao começar, produto preserva a evidência de linha de base.
5. Usuário marca a ação concluída e informa opcionalmente o que fez.
6. Produto recomenda uma janela de reanálise compatível com o sinal.

### F07 — Salvar e criar conta

1. Após mostrar valor inicial, produto convida o usuário a salvar.
2. Explica o benefício: recuperar relatório, registrar ações e reanalisar.
3. Solicita o mínimo necessário para autenticação e recuperação.
4. Confirma acesso antes de associar ações sensíveis.
5. Preferências de comunicação ficam separadas do acesso à conta.
6. Recusar comunicação promocional não impede uso do produto.

### F08 — Reanalisar e verificar melhoria

1. Usuário solicita reanálise ou recebe lembrete operacional opt-in.
2. Produto confirma canais e informa o que será reavaliado.
3. Nova análise usa metodologia compatível ou explica mudança de versão.
4. Compara sinal por sinal com a linha de base.
5. Classifica a ação como verificada, ainda não verificável, sem mudança ou regressão observada.
6. Explica que associação temporal não prova impacto em vendas.
7. Atualiza histórico sem sobrescrever o relatório anterior.

### F09 — Compartilhar relatório

1. Usuário escolhe o conteúdo compartilhável e vê uma prévia.
2. Produto cria link somente leitura, revogável e com expiração padrão.
3. A visualização omite dados de conta, notas privadas e controles.
4. Proprietário pode revogar o link a qualquer momento.
5. Destinatário não consegue iniciar reanálise nem editar ações.

### F10 — Dar feedback ou contestar

1. Usuário seleciona um sinal ou recomendação.
2. Classifica como correto/incorreto ou útil/não útil.
3. Pode escolher um motivo e escrever comentário opcional.
4. Produto confirma recebimento e explica se haverá revisão.
5. Itens graves entram em revisão; a contestação não é usada como prova automática de correção.

### F11 — Comprar, cancelar e excluir

1. Oferta informa exatamente o benefício pago, preço, periodicidade e limites.
2. Compra exige confirmação explícita; não há opção pré-selecionada.
3. Cancelamento interrompe renovação sem apagar imediatamente histórico acessível durante o período contratado.
4. Exclusão de conta é diferente de cancelamento e informa consequências.
5. Solicitações de privacidade possuem confirmação e acompanhamento.

---

## 6. Regras de negócio

### 6.1 Elegibilidade e identidade

| ID | Regra |
|---|---|
| RN-001 | Toda análise deve referir-se a um negócio identificável por nome e localidade, não apenas por termo de busca. |
| RN-002 | O negócio principal deve possuir ao menos um canal comercial elegível confirmado pelo usuário. |
| RN-003 | Canal não reconhecido pelo usuário deve ser excluído até nova confirmação. |
| RN-004 | O produto não declara propriedade legal do negócio apenas porque o usuário o selecionou. |
| RN-005 | Ações sensíveis, histórico e compartilhamento exigem acesso confirmado à conta. |
| RN-006 | Negócios fora do ICP podem ser recusados ou receber aviso de metodologia não adequada. |

### 6.2 Análise e cobertura

| ID | Regra |
|---|---|
| RN-007 | Cada análise registra data, canais, cobertura e versão da metodologia. |
| RN-008 | Fato não verificável é “não verificável”, nunca inferido como negativo. |
| RN-009 | Erro de coleta não pode ser apresentado como falha do negócio. |
| RN-010 | Score somente é publicado quando a cobertura mínima definida pela rubrica for atendida. |
| RN-011 | Análise parcial deve identificar dimensões excluídas e efeito sobre comparabilidade. |
| RN-012 | Evidência deve sustentar diretamente o sinal e indicar sua origem/data. |
| RN-013 | Inferência gerada por IA deve ser distinguível de constatação factual. |
| RN-014 | Alteração metodológica não pode reescrever resultados históricos. |

### 6.3 Score

| ID | Regra |
|---|---|
| RN-015 | O score varia de 0 a 100 e é acompanhado por dimensões e pesos compreensíveis. |
| RN-016 | O score mede a presença observável segundo a rubrica, não qualidade total, reputação real ou probabilidade de compra. |
| RN-017 | Dados ausentes não recebem zero silenciosamente. |
| RN-018 | O mesmo conjunto de sinais e a mesma versão metodológica devem produzir resultado reproduzível dentro da tolerância validada. |
| RN-019 | Ajustes manuais exigem motivo auditável e não podem ocorrer para favorecer cliente. |
| RN-020 | Faixas descritivas devem usar linguagem neutra: “base a desenvolver”, “presença consistente”, nunca “empresa ruim”. |

### 6.4 Concorrência e ranking

| ID | Regra |
|---|---|
| RN-021 | Concorrentes são opcionais e limitados a três no MVP. |
| RN-022 | O score individual não muda quando concorrente é adicionado ou removido. |
| RN-023 | Ranking só compara empresas avaliadas sob versão e cobertura compatíveis. |
| RN-024 | Empates são válidos; casas decimais não devem sugerir precisão inexistente. |
| RN-025 | Comparações são privadas e não geram página pública indexável. |
| RN-026 | O usuário pode remover concorrente e seus dados da visão ativa. |

### 6.5 Recomendações e ações

| ID | Regra |
|---|---|
| RN-027 | Toda recomendação deve estar ligada a pelo menos um sinal/evidência. |
| RN-028 | Recomendações são ordenadas por impacto provável, esforço, confiança da evidência e controle do usuário. |
| RN-029 | O MVP exibe no máximo cinco recomendações prioritárias por análise. |
| RN-030 | Recomendações não garantem ranking, vendas ou retorno financeiro. |
| RN-031 | Recomendações reguladas ou de alto risco ficam fora do escopo ou passam por conteúdo aprovado. |
| RN-032 | Marcar ação concluída não equivale a melhoria verificada. |
| RN-033 | Melhoria só é verificada comparando o mesmo sinal após reanálise válida. |

### 6.6 Conta, comunicação e pagamento

| ID | Regra |
|---|---|
| RN-034 | Primeiro insight deve ser acessível antes de cadastro, quando segurança e recuperação permitirem. |
| RN-035 | Consentimento operacional, marketing e compartilhamento são finalidades separadas. |
| RN-036 | Lembretes são opt-in, possuem frequência clara e cancelamento simples. |
| RN-037 | Preço, renovação e limites aparecem antes da confirmação de compra. |
| RN-038 | Cancelamento de renovação não pode exigir contato humano. |
| RN-039 | Expiração de plano não apaga automaticamente dados sem política previamente informada. |

### 6.7 Privacidade, segurança e moderação

| ID | Regra |
|---|---|
| RN-040 | Coletar e reter somente dados necessários à finalidade informada. |
| RN-041 | Conteúdo público não deve ser tratado automaticamente como livre de restrições de uso ou reprodução. |
| RN-042 | Relatório compartilhado é somente leitura, revogável e não expõe dados privados da conta. |
| RN-043 | Usuário pode solicitar acesso, correção e exclusão conforme política aplicável. |
| RN-044 | Feedback não pode publicar acusação contra empresa ou pessoa. |
| RN-045 | Falha crítica de privacidade ou identidade bloqueia publicação/compartilhamento até resolução. |

---

## 7. Definição do MVP

### 7.1 Objetivo do MVP

Comprovar que o ICP consegue iniciar uma análise sem assistência, confia em pelo menos uma evidência, começa uma ação recomendada e demonstra disposição real de pagar para salvar, reanalisar ou acompanhar progresso.

### 7.2 Experiência mínima vendável

O MVP precisa permitir:

1. identificar e confirmar uma empresa;
2. confirmar Google/Maps, site e WhatsApp quando existirem;
3. gerar análise completa ou parcial com cobertura explícita;
4. explicar um score de 0–100 em dimensões;
5. abrir evidências de cada sinal;
6. receber entre três e cinco recomendações priorizadas;
7. iniciar e concluir uma ação;
8. salvar análise em conta leve;
9. executar uma reanálise e comparar sinais;
10. adicionar até três concorrentes opcionalmente;
11. compartilhar uma visão segura do relatório;
12. contestar fatos e avaliar utilidade;
13. aceitar uma oferta real e cancelar sem suporte.

### 7.3 MVP de descoberta versus MVP de software

**MVP concierge (primeiro):** coleta e produção parcialmente manuais, rubrica fixa, protótipo de relatório e oferta real. Serve para validar dor, cobertura, confiança, ação e pagamento.

**MVP de software (somente após gate):** automatiza fluxos repetíveis que passaram no concierge. Sua existência não deve ser confundida com validação de mercado.

### 7.4 Matriz de escopo

| Capacidade | Agora | Depois | Fora da tese atual | Justificativa |
|---|:---:|:---:|:---:|---|
| Identificação por nome/localidade | ✓ | | | Reduz entrada e erro de correspondência |
| Confirmação manual de canais | ✓ | | | Usuário é fonte de correção |
| Google/Maps, site e WhatsApp | ✓ | | | Núcleo da jornada local proposta |
| Score explicável e cobertura | ✓ | | | Testa compreensão e confiança |
| Evidências e contestação | ✓ | | | Guardrail essencial |
| 3–5 recomendações | ✓ | | | Valor acionável |
| Status de ação e reanálise | ✓ | | | Testa melhoria e retorno |
| Até três concorrentes | ✓, opcional | | | Testa valor incremental sem bloquear núcleo |
| Conta leve e histórico mínimo | ✓ | | | Recuperação e retenção |
| Relatório compartilhável seguro | ✓ | | | Suporta persona secundária e loop de aquisição |
| Oferta, compra e cancelamento | ✓ | | | Valida disposição a pagar |
| Alertas de mudança | | ✓ | | Somente se impulsionarem retorno |
| Benchmark por segmento/cidade | | ✓ | | Exige amostra confiável |
| Integrações para executar mudanças | | ✓ | | Só após provar quais ações importam |
| Equipe, permissões e comentários | | ✓ | | Complexidade prematura |
| Exportação/white-label | | ✓ | | Direcionado a agência, não ICP inicial |
| Múltiplas unidades | | ✓ | | Outro comprador e fluxo operacional |
| Redes sociais | | ✓ | | Volatilidade e amplitude antes de validar núcleo |
| Gestão de avaliações/publicações | | | ✓ | Transformaria o produto em suíte operacional |
| CRM/inbox/agendamento | | | ✓ | Não fortalece diretamente o diagnóstico |
| Criação de site/conteúdo | | | ✓ | Produto vende inteligência, não agência |
| Garantia de vendas/ranking | | | ✓ | Resultado não controlável |

### 7.5 Conteúdo mínimo do relatório

- Identificação, data e estado da análise.
- Canais incluídos, excluídos e não verificáveis.
- Explicação de uma frase sobre o que o score mede.
- Score total e 4–5 dimensões, se houver cobertura mínima.
- Uma força observada e uma prioridade.
- Sinais com evidência, fonte, data e influência.
- Três a cinco recomendações com impacto, esforço e confiança.
- Limitações e versão metodológica.
- Feedback, contestação, salvamento e compartilhamento.

---

## 8. Casos de uso

### UC-01 — Analisar o próprio negócio pela primeira vez

- **Ator:** Daniela.
- **Pré-condição:** possui nome/localidade e ao menos um canal comercial elegível.
- **Gatilho:** preocupação com queda de contatos, reputação ou comparação informal.
- **Fluxo principal:** executa F01 → F03 → F04.
- **Resultado:** recebe diagnóstico verificável ou explicação clara de cobertura insuficiente.
- **Sucesso:** abre duas evidências e entende a principal prioridade sem ajuda.

### UC-02 — Corrigir canais encontrados incorretamente

- **Ator:** Daniela.
- **Pré-condição:** produto encontrou site, perfil ou telefone incorreto.
- **Fluxo:** marca canal como não reconhecido → informa/corrige referência → confirma → análise utiliza apenas dados confirmados.
- **Resultado:** identidade do negócio preservada e erro registrado para qualidade.

### UC-03 — Receber análise parcial

- **Ator:** Daniela.
- **Pré-condição:** ao menos um canal não pôde ser verificado.
- **Fluxo:** produto conclui dimensões elegíveis → mostra cobertura → omite dimensão/score quando necessário → oferece correção/reanálise.
- **Resultado:** nenhum dado ausente é apresentado como falha.

### UC-04 — Comparar com um concorrente

- **Ator:** Daniela.
- **Pré-condição:** relatório principal existe; concorrente foi confirmado.
- **Fluxo:** executa F02 e F05.
- **Resultado:** visualiza diferenças somente onde há comparabilidade.
- **Sucesso:** comparação ajuda a escolher uma ação sem alterar o score próprio.

### UC-05 — Iniciar uma recomendação

- **Ator:** Daniela ou Rafael.
- **Pré-condição:** relatório contém recomendação aplicável.
- **Fluxo:** abre evidência → lê impacto/esforço/responsável → marca Começar.
- **Resultado:** linha de base preservada e ação em andamento.

### UC-06 — Marcar recomendação inaplicável

- **Ator:** Daniela.
- **Fluxo:** escolhe Não se aplica → informa motivo opcional → produto remove da fila ativa sem fingir execução.
- **Resultado:** feedback alimenta revisão de relevância, não recalcula nota automaticamente.

### UC-07 — Verificar uma melhoria

- **Ator:** Daniela.
- **Pré-condição:** ação concluída e janela de verificação adequada.
- **Fluxo:** executa F08 → produto compara sinal equivalente → apresenta resultado.
- **Resultado:** ação verificada, sem mudança, regressão ou não verificável.

### UC-08 — Compartilhar relatório com responsável pelo site

- **Ator:** Rafael.
- **Pré-condição:** acesso confirmado à conta.
- **Fluxo:** seleciona relatório → prévia → cria link → envia → destinatário consulta.
- **Resultado:** destinatário vê evidências e ações permitidas, sem dados privados ou edição.

### UC-09 — Contestar um fato

- **Ator:** Daniela.
- **Fluxo:** abre sinal → marca incorreto → escolhe motivo → envia.
- **Resultado:** contestação confirmada, sinal entra em revisão e impacto potencial é explicado.

### UC-10 — Salvar relatório depois do primeiro valor

- **Ator:** visitante.
- **Pré-condição:** já viu resumo inicial.
- **Fluxo:** escolhe salvar → cria/confirma acesso → relatório é associado.
- **Resultado:** consegue retornar sem aderir obrigatoriamente a marketing.

### UC-11 — Comprar acompanhamento

- **Ator:** Daniela.
- **Pré-condição:** recebeu valor e vê oferta disponível.
- **Fluxo:** compara benefício/limites → confirma periodicidade e preço → paga → recebe confirmação.
- **Resultado:** plano e próxima renovação ficam visíveis.

### UC-12 — Cancelar renovação

- **Ator:** Daniela.
- **Fluxo:** abre plano → cancelar renovação → vê consequências → confirma.
- **Resultado:** cobrança futura interrompida e acesso remanescente explicado.

### UC-13 — Excluir conta e dados

- **Ator:** titular da conta.
- **Fluxo:** solicita exclusão → verifica identidade → recebe consequências/prazos → confirma.
- **Resultado:** solicitação rastreável conforme política; links compartilhados são revogados.

### UC-14 — Recuperar uma análise que falhou

- **Ator:** visitante ou Daniela.
- **Fluxo:** produto identifica canal afetado → usuário corrige ou continua parcialmente → tenta novamente sem duplicar indevidamente a análise.
- **Resultado:** falha compreensível e recuperável.

---

## 9. Critérios de sucesso do produto

### 9.1 Definição de ativação

Uma conta é ativada quando, em até sete dias de uma análise válida, o usuário:

1. acessa o relatório;
2. abre ao menos duas evidências; e
3. inicia ao menos uma recomendação.

Cadastro, score visualizado ou relatório gerado isoladamente não constituem ativação.

### 9.2 North Star

**Contas com melhoria verificada por mês:** contas únicas com ao menos uma recomendação concluída e mudança positiva confirmada no sinal correspondente por reanálise comparável.

### 9.3 Metas do piloto

| Área | Métrica | Meta mínima | Guardrail |
|---|---|---:|---|
| Demanda | Visitante qualificado → inicia análise | 20% | Separar por canal de aquisição |
| Entrada | Confirmação → análise válida | 80% | Não aumentar com correspondência arriscada |
| Velocidade | Mediana até primeiro insight | <5 min percebidos | Nunca ocultar processamento real |
| Confiança | Avaliação 4–5/5 | 70% | Erro factual grave <5% |
| Ativação | Definição da seção 9.1 | 35% | Não usar notificações coercitivas |
| Execução | Conclui ≥1 ação em 14 dias | 25% | Ação autodeclarada separada de verificada |
| Valor | Melhoria verificada em 30 dias | 15% | Mesma metodologia/cobertura comparável |
| Conversão | Ativado → pago | 10% e ≥20 pagantes | Oferta real, sem cartão fictício |
| Retenção | Retorno qualificado no mês 2 | 30% | Excluir visitas apenas administrativas |
| Retenção paga | Pagantes ativos no mês 3 | 70% | Reportar base e intervalo, não só percentual |
| Economia | Payback projetado | ≤6 meses | Incluir trabalho manual e suporte |
| Privacidade | Incidente crítico | 0 | Interromper piloto se ocorrer |

### 9.4 Qualidade do diagnóstico

- Cobertura útil em pelo menos 85% das empresas qualificadas.
- Pelo menos três constatações verificáveis por análise válida.
- Estabilidade de itens determinísticos igual ou superior a 95%.
- Toda alegação factual apresentada ao usuário ligada a uma evidência.
- Menos de 10% de recomendações marcadas como inaplicáveis por erro de contexto; meta a calibrar no concierge.

### 9.5 Critérios de decisão

- **Continuar:** qualidade, confiança, execução, pagamento e segurança aprovados.
- **Iterar UX/conteúdo:** dor e pagamento existem, mas usuários não entendem ou executam.
- **Mudar monetização:** valor pontual é comprovado, mas retorno/assinatura não.
- **Reduzir escopo:** comparação ou score pioram confiança sem aumentar ação.
- **Pivotar/encerrar:** cobertura estrutural baixa, confiança abaixo de 50% após duas iterações ou ausência de pagamento em oferta real.

---

## 10. Requisitos transversais de experiência e qualidade

Estes são resultados esperados, não decisões arquiteturais.

### 10.1 Conteúdo e linguagem

- Português brasileiro claro, frases curtas e termos técnicos explicados no contexto.
- Tom respeitoso, diagnóstico e não punitivo.
- Diferenciar “não encontrado”, “não existe”, “não foi possível verificar” e “não se aplica”.
- Não chamar conteúdo gerado de “verdade” ou “auditoria completa”.
- Toda promessa comercial deve corresponder a capacidade observável.

### 10.2 Acessibilidade

- Fluxos essenciais utilizáveis por teclado e tecnologia assistiva.
- Estrutura semântica, foco visível, rótulos e mensagens de erro associadas aos campos.
- Cor nunca é o único indicador de score, status ou prioridade.
- Contraste e tamanho de alvo compatíveis com uso móvel.
- Gráficos possuem alternativa textual.

### 10.3 Responsividade

- Entrada, leitura do resumo, abertura de evidência e início de ação funcionam integralmente no celular.
- Tabelas comparativas devem se adaptar sem exigir leitura microscópica.
- A experiência não depende de aplicativo nativo.

### 10.4 Desempenho percebido e resiliência

- Ação do usuário recebe confirmação imediata.
- Processamento longo exibe estado real, permite saída segura e recuperação.
- Resultado parcial é preferível a espera indefinida, desde que claramente identificado.
- Repetir uma ação não deve criar cobrança, análise ou compartilhamento duplicado sem confirmação.

### 10.5 Observabilidade de produto

Eventos devem representar fatos do funil, com definição, origem e versão documentadas. No mínimo:

- `analysis_started`;
- `business_confirmed`;
- `channels_confirmed`;
- `analysis_completed` ou `analysis_failed`;
- `report_viewed`;
- `evidence_opened`;
- `recommendation_started`;
- `recommendation_completed`;
- `reanalysis_completed`;
- `improvement_verified`;
- `report_feedback_submitted`;
- `account_created`;
- `offer_viewed`;
- `purchase_completed`;
- `subscription_cancelled`;
- `share_created` e `share_revoked`.

Eventos não devem registrar conteúdo pessoal desnecessário, URLs sensíveis ou texto livre integral por padrão.

### 10.6 Suporte e falhas

- Mensagens explicam o que aconteceu, o impacto e o próximo passo.
- Feedback crítico possui confirmação e referência rastreável.
- Correção de fato não depende de o usuário conhecer a implementação.
- Incidentes de privacidade, identidade ou cobrança possuem prioridade máxima e resposta operacional definida antes do beta.

---

## 11. Backlog inicial priorizado

O backlog está ordenado por risco de produto, não por conveniência de construção. **P0** valida o núcleo; **P1** completa a experiência mínima vendável; **P2** é condicionado a evidência. Estimativas técnicas deliberadamente não foram incluídas.

### Épico E0 — Descoberta antes do software

| ID | Pri. | História/experimento | Critérios de aceite |
|---|:---:|---|---|
| PB-001 | P0 | Como time, entrevistar o ICP sobre episódios reais | ≥30 entrevistas; roteiro sem apresentar solução no início; evidências e padrões registrados por vertical |
| PB-002 | P0 | Como time, auditar cobertura de sinais | 100 empresas, ≥3 cidades, erros/tempo/cobertura por canal registrados |
| PB-003 | P0 | Como usuário, receber relatório concierge | 30–50 entregas; evidências verificáveis; follow-up D7 e D30 |
| PB-004 | P0 | Como time, comparar relatório com e sem score | Alocação registrada; compreensão, confiança e ação comparadas |
| PB-005 | P0 | Como comprador, receber oferta real | 2–3 formatos/preços; escolha e motivo registrados; sem simular cobrança |
| PB-006 | P0 | Como time, escolher um vertical | Decisão usa dor, dados, execução, pagamento e acesso; justificativa documentada |

### Épico E1 — Identificação e entrada

| ID | Pri. | História | Critérios de aceite |
|---|:---:|---|---|
| PB-010 | P0 | Como visitante, informar nome e localidade | Campos têm exemplos, validação compreensível e funcionam no celular |
| PB-011 | P0 | Como visitante, confirmar a empresa correta | Opções distinguem nome/endereço; nenhuma é escolhida automaticamente em ambiguidade |
| PB-012 | P0 | Como visitante, informar empresa manualmente | Fluxo existe quando busca falha e explica impacto na cobertura |
| PB-013 | P0 | Como visitante, confirmar/corrigir canais | Cada canal pode ser confirmado, corrigido, negado ou marcado inexistente |
| PB-014 | P0 | Como visitante, entender dados e finalidade | Fontes, finalidade e limitações aparecem antes da análise |
| PB-015 | P1 | Como visitante, retomar entrada interrompida | Retorno seguro preserva apenas dados necessários e informa expiração |

### Épico E2 — Análise e cobertura

| ID | Pri. | História | Critérios de aceite |
|---|:---:|---|---|
| PB-020 | P0 | Como usuário, iniciar análise confirmada | Resumo de entradas aparece; início é explícito; duplicação acidental evitada |
| PB-021 | P0 | Como usuário, acompanhar processamento | Estado real, duração estimada honesta e opção de sair/retornar |
| PB-022 | P0 | Como usuário, receber resultado parcial | Canais falhos e dimensões afetadas aparecem; ausência não vira zero |
| PB-023 | P0 | Como usuário, recuperar uma falha | Mensagem indica canal, impacto e ação de correção/tentativa |
| PB-024 | P0 | Como time, versionar metodologia no relatório | Toda análise exibe versão/data; histórico não muda retroativamente |

### Épico E3 — Relatório explicável

| ID | Pri. | História | Critérios de aceite |
|---|:---:|---|---|
| PB-030 | P0 | Como usuário, ver síntese inicial | Mostra força, prioridade, cobertura e limite antes de detalhes |
| PB-031 | P0 | Como usuário, entender o score | Definição, dimensões e pesos acessíveis; não confunde score com vendas/qualidade total |
| PB-032 | P0 | Como usuário, abrir um sinal | Resultado, fonte, data e influência ficam visíveis |
| PB-033 | P0 | Como usuário, distinguir fato de inferência | Rótulo e linguagem diferenciam constatação e interpretação |
| PB-034 | P0 | Como usuário, contestar um fato | Motivo selecionável, comentário opcional e confirmação de recebimento |
| PB-035 | P1 | Como usuário, avaliar o relatório | Escala e motivo capturam confiança/utilidade sem bloquear navegação |

### Épico E4 — Recomendações e execução

| ID | Pri. | História | Critérios de aceite |
|---|:---:|---|---|
| PB-040 | P0 | Como usuário, ver prioridades | Exibe 3–5 itens ordenados; cada um ligado a evidência |
| PB-041 | P0 | Como usuário, entender uma recomendação | Inclui motivo, impacto provável, esforço, confiança e responsável típico |
| PB-042 | P0 | Como usuário, iniciar ação | Estado muda para iniciada e preserva linha de base |
| PB-043 | P0 | Como usuário, concluir ação | Conclusão autodeclarada permanece distinta de verificação |
| PB-044 | P1 | Como usuário, marcar item inaplicável/ignorado | Motivo opcional; item sai da fila ativa; score não muda automaticamente |
| PB-045 | P1 | Como usuário, receber passos curtos | Instruções possuem sequência, pré-requisito e limite; sem aconselhamento regulado |

### Épico E5 — Conta, recuperação e consentimento

| ID | Pri. | História | Critérios de aceite |
|---|:---:|---|---|
| PB-050 | P0 | Como visitante, ver valor antes do cadastro | Ao menos a síntese e uma evidência são acessíveis antes do convite |
| PB-051 | P0 | Como visitante, salvar relatório | Benefício explicado; mínimo de dados solicitado; acesso confirmado |
| PB-052 | P0 | Como usuário, recuperar acesso | Processo seguro, compreensível e sem expor existência indevida de conta |
| PB-053 | P0 | Como usuário, controlar comunicações | Operacional e marketing separados; opt-out simples |
| PB-054 | P1 | Como usuário, solicitar exclusão | Consequências, confirmação e estado da solicitação visíveis |

### Épico E6 — Reanálise e progresso

| ID | Pri. | História | Critérios de aceite |
|---|:---:|---|---|
| PB-060 | P0 | Como usuário, solicitar reanálise | Canais reconfirmados; custo/limite explicado; análise anterior preservada |
| PB-061 | P0 | Como usuário, comparar sinais no tempo | Apenas sinais comparáveis aparecem como mudança; versão metodológica indicada |
| PB-062 | P0 | Como usuário, confirmar melhoria | Resultado é verificado, sem mudança, regressão ou não verificável |
| PB-063 | P1 | Como usuário, ver histórico mínimo | Datas, scores comparáveis e ações aparecem sem sobrescrever versões |
| PB-064 | P2 | Como usuário, receber lembrete de reanálise | Somente opt-in; janela compatível; frequência/cancelamento visíveis |

### Épico E7 — Concorrentes

| ID | Pri. | História | Critérios de aceite |
|---|:---:|---|---|
| PB-070 | P1 | Como usuário, adicionar concorrente | Confirma identidade; máximo três; etapa pode ser pulada |
| PB-071 | P1 | Como usuário, remover/substituir concorrente | Ação não altera score próprio nem histórico original |
| PB-072 | P1 | Como usuário, ver comparação justa | Apenas dimensões compatíveis; ausente não é zero; empate permitido |
| PB-073 | P1 | Como usuário, entender limite da comparação | Localidade, canais e cobertura insuficiente são explicitados |
| PB-074 | P2 | Como time, testar valor incremental | Experimento com/sem comparação mede ação e confiança antes de expansão |

### Épico E8 — Compartilhamento

| ID | Pri. | História | Critérios de aceite |
|---|:---:|---|---|
| PB-080 | P1 | Como usuário, visualizar prévia compartilhável | Conteúdo privado e controles são omitidos antes de criar link |
| PB-081 | P1 | Como usuário, criar link somente leitura | Link possui expiração e não permite edição/reanálise |
| PB-082 | P1 | Como usuário, revogar compartilhamento | Revogação é imediata para novos acessos e estado fica visível |
| PB-083 | P2 | Como time, medir indicação | Visita/início atribuído sem expor destinatário desnecessariamente |

### Épico E9 — Monetização

| ID | Pri. | História | Critérios de aceite |
|---|:---:|---|---|
| PB-090 | P0 | Como usuário ativado, ver oferta real | Benefício, preço, periodicidade, limites e cancelamento antes da compra |
| PB-091 | P0 | Como comprador, confirmar compra | Consentimento explícito; confirmação e próxima cobrança visíveis |
| PB-092 | P0 | Como assinante, cancelar renovação | Autônomo, sem contato humano obrigatório e com consequência clara |
| PB-093 | P1 | Como usuário, consultar plano/cobrança | Estado, limites e histórico essencial compreensíveis |
| PB-094 | P2 | Como time, testar compra avulsa versus assinatura | Coortes e proposta são registradas; decisão usa conversão e retenção |

### Épico E10 — Qualidade, segurança e operação

| ID | Pri. | História | Critérios de aceite |
|---|:---:|---|---|
| PB-100 | P0 | Como time, medir funil definido | Eventos essenciais têm dicionário, versão e validação; sem dados pessoais desnecessários |
| PB-101 | P0 | Como time, revisar erros factuais | Amostra e contestações classificadas; erros graves tratados antes de expansão |
| PB-102 | P0 | Como titular, exercer direitos de dados | Fluxo e responsabilidade operacional definidos antes do beta |
| PB-103 | P0 | Como time, responder incidente crítico | Critérios, responsáveis e interrupção do piloto documentados |
| PB-104 | P0 | Como usuário com deficiência, concluir fluxo essencial | Entrada, relatório, evidência e ação passam por teste de acessibilidade |
| PB-105 | P1 | Como time, acompanhar custo unitário | Tempo humano, fontes, processamento e suporte por análise registrados |

### 11.1 Sequência recomendada

1. **E0:** validar manualmente.
2. **E1–E4:** construir somente o caminho até ação, se E0 passar.
3. **E5–E6:** provar recuperação, retorno e melhoria.
4. **E9:** cobrar desde o piloto, não depois de “terminar”.
5. **E7–E8:** incluir apenas se testes mostrarem ganho de ação, confiança ou aquisição.
6. **E10:** atravessa todas as etapas e nunca é deixado para o fim.

---

## 12. Mapa de releases por aprendizagem

| Release | Pergunta respondida | Capacidades | Gate |
|---|---|---|---|
| R0 — Concierge | A dor, os dados e o diagnóstico são reais? | PB-001 a PB-006, processo manual e protótipo | Dor ≥60%, cobertura ≥85%, confiança ≥70%, ação ≥40% acompanhada |
| R1 — Primeiro valor | O usuário chega ao insight sem assistência? | E1, E2, E3 e leitura de E4 | Conclusão ≥80%, erro grave <5%, evidências abertas |
| R2 — Ação | Recomendações mudam comportamento? | E4 e conta mínima de E5 | Ativação ≥35%, conclusão de ação ≥25% |
| R3 — Progresso | Há motivo real para retornar? | E6 e histórico mínimo | Melhoria verificada ≥15%, retorno M2 ≥30% |
| R4 — Monetização | O valor sustenta pagamento? | E9, suporte e custos | ≥20 pagantes, conversão ≥10%, margem positiva |
| R5 — Contexto/growth | Comparação ou compartilhamento ampliam valor? | E7/E8 selecionados | Melhoria estatisticamente/direcionalmente relevante sem piorar confiança |

Releases são gates de aprendizado, não datas. Uma release não avança porque o backlog anterior foi implementado; avança quando a pergunta foi respondida com evidência suficiente.

---

## 13. Dependências e decisões pendentes

### 13.1 Decisões bloqueadoras antes da implementação

| Decisão | Evidência necessária | Responsável primário |
|---|---|---|
| Vertical inicial | Entrevistas, cobertura e oferta real | Produto/fundador |
| Rubrica e cobertura mínima | Auditoria manual e teste de repetibilidade | Produto, pesquisa e especialista de domínio |
| Permanência do score | Experimento score versus recomendações | Produto/UX Research |
| Papel dos concorrentes | Experimento com/sem comparação | Produto/UX |
| Modelo inicial de cobrança | Compra real avulsa versus recorrente | Produto/growth/fundador |
| Fontes permitidas e retenção | Revisão jurídica, termos e minimização | Responsável jurídico/privacidade |
| Cadência de reanálise | Tempo observado até mudança dos sinais | Produto/pesquisa |

### 13.2 Decisões que não devem bloquear descoberta

- Framework, linguagem ou provedor de nuvem.
- Arquitetura definitiva.
- Aplicativo nativo.
- Design system completo.
- API pública.
- Modelo de IA “final”.
- Estrutura para múltiplas unidades ou marca branca.

### 13.3 Perguntas abertas

1. Um relatório sem score gera mais confiança e a mesma ação?
2. Qual evidência é percebida como mais valiosa: reputação, coerência, site ou contato?
3. Usuários conseguem executar ou querem delegar?
4. Qual parte merece pagamento: diagnóstico, histórico, reanálise, monitoramento ou orientação?
5. A comparação muda uma decisão ou somente satisfaz curiosidade?
6. Em quanto tempo uma melhoria pública pode ser reavaliada de forma justa?
7. Link compartilhável ajuda execução e indicação ou cria risco de exposição?

---

## 14. Definition of Ready e Definition of Done de produto

### 14.1 Uma história está pronta para implementação quando

- possui problema e usuário identificados;
- tem resultado esperado e critérios de aceite observáveis;
- regras de negócio aplicáveis estão referenciadas;
- estados vazio, erro, parcial, carregamento e sucesso foram considerados;
- conteúdo e dados necessários estão definidos;
- implicações de privacidade, acessibilidade e instrumentação foram revisadas;
- dependências externas e hipótese a validar estão explícitas;
- não exige decisão arquitetural dentro do requisito de produto.

### 14.2 Uma história está concluída do ponto de vista de produto quando

- critérios de aceite passaram em cenário principal e exceções relevantes;
- conteúdo é compreensível no teste com usuário do ICP;
- fluxo essencial funciona no celular e com acessibilidade prevista;
- eventos produzem dados coerentes com o dicionário;
- erros não são convertidos em diagnóstico negativo;
- fontes, cobertura e limitações aparecem quando aplicáveis;
- feedback de qualidade e suporte está operacional;
- resultado foi observado no ambiente do piloto, não apenas demonstrado internamente.

---

## 15. Checklist de aprovação do blueprint

Antes de iniciar implementação, founder, produto, UX, responsável técnico e responsável por privacidade devem confirmar:

- [ ] O vertical e o usuário comprador estão escolhidos por evidência.
- [ ] O problema ocorreu recentemente para a maioria qualificada entrevistada.
- [ ] A rubrica foi aplicada manualmente a 100 empresas e é repetível.
- [ ] A cobertura mínima para publicar score está definida.
- [ ] Score demonstrou acrescentar valor ou foi removido.
- [ ] Comparação demonstrou valor incremental ou permanece fora do caminho principal.
- [ ] Recomendações foram executadas por usuários reais.
- [ ] Existe oferta real e critério de preço a testar.
- [ ] Fontes, termos, LGPD, retenção, contestação e exclusão foram revisados.
- [ ] Fluxos de identidade, análise parcial e falha têm comportamento definido.
- [ ] Métricas, eventos e guardrails têm definições inequívocas.
- [ ] O backlog P0 cabe em um experimento enxuto e não contém suíte operacional.
- [ ] Não há promessa de vendas, ranking ou precisão incompatível com a evidência.
- [ ] Há uma decisão explícita de continuar, iterar ou parar ao fim de cada release.

Se qualquer item de score, dados, confiança, segurança ou pagamento estiver sem resposta, a próxima atividade é descoberta — não desenvolvimento.

---

## Conclusão

O blueprint transforma a tese da Fase 1 em um produto testável: identificar corretamente o negócio, analisar apenas o que pode ser verificado, explicar cada conclusão, orientar poucas ações e confirmar mudanças sem alegar resultados que o Verio não controla.

A prioridade não é implementar todos os fluxos descritos. É percorrer a sequência de risco com a menor solução possível: **dor → cobertura → confiança → ação → pagamento → retorno**. O backlog, as releases e as regras existem para impedir que score, concorrência ou IA se tornem objetivos próprios. O produto só avança quando pequenos negócios reconhecem a evidência, conseguem agir e escolhem pagar pelo progresso.
