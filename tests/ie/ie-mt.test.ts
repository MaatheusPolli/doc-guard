import { describe, expect, it } from 'vitest';
import { mt } from '../../src/ie/rules/mt';
import * as ie from '../../src/ie';
import { createRng } from '../../src/shared/random';
import samples from '../fixtures/ie-samples.json';

const { valid, invalid } = samples.MT;

describe('IE MT', () => {
  it('regra registrada', () => expect(ie.registry.MT).toBe(mt));
  it.each(valid.map((s) => s.value))('aceita %s', (v) => expect(ie.validate('MT', v)).toBe(true));
  it.each(invalid.map((s) => s.value))('rejeita %s', (v) =>
    expect(ie.validate('MT', v)).toBe(false),
  );
  it('rejeita vazio, letras e sequência repetida', () => {
    expect(ie.validate('MT', '')).toBe(false);
    expect(ie.validate('MT', 'ABCDEFGHI')).toBe(false);
    for (const len of mt.lengths) expect(ie.validate('MT', '0'.repeat(len))).toBe(false);
  });
  it('gera IEs válidas', () => {
    const rng = createRng(123);
    for (let i = 0; i < 100; i++) expect(mt.validate(mt.generate(rng))).toBe(true);
  });
  it('formata com a máscara da UF', () => {
    for (const { value } of valid) {
      const raw = ie.unformat(value);
      const formatted = ie.format('MT', raw);
      expect(ie.unformat(formatted)).toBe(raw);
      expect(ie.validate('MT', formatted)).toBe(true);
    }
  });
});

describe('IE MT — formato curto', () => {
  it('completa com zeros à esquerda', () => {
    expect(ie.validate('MT', '13.000.001-9')).toBe(true); // exemplo do Sintegra
    expect(ie.validate('MT', '0013000001-9')).toBe(true);
    expect(ie.validate('MT', '13.000.001-8')).toBe(false);
  });
  it('formata 9 dígitos', () => expect(ie.format('MT', '130000019')).toBe('13.000.001-9'));
});
