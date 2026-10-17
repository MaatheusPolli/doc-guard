import type { IeRule } from '../types';
import { generateFromPatterns, hasShape, toDigits, weightedSum } from '../helpers';

/**
 * Roraima — 9 dígitos, iniciando por "24"; DV = soma (pesos 1..8) mod 9.
 * Fonte: Sintegra, roteiro de crítica da IE de Roraima.
 */
const W = [1, 2, 3, 4, 5, 6, 7, 8];

export const rr: IeRule = {
  uf: 'RR',
  lengths: [9],
  masks: ['########-#'],
  validate(value) {
    if (!hasShape(value, this.lengths) || !value.startsWith('24')) return false;
    const d = toDigits(value);
    return weightedSum(d, W) % 9 === d[8];
  },
  generate(rng) {
    return generateFromPatterns(rng, ['24######?'], (v) => this.validate(v));
  },
};
