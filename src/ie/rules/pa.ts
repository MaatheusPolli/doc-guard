import type { IeRule } from '../types';
import { descendingWeights, generateFromPatterns, hasShape, modulo11, toDigits } from '../helpers';

/**
 * Pará — 9 dígitos, iniciando por "15" ou "75"–"79"; DV módulo 11 com pesos 9..2 (resto < 2 → 0).
 * Fonte: Sintegra, roteiro de crítica da IE (Pará).
 */
export const pa: IeRule = {
  uf: 'PA',
  lengths: [9],
  masks: ['##-######-#'],
  validate(value) {
    if (!hasShape(value, this.lengths) || !/^(15|7[5-9])/.test(value)) return false;
    const d = toDigits(value);
    return modulo11(d, descendingWeights(9)) === d[8];
  },
  generate(rng) {
    return generateFromPatterns(rng, ['15######?', '75######?'], (v) => this.validate(v));
  },
};
