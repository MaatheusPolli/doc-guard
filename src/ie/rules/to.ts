import type { IeRule } from '../types';
import { descendingWeights, generateFromPatterns, hasShape, modulo11, toDigits } from '../helpers';

/**
 * Tocantins:
 * - Atual (9 dígitos): módulo 11 com pesos 9..2 (resto < 2 → 0).
 * - Antigo (11 dígitos): 3º e 4º dígitos indicam o tipo (01, 02, 03 ou 99) e ficam
 *   fora do cálculo; os 8 restantes usam pesos 9..2.
 * Fonte: SEFAZ-TO / Sintegra, roteiro de crítica da IE de Tocantins.
 */
export const to: IeRule = {
  uf: 'TO',
  lengths: [9, 11],
  masks: ['########-#', '##.##.######-#'],
  validate(value) {
    if (!hasShape(value, this.lengths)) return false;
    const d = toDigits(value);
    if (value.length === 9) return modulo11(d, descendingWeights(9)) === d[8];
    if (!['01', '02', '03', '99'].includes(value.slice(2, 4))) return false;
    const base = [...d.slice(0, 2), ...d.slice(4, 10)];
    return modulo11(base, descendingWeights(9)) === d[10];
  },
  generate(rng) {
    return generateFromPatterns(rng, ['29######?', '2901######?', '2902######?'], (v) =>
      this.validate(v),
    );
  },
};
