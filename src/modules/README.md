# Módulos do produto

Cada capacidade validada do Verio deve ser implementada como um slice em sua
própria pasta. Os módulos planejados são:

- `identity`
- `businesses`
- `analyses`
- `scoring`
- `recommendations`
- `competitors`
- `reports`
- `feedback`
- `billing`
- `privacy`

Não crie pastas vazias antecipadamente. Um módulo nasce junto com o primeiro
caso de uso validado e exporta sua API pública por um `index.ts` local.
