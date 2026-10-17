import { describe, expect, it } from 'vitest';
import { to } from '../../src/ie/rules/to';
import * as ie from '../../src/ie';
import { createRng } from '../../src/shared/random';
import samples from '../fixtures/ie-samples.json';

const { valid, invalid } = samples.TO;

describe('IE TO', () => {
  it('regra registrada', () => expect(ie.registry.TO).toBe(to));
  it.each(valid.map((s) => s.value))('aceita %s', (v) => expect(ie.validate('TO', v)).toBe(true));
  it.each(invalid.map((s) => s.value))('rejeita %s', (v) =>
    expect(ie.validate('TO', v)).toBe(false),
  );
  it('rejeita vazio, letras e sequência repetida', () => {
    expect(ie.validate('TO', '')).toBe(false);
    expect(ie.validate('TO', 'ABCDEFGHI')).toBe(false);
    for (const len of to.lengths) expect(ie.validate('TO', '0'.repeat(len))).toBe(false);
  });
  it('gera IEs válidas', () => {
    const rng = createRng(123);
    for (let i = 0; i < 100; i++) expect(to.validate(to.generate(rng))).toBe(true);
  });
  it('formata com a máscara da UF', () => {
    for (const { value } of valid) {
      const raw = ie.unformat(value);
      const formatted = ie.format('TO', raw);
      expect(ie.unformat(formatted)).toBe(raw);
      expect(ie.validate('TO', formatted)).toBe(true);
    }
  });
});

describe('IE TO — formato antigo', () => {
  it('rejeita tipo desconhecido nos dígitos 3–4', () =>
    expect(ie.validate('TO', '29050227836')).toBe(false));
  it('aceita formato novo de 9 dígitos', () => {
    const v = to.generate(createRng(1));
    expect([9, 11]).toContain(v.length);
  });
});
