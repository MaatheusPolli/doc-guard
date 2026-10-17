import { describe, expect, it } from 'vitest';
import { df } from '../../src/ie/rules/df';
import * as ie from '../../src/ie';
import { createRng } from '../../src/shared/random';
import samples from '../fixtures/ie-samples.json';

const { valid, invalid } = samples.DF;

describe('IE DF', () => {
  it('regra registrada', () => expect(ie.registry.DF).toBe(df));
  it.each(valid.map((s) => s.value))('aceita %s', (v) => expect(ie.validate('DF', v)).toBe(true));
  it.each(invalid.map((s) => s.value))('rejeita %s', (v) =>
    expect(ie.validate('DF', v)).toBe(false),
  );
  it('rejeita vazio, letras e sequência repetida', () => {
    expect(ie.validate('DF', '')).toBe(false);
    expect(ie.validate('DF', 'ABCDEFGHI')).toBe(false);
    for (const len of df.lengths) expect(ie.validate('DF', '0'.repeat(len))).toBe(false);
  });
  it('gera IEs válidas', () => {
    const rng = createRng(123);
    for (let i = 0; i < 100; i++) expect(df.validate(df.generate(rng))).toBe(true);
  });
  it('formata com a máscara da UF', () => {
    for (const { value } of valid) {
      const raw = ie.unformat(value);
      const formatted = ie.format('DF', raw);
      expect(ie.unformat(formatted)).toBe(raw);
      expect(ie.validate('DF', formatted)).toBe(true);
    }
  });
});
