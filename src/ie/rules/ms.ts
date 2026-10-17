import type { IeRule } from '../types';
import { descendingWeights, generateFromPatterns, hasShape, modulo11, toDigits } from '../helpers';

/**
 * Mato Grosso do Sul — 9 dígitos, iniciando por "28" ou "50"; DV módulo 11 com pesos 9..2 (resto < 2 → 0).
 * Fonte: Sintegra, roteiro de crítica da IE (Mato Grosso do Sul).
 */
export const ms: IeRule = {
  uf: 'MS',
  lengths: [9],
  masks: ['##.###.###-#'],
  validate(value) {
    if (!hasShape(value, this.lengths) || !/^(28|50)/.test(value)) return false;
    const d = toDigits(value);
    return modulo11(d, descendingWeights(9)) === d[8];
  },
  generate(rng) {
    return generateFromPatterns(rng, ['28######?', '50######?'], (v) => this.validate(v));
  },
};
