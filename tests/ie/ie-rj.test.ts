import { describe, expect, it } from 'vitest';
import { rj } from '../../src/ie/rules/rj';
import * as ie from '../../src/ie';
import { createRng } from '../../src/shared/random';
import samples from '../fixtures/ie-samples.json';

const { valid, invalid } = samples.RJ;

describe('IE RJ', () => {
  it('regra registrada', () => expect(ie.registry.RJ).toBe(rj));
  it.each(valid.map((s) => s.value))('aceita %s', (v) => expect(ie.validate('RJ', v)).toBe(true));
  it.each(invalid.map((s) => s.value))('rejeita %s', (v) =>
    expect(ie.validate('RJ', v)).toBe(false),
  );
  it('rejeita vazio, letras e sequência repetida', () => {
    expect(ie.validate('RJ', '')).toBe(false);
    expect(ie.validate('RJ', 'ABCDEFGHI')).toBe(false);
    for (const len of rj.lengths) expect(ie.validate('RJ', '0'.repeat(len))).toBe(false);
  });
  it('gera IEs válidas', () => {
    const rng = createRng(123);
    for (let i = 0; i < 100; i++) expect(rj.validate(rj.generate(rng))).toBe(true);
  });
  it('formata com a máscara da UF', () => {
    for (const { value } of valid) {
      const raw = ie.unformat(value);
      const formatted = ie.format('RJ', raw);
      expect(ie.unformat(formatted)).toBe(raw);
      expect(ie.validate('RJ', formatted)).toBe(true);
    }
  });
});
