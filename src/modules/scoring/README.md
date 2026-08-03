# Verio Score

O Verio Score é um cálculo puro, determinístico e versionado. Ele transforma
sinais verificáveis em uma nota de 0 a 100 sem consultar IA, banco ou serviços
externos. A política inicial está em `policies/verio-score-v1.ts`; novas
análises usam `policies/verio-score-v2.ts`.

## Coleta técnica da versão 2

A versão 2 mantém o cálculo separado da coleta. Antes de calcular o score, o
processador audita fundamentos observáveis do site (resposta HTTP, title, meta
description, H1, canonical, viewport, idioma, conteúdo comercial e contato) e
a estrutura internacional do número presente no link do WhatsApp. Redireções e
endereços resolvidos são validados para bloquear redes privadas, a resposta é
limitada e falhas de coleta viram `NOT_VERIFIABLE` em vez de reprovação.

Esta versão ainda não executa Lighthouse, não confirma operacionalmente o
WhatsApp e não consulta conteúdo ou avaliações do Google Maps. Esses sinais
permanecem parciais ou não verificáveis até existirem coletores autorizados.

## Categorias e pesos da versão 1

| Categoria  | Peso | O que representa                                             |
| ---------- | ---: | ------------------------------------------------------------ |
| Descoberta |  25% | Capacidade de encontrar e identificar corretamente o negócio |
| Confiança  |  35% | Sinais públicos que reduzem risco percebido                  |
| Clareza    |  20% | Compreensão da oferta e do próprio negócio                   |
| Contato    |  20% | Facilidade e coerência para iniciar uma conversa             |

Os pesos somam 100 apenas para facilitar a leitura; o algoritmo normaliza a soma
e não depende disso.

Na versão 2 os pesos são Descoberta 25%, Confiança 30%, Clareza 25% e Contato
20%. A versão gravada na análise determina qual política será usada, preservando
o processamento de análises históricas da versão 1.

## Valor dos resultados

| Resultado do sinal | Pontos | Tratamento                         |
| ------------------ | -----: | ---------------------------------- |
| `POSITIVE`         |    100 | Evidência atende ao critério       |
| `PARTIAL`          |     50 | Evidência atende parcialmente      |
| `NEGATIVE`         |      0 | Evidência verificável não atende   |
| `NOT_VERIFIABLE`   |      — | Excluído da nota e reduz cobertura |

Ausência ou falha de coleta nunca se transforma silenciosamente em zero.

## Fórmula

Para cada categoria `c`, usando apenas sinais verificáveis:

```text
categoria(c) = Σ(valor_do_resultado × peso_do_sinal) / Σ(peso_do_sinal)
```

O total usa os pesos das categorias que possuem ao menos um sinal verificável:

```text
score = Σ(categoria(c) × peso_da_categoria) / Σ(pesos_disponíveis)
```

A cobertura considera todos os sinais esperados e é ponderada pelas categorias:

```text
cobertura(c) = Σ(pesos_verificados) / Σ(pesos_esperados)
cobertura_total = Σ(cobertura(c) × peso_da_categoria) / Σ(pesos_das_categorias)
```

A versão 1 exige **60% de cobertura**. Abaixo desse limite, o resultado é
`INSUFFICIENT_COVERAGE` e `totalScore` permanece `null`, mesmo que as categorias
disponíveis tenham notas altas.

## Arredondamento e invariantes

- Categoria e score final são arredondados para o inteiro mais próximo.
- Cobertura mantém duas casas decimais.
- Todo valor publicado permanece entre 0 e 100.
- Zero é uma nota válida; `null` significa que não há cobertura suficiente.
- Observações duplicadas ou sinais ausentes da política causam erro explícito.
- Todas as quatro categorias sempre aparecem no resultado, inclusive com nota
  `null`, para deixar lacunas visíveis.

## Evolução

Nunca altere `VERIO_SCORE_V1` depois de usado em uma análise persistida. Para
mudar sinais, pesos, resultados ou cobertura mínima:

1. crie uma nova política, por exemplo `verio-score-v2.ts`;
2. atribua uma `version` inédita;
3. adicione testes de regressão e exemplos de comparação;
4. persista a versão junto da análise;
5. não recalcule relatórios históricos silenciosamente.

O algoritmo recebe qualquer `ScorePolicy` válida. Assim, evoluir a metodologia
não exige duplicar a função, integrar IA ou mudar dados históricos.
