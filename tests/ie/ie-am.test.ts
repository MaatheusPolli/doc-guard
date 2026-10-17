import { describe, expect, it } from 'vitest';
import { am } from '../../src/ie/rules/am';
import * as ie from '../../src/ie';
import { createRng } from '../../src/shared/random';
import samples from '../fixtures/ie-samples.json';

const { valid, invalid } = samples.AM;

describe('IE AM', () => {
  it('regra registrada', () => expect(ie.registry.AM).toBe(am));
  it.each(valid.map((s) => s.value))('aceita %s', (v) => expect(ie.validate('AM', v)).toBe(true));
  it.each(invalid.map((s) => s.value))('rejeita %s', (v) =>
    expect(ie.validate('AM', v)).toBe(false),
  );
  it('rejeita vazio, letras e sequência repetida', () => {
    expect(ie.validate('AM', '')).toBe(false);
    expect(ie.validate('AM', 'ABCDEFGHI')).toBe(false);
    for (const len of am.lengths) expect(ie.validate('AM', '0'.repeat(len))).toBe(false);
  });
  it('gera IEs válidas', () => {
    const rng = createRng(123);
    for (let i = 0; i < 100; i++) expect(am.validate(am.generate(rng))).toBe(true);
  });
  it('formata com a máscara da UF', () => {
    for (const { value } of valid) {
      const raw = ie.unformat(value);
      const formatted = ie.format('AM', raw);
      expect(ie.unformat(formatted)).toBe(raw);
      expect(ie.validate('AM', formatted)).toBe(true);
    }
  });
});
