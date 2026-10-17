import { describe, expect, it } from 'vitest';
import { go } from '../../src/ie/rules/go';
import * as ie from '../../src/ie';
import { createRng } from '../../src/shared/random';
import samples from '../fixtures/ie-samples.json';

const { valid, invalid } = samples.GO;

describe('IE GO', () => {
  it('regra registrada', () => expect(ie.registry.GO).toBe(go));
  it.each(valid.map((s) => s.value))('aceita %s', (v) => expect(ie.validate('GO', v)).toBe(true));
  it.each(invalid.map((s) => s.value))('rejeita %s', (v) =>
    expect(ie.validate('GO', v)).toBe(false),
  );
  it('rejeita vazio, letras e sequência repetida', () => {
    expect(ie.validate('GO', '')).toBe(false);
    expect(ie.validate('GO', 'ABCDEFGHI')).toBe(false);
    for (const len of go.lengths) expect(ie.validate('GO', '0'.repeat(len))).toBe(false);
  });
  it('gera IEs válidas', () => {
    const rng = createRng(123);
    for (let i = 0; i < 100; i++) expect(go.validate(go.generate(rng))).toBe(true);
  });
  it('formata com a máscara da UF', () => {
    for (const { value } of valid) {
      const raw = ie.unformat(value);
      const formatted = ie.format('GO', raw);
      expect(ie.unformat(formatted)).toBe(raw);
      expect(ie.validate('GO', formatted)).toBe(true);
    }
  });
});

describe('IE GO — resto 1', () => {
  // base 10103105..10119997 com resto 1 → DV 1; fora da faixa → DV 0
  const withRest1 = (lo: number, hi: number) => {
    for (let b = lo; b <= hi; b++) {
      const s = String(b);
      const sum = [...s].reduce((acc, c, i) => acc + Number(c) * (9 - i), 0);
      if (sum % 11 === 1) return s;
    }
    throw new Error('sem base');
  };
  it('dentro da faixa especial → DV 1', () => {
    const base = withRest1(10103105, 10119997);
    expect(ie.validate('GO', `${base}1`)).toBe(true);
    expect(ie.validate('GO', `${base}0`)).toBe(false);
  });
  it('fora da faixa → DV 0', () => {
    const base = withRest1(11000000, 11999999);
    expect(ie.validate('GO', `${base}0`)).toBe(true);
  });
  it('exige prefixo válido', () => expect(ie.validate('GO', '309876547')).toBe(false));
});
