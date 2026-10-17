import type { IeRule } from '../types';
import { generateFromPatterns, hasShape, modulo11, toDigits } from '../helpers';

/**
 * Rio de Janeiro — 8 dígitos; DV módulo 11 com pesos 2,7..2 (resto < 2 → 0).
 * Fonte: Sintegra, roteiro de crítica da IE do Rio de Janeiro.
 */
const W = [2, 7, 6, 5, 4, 3, 2];

export const rj: IeRule = {
  uf: 'RJ',
  lengths: [8],
  masks: ['##.###.##-#'],
  validate(value) {
    if (!hasShape(value, this.lengths)) return false;
    const d = toDigits(value);
    return modulo11(d, W) === d[7];
  },
  generate(rng) {
    return generateFromPatterns(rng, ['#######?'], (v) => this.validate(v));
  },
};
