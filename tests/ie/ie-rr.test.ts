import { describe, expect, it } from 'vitest';
import { rr } from '../../src/ie/rules/rr';
import * as ie from '../../src/ie';
import { createRng } from '../../src/shared/random';
import samples from '../fixtures/ie-samples.json';

const { valid, invalid } = samples.RR;

describe('IE RR', () => {
  it('regra registrada', () => expect(ie.registry.RR).toBe(rr));
  it.each(valid.map((s) => s.value))('aceita %s', (v) => expect(ie.validate('RR', v)).toBe(true));
  it.each(invalid.map((s) => s.value))('rejeita %s', (v) =>
    expect(ie.validate('RR', v)).toBe(false),
  );
  it('rejeita vazio, letras e sequência repetida', () => {
    expect(ie.validate('RR', '')).toBe(false);
    expect(ie.validate('RR', 'ABCDEFGHI')).toBe(false);
    for (const len of rr.lengths) expect(ie.validate('RR', '0'.repeat(len))).toBe(false);
  });
  it('gera IEs válidas', () => {
    const rng = createRng(123);
    for (let i = 0; i < 100; i++) expect(rr.validate(rr.generate(rng))).toBe(true);
  });
  it('formata com a máscara da UF', () => {
    for (const { value } of valid) {
      const raw = ie.unformat(value);
      const formatted = ie.format('RR', raw);
      expect(ie.unformat(formatted)).toBe(raw);
      expect(ie.validate('RR', formatted)).toBe(true);
    }
  });
});
