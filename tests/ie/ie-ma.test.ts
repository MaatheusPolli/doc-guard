import { describe, expect, it } from 'vitest';
import { ma } from '../../src/ie/rules/ma';
import * as ie from '../../src/ie';
import { createRng } from '../../src/shared/random';
import samples from '../fixtures/ie-samples.json';

const { valid, invalid } = samples.MA;

describe('IE MA', () => {
  it('regra registrada', () => expect(ie.registry.MA).toBe(ma));
  it.each(valid.map((s) => s.value))('aceita %s', (v) => expect(ie.validate('MA', v)).toBe(true));
  it.each(invalid.map((s) => s.value))('rejeita %s', (v) =>
    expect(ie.validate('MA', v)).toBe(false),
  );
  it('rejeita vazio, letras e sequência repetida', () => {
    expect(ie.validate('MA', '')).toBe(false);
    expect(ie.validate('MA', 'ABCDEFGHI')).toBe(false);
    for (const len of ma.lengths) expect(ie.validate('MA', '0'.repeat(len))).toBe(false);
  });
  it('gera IEs válidas', () => {
    const rng = createRng(123);
    for (let i = 0; i < 100; i++) expect(ma.validate(ma.generate(rng))).toBe(true);
  });
  it('formata com a máscara da UF', () => {
    for (const { value } of valid) {
      const raw = ie.unformat(value);
      const formatted = ie.format('MA', raw);
      expect(ie.unformat(formatted)).toBe(raw);
      expect(ie.validate('MA', formatted)).toBe(true);
    }
  });
});
