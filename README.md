# doc-guard

[![CI](https://github.com/MaatheusPolli/doc-guard/actions/workflows/ci.yml/badge.svg?branch=master)](https://github.com/MaatheusPolli/doc-guard/actions/workflows/ci.yml)
[![Licença: MIT pessoal + comercial](https://img.shields.io/badge/licen%C3%A7a-MIT%20pessoal%20%2B%20comercial-blue.svg)](LICENSE)

Validação, formatação e geração de documentos brasileiros em TypeScript:
**CPF**, **CNPJ** (inclusive o novo **CNPJ alfanumérico** de 2026) e **Inscrição Estadual das 27 UFs**.

- Zero dependências de runtime, ESM + CJS + `.d.ts`, Node e browser.
- Tree-shakeable: `@matheuspolli/doc-guard/cpf` sozinho tem **< 1 KB gzip**.
- `validate` aceita valores com ou sem máscara e nunca lança; `assertValid` lança `InvalidDocumentError`.
- `generate` com `seed` para massa de teste reprodutível.
- 1.000+ testes: exemplos oficiais do Sintegra, IEs de 250 empresas reais, property-based com fast-check e 100% das linhas cobertas.

## Instalação

```bash
npm install @matheuspolli/doc-guard
```

Ou clone e gere o build localmente:

```bash
git clone https://github.com/MaatheusPolli/doc-guard.git
cd doc-guard && npm install && npm run build
```

## Uso

```ts
import { cpf, cnpj, ie, detect } from '@matheuspolli/doc-guard';

cpf.validate('529.982.247-25'); // true
cpf.validate('111.111.111-11'); // false (sequência repetida)
cpf.format('52998224725'); // '529.982.247-25'
cpf.unformat('529.982.247-25'); // '52998224725'
cpf.generate({ seed: 42, formatted: true }); // sempre o mesmo CPF

cnpj.validate('11.222.333/0001-81'); // true
cnpj.validate('12.ABC.345/01DE-35'); // true  ← alfanumérico
cnpj.validate('12.ABC.345/01DE-35', { alphanumeric: false }); // false
cnpj.generate({ alphanumeric: true, formatted: true });

ie.validate('SP', '110.042.490.114'); // true
ie.validate('mg', '062.307.904/0081'); // true (UF case-insensitive)
ie.validateAny('06000001-5'); // ['CE', 'PB', …] — todas as UFs compatíveis
ie.format('RS', '2243658792'); // '224/3658792'
ie.generate('PR', { seed: 1 });

detect('529.982.247-25'); // 'cpf'
detect('12.ABC.345/01DE-35'); // 'cnpj'
detect('110.042.490.114'); // 'ie'
detect('123'); // null
```

### Importando só o que precisa

```ts
import { validate } from '@matheuspolli/doc-guard/cpf'; // não carrega CNPJ nem as 27 regras de IE
import { validate as validateCnpj } from '@matheuspolli/doc-guard/cnpj';
import { validate as validateIe } from '@matheuspolli/doc-guard/ie';
```

### Erros

```ts
import { cpf, InvalidDocumentError } from '@matheuspolli/doc-guard';

try {
  cpf.assertValid(input);
} catch (e) {
  if (e instanceof InvalidDocumentError) console.log(e.document, e.value);
}
```

## CNPJ alfanumérico (2026)

A partir de julho de 2026 (IN RFB nº 2.229/2024), as 12 primeiras posições do CNPJ
passam a aceitar letras `A–Z`. Os dois dígitos verificadores continuam numéricos e são
calculados pelo mesmo módulo 11, mas cada caractere vale **código ASCII − 48**
(`0–9` → 0–9, `A` → 17, …, `Z` → 42). Por isso o cálculo é retrocompatível: para bases
numéricas o resultado é idêntico ao algoritmo clássico — e o doc-guard testa isso.

Implementações que fazem `value.replace(/\D/g, '')` antes de validar **quebram** com o novo formato.

## Suporte por UF (Inscrição Estadual)

| UF  | Tamanho    | Máscara                                | Observação                           |
| --- | ---------- | -------------------------------------- | ------------------------------------ |
| AC  | 13         | `##.###.###/###-##`                    | prefixo 01, 2 DVs                    |
| AL  | 9          | `########-#`                           | prefixo 24                           |
| AM  | 9          | `##.###.###-#`                         |                                      |
| AP  | 9          | `##.###.###-#`                         | prefixo 03, faixas p/d               |
| BA  | 8 ou 9     | `######-##` / `#######-##`             | módulo 10 ou 11 conforme dígito      |
| CE  | 9          | `########-#`                           |                                      |
| DF  | 13         | `##.######.###-##`                     | prefixo 07/08, 2 DVs                 |
| ES  | 9          | `###.###.##-#`                         |                                      |
| GO  | 9          | `##.###.###-#`                         | prefixos 10, 11, 15, 20–29           |
| MA  | 9          | `##.###.###-#`                         | prefixo 12                           |
| MG  | 13         | `###.###.###/####`                     | 2 DVs (soma de algarismos + mód. 11) |
| MS  | 9          | `##.###.###-#`                         | prefixo 28/50                        |
| MT  | 9 a 11     | `##.###.###-#` / `##########-#`        | completa com zeros à esquerda        |
| PA  | 9          | `##-######-#`                          | prefixo 15, 75–79                    |
| PB  | 9          | `########-#`                           |                                      |
| PE  | 9 ou 14    | `#######-##` / `##.#.###.#######-#`    | eFisco e CACEPE antigo               |
| PI  | 9          | `#########`                            |                                      |
| PR  | 10         | `########-##`                          | 2 DVs                                |
| RJ  | 8          | `##.###.##-#`                          |                                      |
| RN  | 9 ou 10    | `##.###.###-#` / `##.#.###.###-#`      | prefixo 20                           |
| RO  | 9 ou 14    | `###.#####-#` / `#############-#`      | formato antigo e atual               |
| RR  | 9          | `########-#`                           | prefixo 24, módulo 9                 |
| RS  | 10         | `###/#######`                          |                                      |
| SC  | 9          | `###.###.###`                          |                                      |
| SE  | 9          | `########-#`                           |                                      |
| SP  | 12 ou P+12 | `###.###.###.###` / `P-########.#/###` | inclui produtor rural                |
| TO  | 9 ou 11    | `########-#` / `##.##.######-#`        | formato antigo com tipo 01/02/03/99  |

Cada regra fica em `src/ie/rules/<uf>.ts` com o roteiro do Sintegra citado no comentário.

As regras são testadas contra duas bases:

- `tests/fixtures/ie-samples.json`: exemplos oficiais dos roteiros do Sintegra e IEs reais, com a
  origem de cada valor registrada, além de casos inválidos (DV alterado, tamanho errado).
- `tests/fixtures/ie-real.json`: 250 IEs de empresas reais das 27 UFs, compiladas pelo projeto
  [brazilian_documents](https://github.com/fidelisrafael/brazilian_documents) (MIT, © 2016 Rafael Fidelis).

> **Ambiguidade:** alguns tamanhos coincidem (ex.: 11 dígitos = CPF ou IE de MT/TO).
> `detect` prioriza CPF → CNPJ → IE; `ie.validateAny` devolve todas as UFs compatíveis.

## Benchmark

`npm run bench` (Node 22, container Linux, 1.000 documentos por iteração):

| Operação                           | Validações/s |
| ---------------------------------- | -----------: |
| `cpf.validate`                     |  ~1,1 milhão |
| `cnpj.validate` (50% alfanumérico) |  ~0,8 milhão |
| `ie.validate('SP', …)`             |  ~1,0 milhão |
| `ie.validateAny` (27 regras)       |     ~128 mil |

1 milhão de validações de CPF levam menos de 1 segundo.

## Limitação conhecida do módulo 11

O dígito verificador detecta qualquer alteração nos próprios DVs, mas **não** todo erro de
um dígito na base: na regra "resto < 2 → 0", os restos 0 e 1 geram o mesmo DV. Exemplo: os
CPFs `704.074.412-04` e `604.074.412-04` são ambos válidos. Isso é uma propriedade do
algoritmo oficial, não da biblioteca — e está documentado nos testes.

## API

| Módulo | Funções                                                                                                                    |
| ------ | -------------------------------------------------------------------------------------------------------------------------- |
| `cpf`  | `validate`, `assertValid`, `format`, `unformat`, `generate`, `computeCheckDigits`                                          |
| `cnpj` | `validate`, `assertValid`, `format`, `unformat`, `generate`, `computeCheckDigits`, `isAlphanumeric`, `charValue`           |
| `ie`   | `validate(uf, v)`, `validateAny(v)`, `assertValid`, `format(uf, v)`, `unformat`, `generate(uf)`, `isUF`, `UFS`, `registry` |
| raiz   | `detect`, `createRng`, `InvalidDocumentError`                                                                              |

`generate` aceita `{ seed?: number; rng?: () => number; formatted?: boolean }`.

## Desenvolvimento

```bash
npm install
npm test          # testes
npm run coverage  # cobertura (mínimo 95%)
npm run bench     # benchmark
npm run build     # ESM + CJS + .d.ts
npm run lint      # ESLint
npm run typecheck # tsc --noEmit
npm run changeset # descreve uma mudança para o próximo release
```

## Estrutura

```
src/
 ├── cpf/        validação, formatação e geração de CPF
 ├── cnpj/       CNPJ numérico e alfanumérico
 ├── ie/
 │    ├── rules/  uma regra por UF (ac.ts … to.ts)
 │    ├── registry.ts  mapa UF → regra
 │    └── index.ts     API pública da IE
 ├── shared/     modulo11, digits, mask, random, errors
 ├── detect.ts
 └── index.ts
tests/           testes unitários, por UF, tabela de fixtures e property-based
benchmarks/      benchmark de validação
```

Princípios: funções puras, sem estado global; `validate` nunca lança; uma regra de IE por
arquivo, auditável contra o roteiro oficial; zero dependências de runtime.

## Status

Implementado e testado (37 arquivos de teste passando).

Pendências conhecidas:

- garantir `prettier --check` limpo e CI verde no primeiro push

## Licença

Este projeto usa **licença dupla**. O texto completo está em [LICENSE](LICENSE).

- **Uso pessoal, educacional e não comercial:** livre, nos termos da licença MIT (mantenha o aviso de copyright).
- **Uso comercial:** exige licença comercial. Isso inclui usar em produto ou serviço comercial, vender acesso ou derivados, usar em atividades com fins lucrativos e implantar em empresas.

Contato para licença comercial: ma.polli@hotmail.com
