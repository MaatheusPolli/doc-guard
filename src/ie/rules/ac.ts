import type { IeRule } from '../types';
import { generateFromPatterns, hasShape, modulo11, toDigits } from '../helpers';

/**
 * Acre — 13 dígitos, iniciando por "01"; 2 DVs módulo 11.
 * Fonte: Sintegra, roteiro de crítica da IE do Acre.
 */
const W1 = [4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2];
const W2 = [5, ...W1];

export const ac: IeRule = {
  uf: 'AC',
  lengths: [13],
  masks: ['##.###.###/###-##'],
  validate(value) {
    if (!hasShape(value, this.lengths) || !value.startsWith('01')) return false;
    const d = toDigits(value);
    return modulo11(d, W1) === d[11] && modulo11(d, W2) === d[12];
  },
  generate(rng) {
    return generateFromPatterns(rng, ['01#########??'], (v) => this.validate(v));
  },
};
