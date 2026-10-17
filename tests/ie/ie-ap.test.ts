import { describe, expect, it } from 'vitest';
import { ap } from '../../src/ie/rules/ap';
import * as ie from '../../src/ie';
import { createRng } from '../../src/shared/random';
import samples from '../fixtures/ie-samples.json';

const { valid, invalid } = samples.AP;

describe('IE AP', () => {
  it('regra registrada', () => expect(ie.registry.AP).toBe(ap));
  it.each(valid.map((s) => s.value))('aceita %s', (v) => expect(ie.validate('AP', v)).toBe(true));
  it.each(invalid.map((s) => s.value))('rejeita %s', (v) =>
    expect(ie.validate('AP', v)).toBe(false),
  );
  it('rejeita vazio, letras e sequência repetida', () => {
    expect(ie.validate('AP', '')).toBe(false);
    expect(ie.validate('AP', 'ABCDEFGHI')).toBe(false);
    for (const len of ap.lengths) expect(ie.validate('AP', '0'.repeat(len))).toBe(false);
  });
  it('gera IEs válidas', () => {
    const rng = createRng(123);
    for (let i = 0; i < 100; i++) expect(ap.validate(ap.generate(rng))).toBe(true);
  });
  it('formata com a máscara da UF', () => {
    for (const { value } of valid) {
      const raw = ie.unformat(value);
      const formatted = ie.format('AP', raw);
      expect(ie.unformat(formatted)).toBe(raw);
      expect(ie.validate('AP', formatted)).toBe(true);
    }
  });
});

describe('IE AP — faixas p/d', () => {
  it('faixa 1 (p=5, d=0)', () => expect(ie.validate('AP', '030123459')).toBe(true));
  it('faixa 2 (p=9, d=1) e faixa 3 (p=0, d=0)', () => {
    const rng = createRng(9);
    const seen = new Set<string>();
    for (let i = 0; i < 300; i++) {
      const v = ap.generate(rng);
      const n = Number(v.slice(0, 8));
      seen.add(n <= 3017000 ? 'f1' : n <= 3019022 ? 'f2' : 'f3');
    }
    expect(seen).toEqual(new Set(['f1', 'f2', 'f3']));
  });
  it('exige prefixo 03', () => expect(ie.validate('AP', '130123459')).toBe(false));
});
