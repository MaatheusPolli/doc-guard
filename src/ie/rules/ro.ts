import type { IeRule } from '../types';
import {
  descendingWeights,
  generateFromPatterns,
  hasShape,
  toDigits,
  weightedSum,
} from '../helpers';

/**
 * Rondônia:
 * - Atual (14 dígitos): pesos 6,5,4,3,2,9..2.
 * - Antigo (9 dígitos): ignora os 3 primeiros (município) e usa pesos 6..2 nos 5 seguintes.
 * Em ambos, DV = 11 − (soma mod 11); se ≥ 10, subtrai 10.
 * Fonte: Sintegra, roteiro de crítica da IE de Rondônia.
 */
const W14 = [6, 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2];

function dv(sum: number): number {
  const r = 11 - (sum % 11);
  return r >= 10 ? r - 10 : r;
}

export const ro: IeRule = {
  uf: 'RO',
  lengths: [9, 14],
  masks: ['###.#####-#', '#############-#'],
  validate(value) {
    if (!hasShape(value, this.lengths)) return false;
    const d = toDigits(value);
    if (value.length === 14) return dv(weightedSum(d, W14)) === d[13];
    return dv(weightedSum(d.slice(3), descendingWeights(6))) === d[8];
  },
  generate(rng) {
    return generateFromPatterns(rng, ['00000000#####?', '#############?', '########?'], (v) =>
      this.validate(v),
    );
  },
};
