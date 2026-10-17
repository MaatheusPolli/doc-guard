import { describe, expect, it } from 'vitest';
import * as ie from '../src/ie';

describe('API ie', () => {
  it('UFS contém as 27 siglas', () => expect(ie.UFS).toHaveLength(27));
  it('isUF', () => {
    expect(ie.isUF('SP')).toBe(true);
    expect(ie.isUF('sp')).toBe(true);
    expect(ie.isUF('XX')).toBe(false);
    expect(ie.isUF(undefined as unknown as string)).toBe(false);
  });
  it('validate aceita UF minúscula', () => expect(ie.validate('sp', '110042490114')).toBe(true));
  it('validate com UF desconhecida', () =>
    expect(ie.validate('XX' as ie.UF, '110042490114')).toBe(false));
  it('validate com caracteres inválidos', () =>
    expect(ie.validate('SP', '110042490114!')).toBe(false));
  it('validate com null/undefined', () => {
    expect(ie.validate('SP', null as unknown as string)).toBe(false);
    expect(ie.validate('SP', undefined as unknown as string)).toBe(false);
  });
  it('validateAny devolve todas as UFs compatíveis', () => {
    expect(ie.validateAny('110.042.490.114')).toEqual(['SP']);
    expect(ie.validateAny('06000001-5')).toEqual(expect.arrayContaining(['CE', 'PB']));
    expect(ie.validateAny('abc')).toEqual([]);
  });
  it('assertValid', () => {
    expect(() => ie.assertValid('SP', '110042490114')).not.toThrow();
    expect(() => ie.assertValid('SP', '110042490115')).toThrow(ie.InvalidDocumentError);
  });
  it('format sem máscara compatível devolve normalizado', () => {
    expect(ie.format('SP', '123')).toBe('123');
    expect(ie.format('XX' as ie.UF, '1.2')).toBe('12');
  });
  it('unformat', () => expect(ie.unformat('P-01100424.3/002')).toBe('P011004243002'));
  it('generate com seed é reprodutível e formatável', () => {
    expect(ie.generate('PR', { seed: 3 })).toBe(ie.generate('PR', { seed: 3 }));
    expect(ie.generate('MG', { seed: 3, formatted: true })).toMatch(/^\d{3}\.\d{3}\.\d{3}\/\d{4}$/);
  });
  it('generate com UF desconhecida lança', () =>
    expect(() => ie.generate('XX' as ie.UF)).toThrow(RangeError));
});
