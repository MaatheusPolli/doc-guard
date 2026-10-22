import { test } from 'vitest';
import { cnpj, cpf, ie } from '../src';

const DOCS_PER_ITERATION = 1000;

const CPFS = Array.from({ length: DOCS_PER_ITERATION }, (_, i) => cpf.generate({ seed: i }));
const CNPJS = Array.from({ length: DOCS_PER_ITERATION }, (_, i) =>
  cnpj.generate({ seed: i, alphanumeric: i % 2 === 0 }),
);
const IES = Array.from({ length: DOCS_PER_ITERATION }, (_, i) => ie.generate('SP', { seed: i }));

// Cada iteração valida DOCS_PER_ITERATION documentos, então o throughput do
// tinybench vem em iterações/s; `report.mjs` multiplica por esse fator para
// chegar a validações/s.
//
// Particularidades do vitest 5: `bench` é uma fixture do contexto do teste,
// `iterations` é opção do `bench.compare` (não de cada `bench`), e o reporter
// não imprime nada em modo bench — daí o `writeResult` em cada medição e o
// `report.mjs`, que lê os arquivos e monta a tabela.
test('validate', async ({ bench }) => {
  await bench.compare(
    bench('cpf.validate', { writeResult: 'benchmarks/results/cpf-validate.json' }, () => {
      for (const v of CPFS) cpf.validate(v);
    }),
    bench('cnpj.validate', { writeResult: 'benchmarks/results/cnpj-validate.json' }, () => {
      for (const v of CNPJS) cnpj.validate(v);
    }),
    bench('ie.validate', { writeResult: 'benchmarks/results/ie-validate.json' }, () => {
      for (const v of IES) ie.validate('SP', v);
    }),
    bench('ie.validateAny', { writeResult: 'benchmarks/results/ie-validate-any.json' }, () => {
      for (const v of IES) ie.validateAny(v);
    }),
    { iterations: 100 },
  );
});
