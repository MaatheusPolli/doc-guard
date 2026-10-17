import type { IeRule } from '../types';
import { generateFromPatterns, toDigits, weightedSum } from '../helpers';

/**
 * São Paulo:
 * - Comércio/indústria (12 dígitos): DV1 na 9ª posição (pesos 1,3,4,5,6,7,8,10)
 *   e DV2 na 12ª (pesos 3,2,10..2); DV = (soma mod 11) mod 10.
 * - Produtor rural ("P" + 12 dígitos): só o DV da 9ª posição (após o "P").
 * Fonte: SEFAZ-SP / Sintegra, roteiro de crítica da IE de São Paulo.
 */
const W1 = [1, 3, 4, 5, 6, 7, 8, 10];
const W2 = [3, 2, 10, 9, 8, 7, 6, 5, 4, 3, 2];

const dv = (d: number[], w: readonly number[]) => (weightedSum(d, w) % 11) % 10;

export const sp: IeRule = {
  uf: 'SP',
  lengths: [12, 13],
  masks: ['###.###.###.###', '#-########.#/###'],
  validate(value) {
    if (/^P\d{12}$/.test(value)) {
      const d = toDigits(value.slice(1));
      return dv(d, W1) === d[8];
    }
    if (!/^\d{12}$/.test(value)) return false;
    const d = toDigits(value);
    return dv(d, W1) === d[8] && dv(d, W2) === d[11];
  },
  generate(rng) {
    return generateFromPatterns(rng, ['########?##?', 'P0#######?###'], (v) => this.validate(v));
  },
};
