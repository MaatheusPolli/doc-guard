import type { IeRule } from '../types';
import {
  descendingWeights,
  generateFromPatterns,
  hasShape,
  toDigits,
  weightedSum,
} from '../helpers';

/**
 * Rio Grande do Norte — 9 ou 10 dígitos, iniciando por "20".
 * DV = (soma × 10) mod 11, 10 → 0; pesos 9..2 (9 dígitos) ou 10..2 (10 dígitos).
 * Fonte: Sintegra, roteiro de crítica da IE do Rio Grande do Norte.
 */
export const rn: IeRule = {
  uf: 'RN',
  lengths: [9, 10],
  masks: ['##.###.###-#', '##.#.###.###-#'],
  validate(value) {
    if (!hasShape(value, this.lengths) || !value.startsWith('20')) return false;
    const d = toDigits(value);
    const size = value.length - 1;
    const dv = ((weightedSum(d, descendingWeights(size + 1)) * 10) % 11) % 10;
    return dv === d[size];
  },
  generate(rng) {
    return generateFromPatterns(rng, ['20######?', '20#######?'], (v) => this.validate(v));
  },
};
