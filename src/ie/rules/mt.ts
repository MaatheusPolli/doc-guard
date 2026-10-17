import type { IeRule } from '../types';
import { generateFromPatterns, hasShape, modulo11, toDigits } from '../helpers';

/**
 * Mato Grosso — 11 dígitos; DV módulo 11 com pesos 3,2,9..2 (resto < 2 → 0).
 * Inscrições com menos de 11 dígitos (ex.: 13.000.001-9) são completadas com
 * zeros à esquerda antes do cálculo.
 * Fonte: Sintegra, roteiro de crítica da IE de Mato Grosso.
 */
const W = [3, 2, 9, 8, 7, 6, 5, 4, 3, 2];

export const mt: IeRule = {
  uf: 'MT',
  lengths: [9, 10, 11],
  masks: ['##.###.###-#', '#########-#', '##########-#'],
  validate(value) {
    if (!hasShape(value, this.lengths)) return false;
    const d = toDigits(value.padStart(11, '0'));
    return modulo11(d, W) === d[10];
  },
  generate(rng) {
    return generateFromPatterns(rng, ['13######?', '0013######?', '##########?'], (v) =>
      this.validate(v),
    );
  },
};
