import { describe, expect, it } from 'vitest';
import { ac } from '../../src/ie/rules/ac';
import * as ie from '../../src/ie';
import { createRng } from '../../src/shared/random';
import samples from '../fixtures/ie-samples.json';

const { valid, invalid } = samples.AC;

describe('IE AC', () => {
  it('regra registrada', () => expect(ie.registry.AC).toBe(ac));
  it.each(valid.map((s) => s.value))('aceita %s', (v) => expect(ie.validate('AC', v)).toBe(true));
  it.each(invalid.map((s) => s.value))('rejeita %s', (v) =>
    expect(ie.validate('AC', v)).toBe(false),
  );
  it('rejeita vazio, letras e sequência repetida', () => {
    expect(ie.validate('AC', '')).toBe(false);
    expect(ie.validate('AC', 'ABCDEFGHI')).toBe(false);
    for (const len of ac.lengths) expect(ie.validate('AC', '0'.repeat(len))).toBe(false);
  });
  it('gera IEs válidas', () => {
    const rng = createRng(123);
    for (let i = 0; i < 100; i++) expect(ac.validate(ac.generate(rng))).toBe(true);
  });
  it('formata com a máscara da UF', () => {
    for (const { value } of valid) {
      const raw = ie.unformat(value);
      const formatted = ie.format('AC', raw);
      expect(ie.unformat(formatted)).toBe(raw);
      expect(ie.validate('AC', formatted)).toBe(true);
    }
  });
});
