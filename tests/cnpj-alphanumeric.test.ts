import { describe, expect, it } from 'vitest';
import * as cnpj from '../src/cnpj';
import { descendingWeights, modulo11 } from '../src/shared/modulo11';
import { toDigits } from '../src/shared/digits';
import { weightedSum } from '../src/shared/modulo11';

// Exemplo oficial publicado pela Receita Federal (manual do CNPJ alfanumérico).
const OFFICIAL = '12.ABC.345/01DE-35';

describe('CNPJ alfanumérico', () => {
  it('aceita o exemplo oficial da Receita', () => {
    expect(cnpj.validate(OFFICIAL)).toBe(true);
    expect(cnpj.validate('12ABC34501DE35')).toBe(true);
    expect(cnpj.computeCheckDigits('12ABC34501DE')).toBe('35');
  });
  // Passo a passo do exemplo oficial (Receita Federal / Serpro, "Cálculo dos dígitos
  // verificadores do CNPJ alfanumérico").
  it('reproduz o passo a passo oficial do cálculo', () => {
    const values = Array.from('12ABC34501DE', cnpj.charValue);
    expect(values).toEqual([1, 2, 17, 18, 19, 3, 4, 5, 0, 1, 20, 21]);
    const sum1 = weightedSum(values, [5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2]);
    expect(sum1).toBe(459);
    expect(sum1 % 11).toBe(8); // DV1 = 11 − 8 = 3
    const sum2 = weightedSum([...values, 3], [6, 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2]);
    expect(sum2).toBe(424);
    expect(sum2 % 11).toBe(6); // DV2 = 11 − 6 = 5
  });
  it('tabela de conversão: A=17 … Z=42', () => {
    const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
    letters.forEach((l, i) => expect(cnpj.charValue(l)).toBe(17 + i));
  });
  it('aceita minúsculas (normaliza)', () => expect(cnpj.validate('12abc34501de35')).toBe(true));
  it('rejeita DV errado', () => expect(cnpj.validate('12.ABC.345/01DE-36')).toBe(false));
  it('rejeita letra nas posições de DV', () => expect(cnpj.validate('12ABC34501DE3A')).toBe(false));
  it('pode ser desabilitado', () =>
    expect(cnpj.validate(OFFICIAL, { alphanumeric: false })).toBe(false));
  it('opção alphanumeric:false não afeta numéricos', () =>
    expect(cnpj.validate('11222333000181', { alphanumeric: false })).toBe(true));
  it('charValue segue ASCII − 48', () => {
    expect(cnpj.charValue('0')).toBe(0);
    expect(cnpj.charValue('9')).toBe(9);
    expect(cnpj.charValue('A')).toBe(17);
    expect(cnpj.charValue('Z')).toBe(42);
  });
  it('charValue normaliza minúsculas', () => {
    expect(cnpj.charValue('a')).toBe(cnpj.charValue('A'));
    expect(cnpj.charValue('z')).toBe(cnpj.charValue('Z'));
  });
  it('computeCheckDigits aceita base em minúsculas', () =>
    expect(cnpj.computeCheckDigits('12abc34501de')).toBe(cnpj.computeCheckDigits('12ABC34501DE')));
  it('isAlphanumeric', () => {
    expect(cnpj.isAlphanumeric('12ABC34501DE35')).toBe(true);
    expect(cnpj.isAlphanumeric('11222333000181')).toBe(false);
  });
  it('formata e desformata', () => {
    expect(cnpj.format('12abc34501de35')).toBe(OFFICIAL);
    expect(cnpj.unformat(OFFICIAL)).toBe('12ABC34501DE35');
  });
  it('gera alfanumérico válido', () => {
    for (let seed = 0; seed < 200; seed++) {
      const v = cnpj.generate({ seed, alphanumeric: true });
      expect(v).toMatch(/^[0-9A-Z]{12}\d{2}$/);
      expect(v).toMatch(/[A-Z]/);
      expect(cnpj.validate(v)).toBe(true);
    }
  });

  it('é retrocompatível: para bases numéricas coincide com o módulo 11 clássico', () => {
    const classic = (base: string) => {
      const d = toDigits(base);
      const w1 = [5, 4, 3, 2, ...descendingWeights(9)];
      const dv1 = modulo11(d, w1);
      const dv2 = modulo11([...d, dv1], [6, ...w1]);
      return `${dv1}${dv2}`;
    };
    for (let seed = 0; seed < 500; seed++) {
      const v = cnpj.generate({ seed });
      expect(cnpj.computeCheckDigits(v.slice(0, 12))).toBe(classic(v.slice(0, 12)));
    }
  });
});
