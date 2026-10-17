import { describe, expect, it } from 'vitest';
import * as cnpj from '../src/cnpj';

describe('cnpj.validate (numérico)', () => {
  it.each(['11.222.333/0001-81', '11222333000181', '45.723.174/0001-10', '45723174000110'])(
    'aceita %s',
    (v) => expect(cnpj.validate(v)).toBe(true),
  );
  it.each([
    '11.222.333/0001-80',
    '11.222.333/0001-18',
    '00.000.000/0000-00',
    '11.111.111/1111-11',
    '1122233300018',
    '112223330001811',
    '',
    '11.222.333/0001-8!',
  ])('rejeita %s', (v) => expect(cnpj.validate(v)).toBe(false));
  it('rejeita null/undefined em runtime', () => {
    expect(cnpj.validate(null as unknown as string)).toBe(false);
    expect(cnpj.validate(undefined as unknown as string)).toBe(false);
  });
  it('rejeita todas as sequências repetidas', () => {
    for (let d = 0; d <= 9; d++) expect(cnpj.validate(String(d).repeat(14))).toBe(false);
  });
});

// CNPJs públicos de empresas e órgãos (cadastro aberto da Receita Federal).
describe('cnpj.validate (CNPJs reais)', () => {
  it.each([
    ['00.000.000/0001-91', 'Banco do Brasil'],
    ['33.000.167/0001-01', 'Petrobras'],
    ['00.360.305/0001-04', 'Caixa Econômica Federal'],
    ['60.701.190/0001-04', 'Itaú Unibanco'],
    ['60.746.948/0001-12', 'Bradesco'],
    ['33.592.510/0001-54', 'Vale'],
    ['00.394.460/0058-87', 'Receita Federal'],
  ])('aceita %s (%s)', (v) => expect(cnpj.validate(v)).toBe(true));
});

describe('cnpj.assertValid', () => {
  it('não lança para válido', () => expect(() => cnpj.assertValid('11222333000181')).not.toThrow());
  it('lança InvalidDocumentError', () =>
    expect(() => cnpj.assertValid('1')).toThrow(cnpj.InvalidDocumentError));
  it('respeita opções', () =>
    expect(() => cnpj.assertValid('12ABC34501DE35', { alphanumeric: false })).toThrow());
});

describe('cnpj.format/unformat', () => {
  it('formata', () => expect(cnpj.format('11222333000181')).toBe('11.222.333/0001-81'));
  it('formata parcial', () => expect(cnpj.format('11222')).toBe('11.222'));
  it('desformata', () => expect(cnpj.unformat('11.222.333/0001-81')).toBe('11222333000181'));
});

describe('cnpj.generate', () => {
  it('gera numérico válido', () => {
    const v = cnpj.generate();
    expect(v).toMatch(/^\d{14}$/);
    expect(cnpj.validate(v)).toBe(true);
  });
  it('é reprodutível com seed', () =>
    expect(cnpj.generate({ seed: 7 })).toBe(cnpj.generate({ seed: 7 })));
  it('formata quando pedido', () =>
    expect(cnpj.generate({ seed: 1, formatted: true })).toMatch(
      /^\d{2}\.\d{3}\.\d{3}\/0001-\d{2}$/,
    ));
  it('descarta raiz repetida', () => {
    let n = 0;
    const rng = () => (n < 8 ? (n++, 0.3) : (n++ % 10) / 10);
    const v = cnpj.generate({ rng });
    expect(v.startsWith('33333333')).toBe(false);
    expect(cnpj.validate(v)).toBe(true);
  });
});
