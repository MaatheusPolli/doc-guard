import { bench, describe } from 'vitest';
import { cnpj, cpf, ie } from '../src';

const CPFS = Array.from({ length: 1000 }, (_, i) => cpf.generate({ seed: i }));
const CNPJS = Array.from({ length: 1000 }, (_, i) =>
  cnpj.generate({ seed: i, alphanumeric: i % 2 === 0 }),
);
const IES = Array.from({ length: 1000 }, (_, i) => ie.generate('SP', { seed: i }));

// Cada iteração valida 1.000 documentos; 1.000 iterações = 1 milhão de validações.
describe('validate (1.000 documentos por iteração)', () => {
  bench(
    'cpf.validate',
    () => {
      for (const v of CPFS) cpf.validate(v);
    },
    { iterations: 1000 },
  );
  bench(
    'cnpj.validate',
    () => {
      for (const v of CNPJS) cnpj.validate(v);
    },
    { iterations: 1000 },
  );
  bench(
    "ie.validate('SP')",
    () => {
      for (const v of IES) ie.validate('SP', v);
    },
    { iterations: 1000 },
  );
  bench(
    'ie.validateAny',
    () => {
      for (const v of IES) ie.validateAny(v);
    },
    { iterations: 100 },
  );
});
