import { describe, expect, it } from 'vitest';
import { ba } from '../../src/ie/rules/ba';
import * as ie from '../../src/ie';
import { createRng } from '../../src/shared/random';
import samples from '../fixtures/ie-samples.json';

const { valid, invalid } = samples.BA;

describe('IE BA', () => {
  it('regra registrada', () => expect(ie.registry.BA).toBe(ba));
  it.each(valid.map((s) => s.value))('aceita %s', (v) => expect(ie.validate('BA', v)).toBe(true));
  it.each(invalid.map((s) => s.value))('rejeita %s', (v) =>
    expect(ie.validate('BA', v)).toBe(false),
  );
  it('rejeita vazio, letras e sequência repetida', () => {
    expect(ie.validate('BA', '')).toBe(false);
    expect(ie.validate('BA', 'ABCDEFGHI')).toBe(false);
    for (const len of ba.lengths) expect(ie.validate('BA', '0'.repeat(len))).toBe(false);
  });
  it('gera IEs válidas', () => {
    const rng = createRng(123);
    for (let i = 0; i < 100; i++) expect(ba.validate(ba.generate(rng))).toBe(true);
  });
  it('formata com a máscara da UF', () => {
    for (const { value } of valid) {
      const raw = ie.unformat(value);
      const formatted = ie.format('BA', raw);
      expect(ie.unformat(formatted)).toBe(raw);
      expect(ie.validate('BA', formatted)).toBe(true);
    }
  });
});

describe('IE BA — módulo 10 e 11', () => {
  it('8 dígitos módulo 10 e 11', () => {
    expect(ie.validate('BA', '12345663')).toBe(true); // 1º dígito 1 → mód. 10
    expect(ie.validate('BA', '61234557')).toBe(true); // 1º dígito 6 → mód. 11
  });
  it('9 dígitos usa o 2º dígito', () => expect(ie.validate('BA', '100000306')).toBe(true));
  it('DV1 errado com DV2 certo', () => expect(ie.validate('BA', '12345653')).toBe(false));
});
