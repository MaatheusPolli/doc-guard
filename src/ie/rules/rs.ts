import type { IeRule } from '../types';
import { generateFromPatterns, hasShape, modulo11, toDigits } from '../helpers';

/**
 * Rio Grande do Sul — 10 dígitos; DV módulo 11 com pesos 2,9..2 (resto < 2 → 0).
 * Fonte: Sintegra, roteiro de crítica da IE do Rio Grande do Sul.
 */
const W = [2, 9, 8, 7, 6, 5, 4, 3, 2];

export const rs: IeRule = {
  uf: 'RS',
  lengths: [10],
  masks: ['###/#######'],
  validate(value) {
    if (!hasShape(value, this.lengths)) return false;
    const d = toDigits(value);
    return modulo11(d, W) === d[9];
  },
  generate(rng) {
    return generateFromPatterns(rng, ['#########?'], (v) => this.validate(v));
  },
};
