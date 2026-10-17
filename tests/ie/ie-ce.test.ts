import { describe, expect, it } from 'vitest';
import { ce } from '../../src/ie/rules/ce';
import * as ie from '../../src/ie';
import { createRng } from '../../src/shared/random';
import samples from '../fixtures/ie-samples.json';

const { valid, invalid } = samples.CE;

describe('IE CE', () => {
  it('regra registrada', () => expect(ie.registry.CE).toBe(ce));
  it.each(valid.map((s) => s.value))('aceita %s', (v) => expect(ie.validate('CE', v)).toBe(true));
  it.each(invalid.map((s) => s.value))('rejeita %s', (v) =>
    expect(ie.validate('CE', v)).toBe(false),
  );
  it('rejeita vazio, letras e sequência repetida', () => {
    expect(ie.validate('CE', '')).toBe(false);
    expect(ie.validate('CE', 'ABCDEFGHI')).toBe(false);
    for (const len of ce.lengths) expect(ie.validate('CE', '0'.repeat(len))).toBe(false);
  });
  it('gera IEs válidas', () => {
    const rng = createRng(123);
    for (let i = 0; i < 100; i++) expect(ce.validate(ce.generate(rng))).toBe(true);
  });
  it('formata com a máscara da UF', () => {
    for (const { value } of valid) {
      const raw = ie.unformat(value);
      const formatted = ie.format('CE', raw);
      expect(ie.unformat(formatted)).toBe(raw);
      expect(ie.validate('CE', formatted)).toBe(true);
    }
  });
});
