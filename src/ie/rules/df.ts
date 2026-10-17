import type { IeRule } from '../types';
import { generateFromPatterns, hasShape, modulo11, toDigits } from '../helpers';

/**
 * Distrito Federal — 13 dígitos, iniciando por "07" ou "08"; 2 DVs módulo 11.
 * Fonte: Sintegra, roteiro de crítica da IE do Distrito Federal.
 */
const W1 = [4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2];
const W2 = [5, ...W1];

export const df: IeRule = {
  uf: 'DF',
  lengths: [13],
  masks: ['##.######.###-##'],
  validate(value) {
    if (!hasShape(value, this.lengths) || !/^0[78]/.test(value)) return false;
    const d = toDigits(value);
    return modulo11(d, W1) === d[11] && modulo11(d, W2) === d[12];
  },
  generate(rng) {
    return generateFromPatterns(rng, ['07#########??', '08#########??'], (v) => this.validate(v));
  },
};
