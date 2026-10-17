import { describe, expect, it } from 'vitest';
import { isRepeated, onlyAlphanumeric, onlyDigits, toDigits } from '../src/shared/digits';
import { descendingWeights, modulo11, weightedSum } from '../src/shared/modulo11';
import { applyMask } from '../src/shared/mask';
import { createRng, pick, randomDigits, resolveRng } from '../src/shared/random';
import { InvalidDocumentError } from '../src/shared/errors';

describe('digits', () => {
  it('onlyDigits', () => {
    expect(onlyDigits('123.456.789-09')).toBe('12345678909');
    expect(onlyDigits(undefined as unknown as string)).toBe('');
  });
  it('onlyAlphanumeric', () => {
    expect(onlyAlphanumeric('12.abc.345/01de-35')).toBe('12ABC34501DE35');
    expect(onlyAlphanumeric(null as unknown as string)).toBe('');
  });
  it('toDigits', () => expect(toDigits('109')).toEqual([1, 0, 9]));
  it('isRepeated', () => {
    expect(isRepeated('1111')).toBe(true);
    expect(isRepeated('1112')).toBe(false);
    expect(isRepeated('')).toBe(false);
  });
});

describe('modulo11', () => {
  it('weightedSum', () => expect(weightedSum([1, 2], [3, 4])).toBe(11));
  it('weightedSum trata posições ausentes como 0', () => expect(weightedSum([1], [3, 4])).toBe(3));
  it('descendingWeights', () => {
    expect(descendingWeights(9)).toEqual([9, 8, 7, 6, 5, 4, 3, 2]);
    expect(descendingWeights(3, 1)).toEqual([3, 2, 1]);
  });
  it('resto < 2 vira 0', () => expect(modulo11([1, 1], [5, 6])).toBe(0)); // 11 % 11 = 0
  it('resto >= 2 vira 11 − resto', () => expect(modulo11([1], [5])).toBe(6));
});

describe('mask', () => {
  it('aplica máscara', () => expect(applyMask('###.###-##', '12345678')).toBe('123.456-78'));
  it('para quando acaba o valor', () => expect(applyMask('###.###', '1234')).toBe('123.4'));
});

describe('random', () => {
  it('é determinístico com seed', () => {
    const a = createRng(42);
    const b = createRng(42);
    expect([a(), a(), a()]).toEqual([b(), b(), b()]);
  });
  it('retorna valores em [0, 1)', () => {
    const rng = createRng(7);
    for (let i = 0; i < 1000; i++) {
      const v = rng();
      expect(v).toBeGreaterThanOrEqual(0);
      expect(v).toBeLessThan(1);
    }
  });
  it('resolveRng prioriza rng > seed > Math.random', () => {
    const rng = () => 0.5;
    expect(resolveRng({ rng, seed: 1 })).toBe(rng);
    expect(resolveRng({ seed: 1 })()).toBe(createRng(1)());
    expect(resolveRng()).toBe(Math.random);
  });
  it('randomDigits e pick', () => {
    expect(randomDigits(() => 0.99, 3)).toBe('999');
    expect(pick(() => 0, ['a', 'b'])).toBe('a');
  });
});

describe('InvalidDocumentError', () => {
  it('carrega tipo e valor', () => {
    const e = new InvalidDocumentError('cpf', '123');
    expect(e).toBeInstanceOf(Error);
    expect(e.name).toBe('InvalidDocumentError');
    expect(e.document).toBe('cpf');
    expect(e.value).toBe('123');
    expect(e.message).toBe('CPF inválido: "123"');
  });
});
