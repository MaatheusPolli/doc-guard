import type { IeRule } from '../types';
import { descendingWeights, generateFromPatterns, hasShape, modulo11, toDigits } from '../helpers';

/**
 * Maranhão — 9 dígitos, iniciando por "12"; DV módulo 11 com pesos 9..2 (resto < 2 → 0).
 * Fonte: Sintegra, roteiro de crítica da IE (Maranhão).
 */
export const ma: IeRule = {
  uf: 'MA',
  lengths: [9],
  masks: ['##.###.###-#'],
  validate(value) {
    if (!hasShape(value, this.lengths) || !value.startsWith('12')) return false;
    const d = toDigits(value);
    return modulo11(d, descendingWeights(9)) === d[8];
  },
  generate(rng) {
    return generateFromPatterns(rng, ['12######?'], (v) => this.validate(v));
  },
};
