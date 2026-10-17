import type { IeRule } from '../types';
import { generateFromPatterns, hasShape, modulo11, toDigits } from '../helpers';

/**
 * Minas Gerais — 13 dígitos (município 3 + inscrição 6 + ordem 2 + DVs 2).
 * DV1: insere "0" após o código do município e multiplica alternadamente por 1 e 2,
 * somando os algarismos dos produtos; DV1 = dezena seguinte − soma.
 * DV2: módulo 11 com pesos 3,2,11,10,…,2 (resto < 2 → 0).
 * Fonte: Sintegra, roteiro de crítica da IE de Minas Gerais.
 */
const W2 = [3, 2, 11, 10, 9, 8, 7, 6, 5, 4, 3, 2];

export const mg: IeRule = {
  uf: 'MG',
  lengths: [13],
  masks: ['###.###.###/####'],
  validate(value) {
    if (!hasShape(value, this.lengths)) return false;
    const d = toDigits(value);
    const expanded = toDigits(`${value.slice(0, 3)}0${value.slice(3, 11)}`);
    let sum = 0;
    expanded.forEach((n, i) => {
      const p = n * (i % 2 === 0 ? 1 : 2);
      sum += Math.floor(p / 10) + (p % 10);
    });
    const dv1 = (10 - (sum % 10)) % 10;
    const dv2 = modulo11([...d.slice(0, 11), dv1], W2);
    return dv1 === d[11] && dv2 === d[12];
  },
  generate(rng) {
    return generateFromPatterns(rng, ['#########00??', '#########01??'], (v) => this.validate(v));
  },
};
