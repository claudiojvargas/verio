# AI Analyzer

Módulo provider-neutral para tarefas estruturadas de IA. O domínio e os casos de
uso dependem somente de três contratos:

- `AIProvider`: fronteira externa para geração estruturada;
- `PromptBuilder`: transforma entrada validada em prompt versionado;
- `AIAnalyzer`: caso de uso consumido pelo restante da aplicação.

`StructuredAIAnalyzer` orquestra esses contratos sem conhecer SDKs. O adapter
inicial do Google fica exclusivamente em `infrastructure/google`; trocar o
fornecedor exige outro adapter, não mudanças nas regras do Verio.

O primeiro uso, em `modules/analyses/ai`, produz somente rascunhos fundamentados
nas evidências fornecidas. Score, cobertura, comparabilidade, prioridade final e
persistência continuam determinísticos e fora deste módulo.

## Criando outro provider

1. Implemente `AIProvider` em uma nova pasta de `infrastructure`.
2. Converta erros e métricas do SDK para os tipos internos.
3. Valide toda saída em runtime com o schema recebido.
4. Crie uma composition root para selecionar o adapter.
5. Execute os testes com um fake provider; nenhum teste de regra deve exigir SDK.

Nunca exporte o SDK de um fornecedor pelo `index.ts` público.
