import type { IeRule } from '../types';
import {
  descendingWeights,
  generateFromPatterns,
  hasShape,
  toDigits,
  weightedSum,
} from '../helpers';

/**
 * Amapá — 9 dígitos, iniciando por "03". Os valores p e d dependem da faixa:
 * 03000001–03017000 → p=5, d=0; 03017001–03019022 → p=9, d=1; acima → p=0, d=0.
 * DV = 11 − ((p + soma) mod 11); 10 → 0; 11 → d.
 * Fonte: Sintegra, roteiro de crítica da IE do Amapá.
 */
export const ap: IeRule = {
  uf: 'AP',
  lengths: [9],
  masks: ['##.###.###-#'],
  validate(value) {
    if (!hasShape(value, this.lengths) || !value.startsWith('03')) return false;
    const base = Number(value.slice(0, 8));
    const [p, d] = base <= 3017000 ? [5, 0] : base <= 3019022 ? [9, 1] : [0, 0];
    const digits = toDigits(value);
    let dv = 11 - ((p + weightedSum(digits, descendingWeights(9))) % 11);
    if (dv === 10) dv = 0;
    else if (dv === 11) dv = d;
    return dv === digits[8];
  },
  generate(rng) {
    return generateFromPatterns(rng, ['030#####?', '0301####?', '03######?'], (v) =>
      this.validate(v),
    );
  },
};
