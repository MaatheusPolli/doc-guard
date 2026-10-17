import type { IeRule } from '../types';
import { descendingWeights, generateFromPatterns, hasShape, modulo11, toDigits } from '../helpers';

/**
 * Piauí — 9 dígitos; DV módulo 11 com pesos 9..2 (resto < 2 → 0).
 * Fonte: Sintegra, roteiro de crítica da IE (Piauí).
 */
export const pi: IeRule = {
  uf: 'PI',
  lengths: [9],
  masks: ['#########'],
  validate(value) {
    if (!hasShape(value, this.lengths)) return false;
    const d = toDigits(value);
    return modulo11(d, descendingWeights(9)) === d[8];
  },
  generate(rng) {
    return generateFromPatterns(rng, ['19######?', '########?'], (v) => this.validate(v));
  },
};
