import { describe, expect, it } from 'vitest';
import fc from 'fast-check';
import { cnpj, cpf, createRng, ie } from '../src';

/** Troca o caractere da posição `pos` por outro dígito diferente. */
function mutate(value: string, pos: number, delta: number): string {
  const d = (Number(value[pos]) + delta) % 10;
  return value.slice(0, pos) + d + value.slice(pos + 1);
}

const seed = fc.integer({ min: 0, max: 2 ** 31 - 1 });
const delta = fc.integer({ min: 1, max: 9 });

describe('property-based', () => {
  it('CPF: generate → validate', () =>
    fc.assert(fc.property(seed, (s) => cpf.validate(cpf.generate({ seed: s })))));

  it('CPF: alterar um dígito verificador sempre invalida', () =>
    fc.assert(
      fc.property(seed, fc.integer({ min: 9, max: 10 }), delta, (s, pos, d) => {
        const v = cpf.generate({ seed: s });
        return !cpf.validate(mutate(v, pos, d));
      }),
    ));

  // O módulo 11 com "resto < 2 → 0" não detecta todo erro de um dígito na base:
  // se o resto passa de 0 para 1 (ou o inverso), o DV continua 0.
  it('CPF: colisão conhecida do módulo 11 (erro de um dígito não detectado)', () => {
    expect(cpf.validate('70407441204')).toBe(true);
    expect(cpf.validate('60407441204')).toBe(true);
  });

  it('CNPJ (numérico e alfanumérico): generate → validate', () =>
    fc.assert(
      fc.property(seed, fc.boolean(), (s, alphanumeric) =>
        cnpj.validate(cnpj.generate({ seed: s, alphanumeric })),
      ),
    ));

  it('CNPJ (numérico e alfanumérico): alterar um DV sempre invalida', () =>
    fc.assert(
      fc.property(
        seed,
        fc.boolean(),
        fc.integer({ min: 12, max: 13 }),
        delta,
        (s, alphanumeric, pos, d) => {
          const v = cnpj.generate({ seed: s, alphanumeric });
          return !cnpj.validate(mutate(v, pos, d));
        },
      ),
    ));

  it('IE: generate → validate para todas as UFs', () =>
    fc.assert(
      fc.property(seed, fc.constantFrom(...ie.UFS), (s, uf) =>
        ie.validate(uf, ie.generate(uf, { rng: createRng(s) })),
      ),
    ));

  it('IE: alterar o último dígito sempre invalida (exceto SP rural, cujo final é livre)', () =>
    fc.assert(
      fc.property(seed, fc.constantFrom(...ie.UFS), delta, (s, uf, d) => {
        const v = ie.generate(uf, { seed: s });
        if (v.startsWith('P')) return true;
        return !ie.validate(uf, mutate(v, v.length - 1, d));
      }),
    ));

  it('format/unformat são inversos', () =>
    fc.assert(
      fc.property(seed, (s) => {
        const c = cpf.generate({ seed: s });
        const j = cnpj.generate({ seed: s, alphanumeric: true });
        return cpf.unformat(cpf.format(c)) === c && cnpj.unformat(cnpj.format(j)) === j;
      }),
    ));
});
