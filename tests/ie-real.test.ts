import { describe, expect, it } from 'vitest';
import * as ie from '../src/ie';
import real from './fixtures/ie-real.json';

// Inscrições de empresas reais, compiladas pelo projeto brazilian_documents (MIT).
const table = real as unknown as Record<ie.UF, { value: string; company: string }[]>;

describe('IEs de empresas reais', () => {
  it('cobre as 27 UFs', () => {
    for (const uf of ie.UFS) expect(table[uf]?.length ?? 0).toBeGreaterThanOrEqual(4);
  });
  for (const uf of ie.UFS) {
    it.each(table[uf].map((r) => [r.value, r.company]))(`${uf} %s (%s)`, (value) => {
      expect(ie.validate(uf, value)).toBe(true);
      expect(ie.validateAny(value)).toContain(uf);
    });
  }
});
