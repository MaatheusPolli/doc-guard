import { describe, expect, it } from 'vitest';
import { pr } from '../../src/ie/rules/pr';
import * as ie from '../../src/ie';
import { createRng } from '../../src/shared/random';
import samples from '../fixtures/ie-samples.json';

const { valid, invalid } = samples.PR;

describe('IE PR', () => {
  it('regra registrada', () => expect(ie.registry.PR).toBe(pr));
  it.each(valid.map((s) => s.value))('aceita %s', (v) => expect(ie.validate('PR', v)).toBe(true));
  it.each(invalid.map((s) => s.value))('rejeita %s', (v) =>
    expect(ie.validate('PR', v)).toBe(false),
  );
  it('rejeita vazio, letras e sequência repetida', () => {
    expect(ie.validate('PR', '')).toBe(false);
    expect(ie.validate('PR', 'ABCDEFGHI')).toBe(false);
    for (const len of pr.lengths) expect(ie.validate('PR', '0'.repeat(len))).toBe(false);
  });
  it('gera IEs válidas', () => {
    const rng = createRng(123);
    for (let i = 0; i < 100; i++) expect(pr.validate(pr.generate(rng))).toBe(true);
  });
  it('formata com a máscara da UF', () => {
    for (const { value } of valid) {
      const raw = ie.unformat(value);
      const formatted = ie.format('PR', raw);
      expect(ie.unformat(formatted)).toBe(raw);
      expect(ie.validate('PR', formatted)).toBe(true);
    }
  });
});
