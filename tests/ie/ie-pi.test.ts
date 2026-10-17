import { describe, expect, it } from 'vitest';
import { pi } from '../../src/ie/rules/pi';
import * as ie from '../../src/ie';
import { createRng } from '../../src/shared/random';
import samples from '../fixtures/ie-samples.json';

const { valid, invalid } = samples.PI;

describe('IE PI', () => {
  it('regra registrada', () => expect(ie.registry.PI).toBe(pi));
  it.each(valid.map((s) => s.value))('aceita %s', (v) => expect(ie.validate('PI', v)).toBe(true));
  it.each(invalid.map((s) => s.value))('rejeita %s', (v) =>
    expect(ie.validate('PI', v)).toBe(false),
  );
  it('rejeita vazio, letras e sequência repetida', () => {
    expect(ie.validate('PI', '')).toBe(false);
    expect(ie.validate('PI', 'ABCDEFGHI')).toBe(false);
    for (const len of pi.lengths) expect(ie.validate('PI', '0'.repeat(len))).toBe(false);
  });
  it('gera IEs válidas', () => {
    const rng = createRng(123);
    for (let i = 0; i < 100; i++) expect(pi.validate(pi.generate(rng))).toBe(true);
  });
  it('formata com a máscara da UF', () => {
    for (const { value } of valid) {
      const raw = ie.unformat(value);
      const formatted = ie.format('PI', raw);
      expect(ie.unformat(formatted)).toBe(raw);
      expect(ie.validate('PI', formatted)).toBe(true);
    }
  });
});
