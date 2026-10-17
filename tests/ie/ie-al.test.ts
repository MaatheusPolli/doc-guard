import { describe, expect, it } from 'vitest';
import { al } from '../../src/ie/rules/al';
import * as ie from '../../src/ie';
import { createRng } from '../../src/shared/random';
import samples from '../fixtures/ie-samples.json';

const { valid, invalid } = samples.AL;

describe('IE AL', () => {
  it('regra registrada', () => expect(ie.registry.AL).toBe(al));
  it.each(valid.map((s) => s.value))('aceita %s', (v) => expect(ie.validate('AL', v)).toBe(true));
  it.each(invalid.map((s) => s.value))('rejeita %s', (v) =>
    expect(ie.validate('AL', v)).toBe(false),
  );
  it('rejeita vazio, letras e sequência repetida', () => {
    expect(ie.validate('AL', '')).toBe(false);
    expect(ie.validate('AL', 'ABCDEFGHI')).toBe(false);
    for (const len of al.lengths) expect(ie.validate('AL', '0'.repeat(len))).toBe(false);
  });
  it('gera IEs válidas', () => {
    const rng = createRng(123);
    for (let i = 0; i < 100; i++) expect(al.validate(al.generate(rng))).toBe(true);
  });
  it('formata com a máscara da UF', () => {
    for (const { value } of valid) {
      const raw = ie.unformat(value);
      const formatted = ie.format('AL', raw);
      expect(ie.unformat(formatted)).toBe(raw);
      expect(ie.validate('AL', formatted)).toBe(true);
    }
  });
});
