import { describe, expect, it } from 'vitest';
import * as cpf from '../src/cpf';

describe('cpf.validate', () => {
  it.each(['123.456.789-09', '12345678909', '529.982.247-25', '52998224725', ' 529.982.247-25 '])(
    'aceita %s',
    (v) => expect(cpf.validate(v)).toBe(true),
  );
  it.each([
    '123.456.789-00',
    '529.982.247-26',
    '111.111.111-11',
    '000.000.000-00',
    '1234567890',
    '123456789091',
    '',
    '123.456.789-0a',
    'abc',
  ])('rejeita %s', (v) => expect(cpf.validate(v)).toBe(false));
  it('rejeita null/undefined/número em runtime', () => {
    expect(cpf.validate(null as unknown as string)).toBe(false);
    expect(cpf.validate(undefined as unknown as string)).toBe(false);
    expect(cpf.validate(12345678909 as unknown as string)).toBe(false);
  });
  it('rejeita todas as sequências repetidas', () => {
    for (let d = 0; d <= 9; d++) expect(cpf.validate(String(d).repeat(11))).toBe(false);
  });
});

describe('cpf.assertValid', () => {
  it('não lança para válido', () => expect(() => cpf.assertValid('52998224725')).not.toThrow());
  it('lança InvalidDocumentError', () =>
    expect(() => cpf.assertValid('123')).toThrow(cpf.InvalidDocumentError));
});

describe('cpf.format/unformat', () => {
  it('formata', () => expect(cpf.format('52998224725')).toBe('529.982.247-25'));
  it('formata parcial', () => expect(cpf.format('5299')).toBe('529.9'));
  it('ignora excesso', () => expect(cpf.format('529982247251234')).toBe('529.982.247-25'));
  it('desformata', () => expect(cpf.unformat('529.982.247-25')).toBe('52998224725'));
});

describe('cpf.generate', () => {
  it('gera válido', () => expect(cpf.validate(cpf.generate())).toBe(true));
  it('é reprodutível com seed', () =>
    expect(cpf.generate({ seed: 42 })).toBe(cpf.generate({ seed: 42 })));
  it('formata quando pedido', () =>
    expect(cpf.generate({ seed: 1, formatted: true })).toMatch(/^\d{3}\.\d{3}\.\d{3}-\d{2}$/));
  it('descarta base repetida e sorteia de novo', () => {
    let n = 0;
    const rng = () => (n < 9 ? (n++, 0.1) : (n++ % 10) / 10);
    const v = cpf.generate({ rng });
    expect(v.startsWith('111111111')).toBe(false);
    expect(cpf.validate(v)).toBe(true);
  });
});
