# doc-guard

[![CI](https://github.com/MaatheusPolli/doc-guard/actions/workflows/ci.yml/badge.svg)](https://github.com/MaatheusPolli/doc-guard/actions/workflows/ci.yml)
[![license](https://img.shields.io/badge/license-MIT-blue.svg)](./LICENSE)

ValidaÃ§Ã£o, formataÃ§Ã£o e geraÃ§Ã£o de documentos brasileiros em TypeScript:
**CPF**, **CNPJ** (inclusive o novo **CNPJ alfanumÃ©rico** de 2026) e **InscriÃ§Ã£o Estadual das 27 UFs**.

- Zero dependÃªncias de runtime, ESM + CJS + `.d.ts`, Node e browser.
- Tree-shakeable: `@matheuspolli/doc-guard/cpf` sozinho tem **< 1 KB gzip**.
- `validate` aceita valores com ou sem mÃ¡scara e nunca lanÃ§a; `assertValid` lanÃ§a `InvalidDocumentError`.
- `generate` com `seed` para massa de teste reprodutÃ­vel.
- 1.000+ testes: exemplos oficiais do Sintegra, IEs de 250 empresas reais, property-based com fast-check e 100% das linhas cobertas.

## InstalaÃ§Ã£o

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
cpf.validate('111.111.111-11'); // false (sequÃªncia repetida)
cpf.format('52998224725'); // '529.982.247-25'
cpf.unformat('529.982.247-25'); // '52998224725'
cpf.generate({ seed: 42, formatted: true }); // sempre o mesmo CPF

cnpj.validate('11.222.333/0001-81'); // true
cnpj.validate('12.ABC.345/01DE-35'); // true  â† alfanumÃ©rico
cnpj.validate('12.ABC.345/01DE-35', { alphanumeric: false }); // false
cnpj.generate({ alphanumeric: true, formatted: true });

ie.validate('SP', '110.042.490.114'); // true
ie.validate('mg', '062.307.904/0081'); // true (UF case-insensitive)
ie.validateAny('06000001-5'); // ['CE', 'PB', â€¦] â€” todas as UFs compatÃ­veis
ie.format('RS', '2243658792'); // '224/3658792'
ie.generate('PR', { seed: 1 });

detect('529.982.247-25'); // 'cpf'
detect('12.ABC.345/01DE-35'); // 'cnpj'
detect('110.042.490.114'); // 'ie'
detect('123'); // null
```

### Importando sÃ³ o que precisa

```ts
import { validate } from '@matheuspolli/doc-guard/cpf'; // nÃ£o carrega CNPJ nem as 27 regras de IE
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

## CNPJ alfanumÃ©rico (2026)

A partir de julho de 2026 (IN RFB nÂº 2.229/2024), as 12 primeiras posiÃ§Ãµes do CNPJ
passam a aceitar letras `Aâ€“Z`. Os dois dÃ­gitos verificadores continuam numÃ©ricos e sÃ£o
calculados pelo mesmo mÃ³dulo 11, mas cada caractere vale **cÃ³digo ASCII âˆ’ 48**
(`0â€“9` â†’ 0â€“9, `A` â†’ 17, â€¦, `Z` â†’ 42). Por isso o cÃ¡lculo Ã© retrocompatÃ­vel: para bases
numÃ©ricas o resultado Ã© idÃªntico ao algoritmo clÃ¡ssico â€” e o doc-guard testa isso.

ImplementaÃ§Ãµes que fazem `value.replace(/\D/g, '')` antes de validar **quebram** com o novo formato.

## Suporte por UF (InscriÃ§Ã£o Estadual)

| UF  | Tamanho    | MÃ¡scara                                | ObservaÃ§Ã£o                           |
| --- | ---------- | -------------------------------------- | ------------------------------------ |
| AC  | 13         | `##.###.###/###-##`                    | prefixo 01, 2 DVs                    |
| AL  | 9          | `########-#`                           | prefixo 24                           |
| AM  | 9          | `##.###.###-#`                         |                                      |
| AP  | 9          | `##.###.###-#`                         | prefixo 03, faixas p/d               |
| BA  | 8 ou 9     | `######-##` / `#######-##`             | mÃ³dulo 10 ou 11 conforme dÃ­gito      |
| CE  | 9          | `########-#`                           |                                      |
| DF  | 13         | `##.######.###-##`                     | prefixo 07/08, 2 DVs                 |
| ES  | 9          | `###.###.##-#`                         |                                      |
| GO  | 9          | `##.###.###-#`                         | prefixos 10, 11, 15, 20â€“29           |
| MA  | 9          | `##.###.###-#`                         | prefixo 12                           |
| MG  | 13         | `###.###.###/####`                     | 2 DVs (soma de algarismos + mÃ³d. 11) |
| MS  | 9          | `##.###.###-#`                         | prefixo 28/50                        |
| MT  | 9 a 11     | `##.###.###-#` / `##########-#`        | completa com zeros Ã  esquerda        |
| PA  | 9          | `##-######-#`                          | prefixo 15, 75â€“79                    |
| PB  | 9          | `########-#`                           |                                      |
| PE  | 9 ou 14    | `#######-##` / `##.#.###.#######-#`    | eFisco e CACEPE antigo               |
| PI  | 9          | `#########`                            |                                      |
| PR  | 10         | `########-##`                          | 2 DVs                                |
| RJ  | 8          | `##.###.##-#`                          |                                      |
| RN  | 9 ou 10    | `##.###.###-#` / `##.#.###.###-#`      | prefixo 20                           |
| RO  | 9 ou 14    | `###.#####-#` / `#############-#`      | formato antigo e atual               |
| RR  | 9          | `########-#`                           | prefixo 24, mÃ³dulo 9                 |
| RS  | 10         | `###/#######`                          |                                      |
| SC  | 9          | `###.###.###`                          |                                      |
| SE  | 9          | `########-#`                           |                                      |
| SP  | 12 ou P+12 | `###.###.###.###` / `P-########.#/###` | inclui produtor rural                |
| TO  | 9 ou 11    | `########-#` / `##.##.######-#`        | formato antigo com tipo 01/02/03/99  |

Cada regra fica em `src/ie/rules/<uf>.ts` com o roteiro do Sintegra citado no comentÃ¡rio.

As regras sÃ£o testadas contra duas bases:

- `tests/fixtures/ie-samples.json`: exemplos oficiais dos roteiros do Sintegra e IEs reais, com a
  origem de cada valor registrada, alÃ©m de casos invÃ¡lidos (DV alterado, tamanho errado).
- `tests/fixtures/ie-real.json`: 250 IEs de empresas reais das 27 UFs, compiladas pelo projeto
  [brazilian_documents](https://github.com/fidelisrafael/brazilian_documents) (MIT, Â© 2016 Rafael Fidelis).

> **Ambiguidade:** alguns tamanhos coincidem (ex.: 11 dÃ­gitos = CPF ou IE de MT/TO).
> `detect` prioriza CPF â†’ CNPJ â†’ IE; `ie.validateAny` devolve todas as UFs compatÃ­veis.

## Benchmark

`npm run bench` (Node 22, container Linux, 1.000 documentos por iteraÃ§Ã£o):

| OperaÃ§Ã£o                           | ValidaÃ§Ãµes/s |
| ---------------------------------- | -----------: |
| `cpf.validate`                     |  ~1,1 milhÃ£o |
| `cnpj.validate` (50% alfanumÃ©rico) |  ~0,8 milhÃ£o |
| `ie.validate('SP', â€¦)`             |  ~1,0 milhÃ£o |
| `ie.validateAny` (27 regras)       |     ~128 mil |

1 milhÃ£o de validaÃ§Ãµes de CPF levam menos de 1 segundo.

## LimitaÃ§Ã£o conhecida do mÃ³dulo 11

O dÃ­gito verificador detecta qualquer alteraÃ§Ã£o nos prÃ³prios DVs, mas **nÃ£o** todo erro de
um dÃ­gito na base: na regra "resto < 2 â†’ 0", os restos 0 e 1 geram o mesmo DV. Exemplo: os
CPFs `704.074.412-04` e `604.074.412-04` sÃ£o ambos vÃ¡lidos. Isso Ã© uma propriedade do
algoritmo oficial, nÃ£o da biblioteca â€” e estÃ¡ documentado nos testes.

## API

| MÃ³dulo | FunÃ§Ãµes                                                                                                                    |
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
npm run coverage  # cobertura (mÃ­nimo 95%)
npm run bench     # benchmark
npm run build     # ESM + CJS + .d.ts
npm run lint      # ESLint
npm run typecheck # tsc --noEmit
npm run changeset # descreve uma mudanÃ§a para o prÃ³ximo release
```

## Estrutura

```
src/
 â”œâ”€â”€ cpf/        validaÃ§Ã£o, formataÃ§Ã£o e geraÃ§Ã£o de CPF
 â”œâ”€â”€ cnpj/       CNPJ numÃ©rico e alfanumÃ©rico
 â”œâ”€â”€ ie/
 â”‚    â”œâ”€â”€ rules/  uma regra por UF (ac.ts â€¦ to.ts)
 â”‚    â”œâ”€â”€ registry.ts  mapa UF â†’ regra
 â”‚    â””â”€â”€ index.ts     API pÃºblica da IE
 â”œâ”€â”€ shared/     modulo11, digits, mask, random, errors
 â”œâ”€â”€ detect.ts
 â””â”€â”€ index.ts
tests/           testes unitÃ¡rios, por UF, tabela de fixtures e property-based
benchmarks/      benchmark de validaÃ§Ã£o
```

PrincÃ­pios: funÃ§Ãµes puras, sem estado global; `validate` nunca lanÃ§a; uma regra de IE por
arquivo, auditÃ¡vel contra o roteiro oficial; zero dependÃªncias de runtime.

## LicenÃ§a

[MIT](./LICENSE)


## Licença

### Uso Pessoal
Este projeto é licenciado sob a **Licença MIT** para uso pessoal, educacional e não comercial.

### Uso Comercial
Se você deseja usar este projeto comercialmente, deve obter uma licença comercial do autor.

**Uso comercial inclui:**
- Incorporar em um produto comercial
- Oferecer como serviço
- Usar em atividades com fins lucrativos
- Implantação empresarial

**Para obter uma licença comercial:**
Email: ma.polli@hotmail.com
