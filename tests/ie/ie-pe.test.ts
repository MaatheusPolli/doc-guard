import { describe, expect, it } from 'vitest';
import { pe } from '../../src/ie/rules/pe';
import * as ie from '../../src/ie';
import { createRng } from '../../src/shared/random';
import samples from '../fixtures/ie-samples.json';

const { valid, invalid } = samples.PE;

describe('IE PE', () => {
  it('regra registrada', () => expect(ie.registry.PE).toBe(pe));
  it.each(valid.map((s) => s.value))('aceita %s', (v) => expect(ie.validate('PE', v)).toBe(true));
  it.each(invalid.map((s) => s.value))('rejeita %s', (v) =>
    expect(ie.validate('PE', v)).toBe(false),
  );
  it('rejeita vazio, letras e sequência repetida', () => {
    expect(ie.validate('PE', '')).toBe(false);
    expect(ie.validate('PE', 'ABCDEFGHI')).toBe(false);
    for (const len of pe.lengths) expect(ie.validate('PE', '0'.repeat(len))).toBe(false);
  });
  it('gera IEs válidas', () => {
    const rng = createRng(123);
    for (let i = 0; i < 100; i++) expect(pe.validate(pe.generate(rng))).toBe(true);
  });
  it('formata com a máscara da UF', () => {
    for (const { value } of valid) {
      const raw = ie.unformat(value);
      const formatted = ie.format('PE', raw);
      expect(ie.unformat(formatted)).toBe(raw);
      expect(ie.validate('PE', formatted)).toBe(true);
    }
  });
});

describe('IE PE — dois formatos', () => {
  it('gera ambos os tamanhos', () => {
    const rng = createRng(5);
    const lengths = new Set<number>();
    for (let i = 0; i < 100; i++) lengths.add(pe.generate(rng).length);
    expect([...lengths].sort()).toEqual([...pe.lengths].sort());
  });
});
