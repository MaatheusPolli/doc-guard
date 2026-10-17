import { describe, expect, it } from 'vitest';
import { sc } from '../../src/ie/rules/sc';
import * as ie from '../../src/ie';
import { createRng } from '../../src/shared/random';
import samples from '../fixtures/ie-samples.json';

const { valid, invalid } = samples.SC;

describe('IE SC', () => {
  it('regra registrada', () => expect(ie.registry.SC).toBe(sc));
  it.each(valid.map((s) => s.value))('aceita %s', (v) => expect(ie.validate('SC', v)).toBe(true));
  it.each(invalid.map((s) => s.value))('rejeita %s', (v) =>
    expect(ie.validate('SC', v)).toBe(false),
  );
  it('rejeita vazio, letras e sequência repetida', () => {
    expect(ie.validate('SC', '')).toBe(false);
    expect(ie.validate('SC', 'ABCDEFGHI')).toBe(false);
    for (const len of sc.lengths) expect(ie.validate('SC', '0'.repeat(len))).toBe(false);
  });
  it('gera IEs válidas', () => {
    const rng = createRng(123);
    for (let i = 0; i < 100; i++) expect(sc.validate(sc.generate(rng))).toBe(true);
  });
  it('formata com a máscara da UF', () => {
    for (const { value } of valid) {
      const raw = ie.unformat(value);
      const formatted = ie.format('SC', raw);
      expect(ie.unformat(formatted)).toBe(raw);
      expect(ie.validate('SC', formatted)).toBe(true);
    }
  });
});
