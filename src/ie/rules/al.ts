import type { IeRule } from '../types';
import {
  descendingWeights,
  generateFromPatterns,
  hasShape,
  toDigits,
  weightedSum,
} from '../helpers';

/**
 * Alagoas — 9 dígitos, iniciando por "24"; DV = (soma × 10) mod 11, 10 → 0.
 * Fonte: Sintegra, roteiro de crítica da IE de Alagoas.
 */
export const al: IeRule = {
  uf: 'AL',
  lengths: [9],
  masks: ['########-#'],
  validate(value) {
    if (!hasShape(value, this.lengths) || !value.startsWith('24')) return false;
    const d = toDigits(value);
    const dv = ((weightedSum(d, descendingWeights(9)) * 10) % 11) % 10;
    return dv === d[8];
  },
  generate(rng) {
    return generateFromPatterns(
      rng,
      ['240#####?', '243#####?', '245#####?', '247#####?', '248#####?'],
      (v) => this.validate(v),
    );
  },
};
