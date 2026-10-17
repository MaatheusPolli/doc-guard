import { describe, expect, it } from 'vitest';
import { pa } from '../../src/ie/rules/pa';
import * as ie from '../../src/ie';
import { createRng } from '../../src/shared/random';
import samples from '../fixtures/ie-samples.json';

const { valid, invalid } = samples.PA;

describe('IE PA', () => {
  it('regra registrada', () => expect(ie.registry.PA).toBe(pa));
  it.each(valid.map((s) => s.value))('aceita %s', (v) => expect(ie.validate('PA', v)).toBe(true));
  it.each(invalid.map((s) => s.value))('rejeita %s', (v) =>
    expect(ie.validate('PA', v)).toBe(false),
  );
  it('rejeita vazio, letras e sequência repetida', () => {
    expect(ie.validate('PA', '')).toBe(false);
    expect(ie.validate('PA', 'ABCDEFGHI')).toBe(false);
    for (const len of pa.lengths) expect(ie.validate('PA', '0'.repeat(len))).toBe(false);
  });
  it('gera IEs válidas', () => {
    const rng = createRng(123);
    for (let i = 0; i < 100; i++) expect(pa.validate(pa.generate(rng))).toBe(true);
  });
  it('formata com a máscara da UF', () => {
    for (const { value } of valid) {
      const raw = ie.unformat(value);
      const formatted = ie.format('PA', raw);
      expect(ie.unformat(formatted)).toBe(raw);
      expect(ie.validate('PA', formatted)).toBe(true);
    }
  });
});
