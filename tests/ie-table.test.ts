import { describe, expect, it } from 'vitest';
import * as ie from '../src/ie';
import samples from './fixtures/ie-samples.json';

type Table = Record<ie.UF, { valid: { value: string }[]; invalid: { value: string }[] }>;
const table = samples as Table;

describe('tabela de fixtures de IE', () => {
  it('cobre as 27 UFs com ≥ 3 válidas e ≥ 3 inválidas', () => {
    expect(Object.keys(table).sort()).toEqual([...ie.UFS].sort());
    for (const uf of ie.UFS) {
      expect(table[uf].valid.length).toBeGreaterThanOrEqual(3);
      expect(table[uf].invalid.length).toBeGreaterThanOrEqual(3);
    }
  });

  for (const uf of ie.UFS) {
    describe(uf, () => {
      it.each(table[uf].valid.map((s) => s.value))('aceita %s', (v) => {
        expect(ie.validate(uf, v)).toBe(true);
        expect(ie.validateAny(v)).toContain(uf);
      });
      it.each(table[uf].invalid.map((s) => s.value))('rejeita %s', (v) =>
        expect(ie.validate(uf, v)).toBe(false),
      );
    });
  }
});
