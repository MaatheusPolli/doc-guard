import { describe, expect, it } from 'vitest';
import { pb } from '../../src/ie/rules/pb';
import * as ie from '../../src/ie';
import { createRng } from '../../src/shared/random';
import samples from '../fixtures/ie-samples.json';

const { valid, invalid } = samples.PB;

describe('IE PB', () => {
  it('regra registrada', () => expect(ie.registry.PB).toBe(pb));
  it.each(valid.map((s) => s.value))('aceita %s', (v) => expect(ie.validate('PB', v)).toBe(true));
  it.each(invalid.map((s) => s.value))('rejeita %s', (v) =>
    expect(ie.validate('PB', v)).toBe(false),
  );
  it('rejeita vazio, letras e sequência repetida', () => {
    expect(ie.validate('PB', '')).toBe(false);
    expect(ie.validate('PB', 'ABCDEFGHI')).toBe(false);
    for (const len of pb.lengths) expect(ie.validate('PB', '0'.repeat(len))).toBe(false);
  });
  it('gera IEs válidas', () => {
    const rng = createRng(123);
    for (let i = 0; i < 100; i++) expect(pb.validate(pb.generate(rng))).toBe(true);
  });
  it('formata com a máscara da UF', () => {
    for (const { value } of valid) {
      const raw = ie.unformat(value);
      const formatted = ie.format('PB', raw);
      expect(ie.unformat(formatted)).toBe(raw);
      expect(ie.validate('PB', formatted)).toBe(true);
    }
  });
});
