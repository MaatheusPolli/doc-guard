import { describe, expect, it } from 'vitest';
import { ms } from '../../src/ie/rules/ms';
import * as ie from '../../src/ie';
import { createRng } from '../../src/shared/random';
import samples from '../fixtures/ie-samples.json';

const { valid, invalid } = samples.MS;

describe('IE MS', () => {
  it('regra registrada', () => expect(ie.registry.MS).toBe(ms));
  it.each(valid.map((s) => s.value))('aceita %s', (v) => expect(ie.validate('MS', v)).toBe(true));
  it.each(invalid.map((s) => s.value))('rejeita %s', (v) =>
    expect(ie.validate('MS', v)).toBe(false),
  );
  it('rejeita vazio, letras e sequência repetida', () => {
    expect(ie.validate('MS', '')).toBe(false);
    expect(ie.validate('MS', 'ABCDEFGHI')).toBe(false);
    for (const len of ms.lengths) expect(ie.validate('MS', '0'.repeat(len))).toBe(false);
  });
  it('gera IEs válidas', () => {
    const rng = createRng(123);
    for (let i = 0; i < 100; i++) expect(ms.validate(ms.generate(rng))).toBe(true);
  });
  it('formata com a máscara da UF', () => {
    for (const { value } of valid) {
      const raw = ie.unformat(value);
      const formatted = ie.format('MS', raw);
      expect(ie.unformat(formatted)).toBe(raw);
      expect(ie.validate('MS', formatted)).toBe(true);
    }
  });
});
