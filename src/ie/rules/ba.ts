import type { IeRule } from '../types';
import {
  descendingWeights,
  generateFromPatterns,
  hasShape,
  toDigits,
  weightedSum,
} from '../helpers';

/**
 * Bahia — 8 ou 9 dígitos, 2 DVs (o segundo é calculado primeiro).
 * O módulo depende do 1º dígito (8 dígitos) ou do 2º dígito (9 dígitos):
 * 0,1,2,3,4,5,8 → módulo 10; 6,7,9 → módulo 11.
 * Fonte: Sintegra, roteiro de crítica da IE da Bahia.
 */
function dv(sum: number, mod: 10 | 11): number {
  const rest = sum % mod;
  if (mod === 10) return rest === 0 ? 0 : 10 - rest;
  return rest < 2 ? 0 : 11 - rest;
}

export const ba: IeRule = {
  uf: 'BA',
  lengths: [8, 9],
  masks: ['######-##', '#######-##'],
  validate(value) {
    if (!hasShape(value, this.lengths)) return false;
    const d = toDigits(value);
    const size = value.length - 2;
    const selector = value.length === 8 ? d[0] : d[1];
    const mod = [6, 7, 9].includes(selector as number) ? 11 : 10;
    const base = d.slice(0, size);
    const dv2 = dv(weightedSum(base, descendingWeights(size + 1)), mod);
    const dv1 = dv(weightedSum([...base, dv2], descendingWeights(size + 2)), mod);
    return dv1 === d[size] && dv2 === d[size + 1];
  },
  generate(rng) {
    return generateFromPatterns(rng, ['######??', '#######??'], (v) => this.validate(v));
  },
};
