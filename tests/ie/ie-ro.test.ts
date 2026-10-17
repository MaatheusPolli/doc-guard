import { describe, expect, it } from 'vitest';
import { ro } from '../../src/ie/rules/ro';
import * as ie from '../../src/ie';
import { createRng } from '../../src/shared/random';
import samples from '../fixtures/ie-samples.json';

const { valid, invalid } = samples.RO;

describe('IE RO', () => {
  it('regra registrada', () => expect(ie.registry.RO).toBe(ro));
  it.each(valid.map((s) => s.value))('aceita %s', (v) => expect(ie.validate('RO', v)).toBe(true));
  it.each(invalid.map((s) => s.value))('rejeita %s', (v) =>
    expect(ie.validate('RO', v)).toBe(false),
  );
  it('rejeita vazio, letras e sequência repetida', () => {
    expect(ie.validate('RO', '')).toBe(false);
    expect(ie.validate('RO', 'ABCDEFGHI')).toBe(false);
    for (const len of ro.lengths) expect(ie.validate('RO', '0'.repeat(len))).toBe(false);
  });
  it('gera IEs válidas', () => {
    const rng = createRng(123);
    for (let i = 0; i < 100; i++) expect(ro.validate(ro.generate(rng))).toBe(true);
  });
  it('formata com a máscara da UF', () => {
    for (const { value } of valid) {
      const raw = ie.unformat(value);
      const formatted = ie.format('RO', raw);
      expect(ie.unformat(formatted)).toBe(raw);
      expect(ie.validate('RO', formatted)).toBe(true);
    }
  });
});

describe('IE RO — dois formatos', () => {
  it('gera ambos os tamanhos', () => {
    const rng = createRng(5);
    const lengths = new Set<number>();
    for (let i = 0; i < 100; i++) lengths.add(ro.generate(rng).length);
    expect([...lengths].sort()).toEqual([...ro.lengths].sort());
  });
});
