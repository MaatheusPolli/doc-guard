import { describe, expect, it } from 'vitest';
import { rn } from '../../src/ie/rules/rn';
import * as ie from '../../src/ie';
import { createRng } from '../../src/shared/random';
import samples from '../fixtures/ie-samples.json';

const { valid, invalid } = samples.RN;

describe('IE RN', () => {
  it('regra registrada', () => expect(ie.registry.RN).toBe(rn));
  it.each(valid.map((s) => s.value))('aceita %s', (v) => expect(ie.validate('RN', v)).toBe(true));
  it.each(invalid.map((s) => s.value))('rejeita %s', (v) =>
    expect(ie.validate('RN', v)).toBe(false),
  );
  it('rejeita vazio, letras e sequência repetida', () => {
    expect(ie.validate('RN', '')).toBe(false);
    expect(ie.validate('RN', 'ABCDEFGHI')).toBe(false);
    for (const len of rn.lengths) expect(ie.validate('RN', '0'.repeat(len))).toBe(false);
  });
  it('gera IEs válidas', () => {
    const rng = createRng(123);
    for (let i = 0; i < 100; i++) expect(rn.validate(rn.generate(rng))).toBe(true);
  });
  it('formata com a máscara da UF', () => {
    for (const { value } of valid) {
      const raw = ie.unformat(value);
      const formatted = ie.format('RN', raw);
      expect(ie.unformat(formatted)).toBe(raw);
      expect(ie.validate('RN', formatted)).toBe(true);
    }
  });
});

describe('IE RN — dois formatos', () => {
  it('gera ambos os tamanhos', () => {
    const rng = createRng(5);
    const lengths = new Set<number>();
    for (let i = 0; i < 100; i++) lengths.add(rn.generate(rng).length);
    expect([...lengths].sort()).toEqual([...rn.lengths].sort());
  });
});
