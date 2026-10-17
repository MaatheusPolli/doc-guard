import type { IeRule } from '../types';
import {
  descendingWeights,
  generateFromPatterns,
  hasShape,
  toDigits,
  weightedSum,
} from '../helpers';

/**
 * Goiás — 9 dígitos, iniciando por "10", "11", "15" ou "20"–"29".
 * DV módulo 11 com pesos 9..2: resto 0 → 0; resto 1 → 1 se a base estiver
 * entre 10103105 e 10119997, senão 0; demais → 11 − resto.
 * Fonte: Sintegra, roteiro de crítica da IE de Goiás.
 */
export const go: IeRule = {
  uf: 'GO',
  lengths: [9],
  masks: ['##.###.###-#'],
  validate(value) {
    if (!hasShape(value, this.lengths) || !/^(10|11|15|2\d)/.test(value)) return false;
    const d = toDigits(value);
    const rest = weightedSum(d, descendingWeights(9)) % 11;
    const base = Number(value.slice(0, 8));
    let dv = 11 - rest;
    if (rest === 0) dv = 0;
    else if (rest === 1) dv = base >= 10103105 && base <= 10119997 ? 1 : 0;
    return dv === d[8];
  },
  generate(rng) {
    return generateFromPatterns(rng, ['10######?', '11######?', '15######?', '20######?'], (v) =>
      this.validate(v),
    );
  },
};
