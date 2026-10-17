import type { IeRule } from '../types';
import {
  descendingWeights,
  generateFromPatterns,
  hasShape,
  modulo11,
  toDigits,
  weightedSum,
} from '../helpers';

/**
 * Pernambuco:
 * - eFisco (9 dígitos): DV1 pesos 8..2, DV2 pesos 9..2, módulo 11 (resto < 2 → 0).
 * - Antigo CACEPE (14 dígitos): pesos 5,4,3,2,1,9..2; DV = 11 − resto, se > 9 subtrai 10.
 * Fonte: Sintegra / SEFAZ-PE, roteiro de crítica da IE de Pernambuco.
 */
const W_OLD = [5, 4, 3, 2, 1, 9, 8, 7, 6, 5, 4, 3, 2];

export const pe: IeRule = {
  uf: 'PE',
  lengths: [9, 14],
  masks: ['#######-##', '##.#.###.#######-#'],
  validate(value) {
    if (!hasShape(value, this.lengths)) return false;
    const d = toDigits(value);
    if (value.length === 9) {
      return (
        modulo11(d, descendingWeights(8)) === d[7] && modulo11(d, descendingWeights(9)) === d[8]
      );
    }
    let dv = 11 - (weightedSum(d, W_OLD) % 11);
    if (dv > 9) dv -= 10;
    return dv === d[13];
  },
  generate(rng) {
    return generateFromPatterns(rng, ['#######??', '18#1#########?'], (v) => this.validate(v));
  },
};
