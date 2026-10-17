import { describe, expect, it } from 'vitest';
import { sp } from '../../src/ie/rules/sp';
import * as ie from '../../src/ie';
import { createRng } from '../../src/shared/random';
import samples from '../fixtures/ie-samples.json';

const { valid, invalid } = samples.SP;

describe('IE SP', () => {
  it('regra registrada', () => expect(ie.registry.SP).toBe(sp));
  it.each(valid.map((s) => s.value))('aceita %s', (v) => expect(ie.validate('SP', v)).toBe(true));
  it.each(invalid.map((s) => s.value))('rejeita %s', (v) =>
    expect(ie.validate('SP', v)).toBe(false),
  );
  it('rejeita vazio, letras e sequência repetida', () => {
    expect(ie.validate('SP', '')).toBe(false);
    expect(ie.validate('SP', 'ABCDEFGHI')).toBe(false);
    for (const len of sp.lengths) expect(ie.validate('SP', '0'.repeat(len))).toBe(false);
  });
  it('gera IEs válidas', () => {
    const rng = createRng(123);
    for (let i = 0; i < 100; i++) expect(sp.validate(sp.generate(rng))).toBe(true);
  });
  it('formata com a máscara da UF', () => {
    for (const { value } of valid) {
      const raw = ie.unformat(value);
      const formatted = ie.format('SP', raw);
      expect(ie.unformat(formatted)).toBe(raw);
      expect(ie.validate('SP', formatted)).toBe(true);
    }
  });
});

describe('IE SP — produtor rural', () => {
  it('aceita P com ou sem máscara', () => {
    expect(ie.validate('SP', 'P-01100424.3/002')).toBe(true);
    expect(ie.validate('SP', 'p011004243002')).toBe(true);
  });
  it('rejeita DV errado na 9ª posição', () =>
    expect(ie.validate('SP', 'P011004244002')).toBe(false));
  it('formata produtor rural', () =>
    expect(ie.format('SP', 'P011004243002')).toBe('P-01100424.3/002'));
  it('DV2 errado no formato comum', () => expect(ie.validate('SP', '110042490115')).toBe(false));
});
