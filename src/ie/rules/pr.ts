import type { IeRule } from '../types';
import { generateFromPatterns, hasShape, modulo11, toDigits } from '../helpers';

/**
 * Paraná — 10 dígitos; DV1 pesos 3,2,7..2 e DV2 pesos 4,3,2,7..2, módulo 11 (resto < 2 → 0).
 * Fonte: Sintegra, roteiro de crítica da IE do Paraná.
 */
const W1 = [3, 2, 7, 6, 5, 4, 3, 2];
const W2 = [4, ...W1];

export const pr: IeRule = {
  uf: 'PR',
  lengths: [10],
  masks: ['########-##'],
  validate(value) {
    if (!hasShape(value, this.lengths)) return false;
    const d = toDigits(value);
    return modulo11(d, W1) === d[8] && modulo11(d, W2) === d[9];
  },
  generate(rng) {
    return generateFromPatterns(rng, ['########??'], (v) => this.validate(v));
  },
};
