import type { IeRule } from '../types';
import { descendingWeights, generateFromPatterns, hasShape, modulo11, toDigits } from '../helpers';

/**
 * Paraíba — 9 dígitos; DV módulo 11 com pesos 9..2 (resto < 2 → 0).
 * Fonte: Sintegra, roteiro de crítica da IE (Paraíba).
 */
export const pb: IeRule = {
  uf: 'PB',
  lengths: [9],
  masks: ['########-#'],
  validate(value) {
    if (!hasShape(value, this.lengths)) return false;
    const d = toDigits(value);
    return modulo11(d, descendingWeights(9)) === d[8];
  },
  generate(rng) {
    return generateFromPatterns(rng, ['16######?', '########?'], (v) => this.validate(v));
  },
};
