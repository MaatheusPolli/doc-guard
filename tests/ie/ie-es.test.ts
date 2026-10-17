import { describe, expect, it } from 'vitest';
import { es } from '../../src/ie/rules/es';
import * as ie from '../../src/ie';
import { createRng } from '../../src/shared/random';
import samples from '../fixtures/ie-samples.json';

const { valid, invalid } = samples.ES;

describe('IE ES', () => {
  it('regra registrada', () => expect(ie.registry.ES).toBe(es));
  it.each(valid.map((s) => s.value))('aceita %s', (v) => expect(ie.validate('ES', v)).toBe(true));
  it.each(invalid.map((s) => s.value))('rejeita %s', (v) =>
    expect(ie.validate('ES', v)).toBe(false),
  );
  it('rejeita vazio, letras e sequência repetida', () => {
    expect(ie.validate('ES', '')).toBe(false);
    expect(ie.validate('ES', 'ABCDEFGHI')).toBe(false);
    for (const len of es.lengths) expect(ie.validate('ES', '0'.repeat(len))).toBe(false);
  });
  it('gera IEs válidas', () => {
    const rng = createRng(123);
    for (let i = 0; i < 100; i++) expect(es.validate(es.generate(rng))).toBe(true);
  });
  it('formata com a máscara da UF', () => {
    for (const { value } of valid) {
      const raw = ie.unformat(value);
      const formatted = ie.format('ES', raw);
      expect(ie.unformat(formatted)).toBe(raw);
      expect(ie.validate('ES', formatted)).toBe(true);
    }
  });
});
