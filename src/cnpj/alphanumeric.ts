import { weightedSum } from '../shared/modulo11';

/**
 * CNPJ alfanumérico (IN RFB nº 2.229/2024, vigente a partir de julho/2026):
 * as 12 primeiras posições aceitam [0-9A-Z]; os 2 DVs continuam numéricos.
 * Cada caractere vale `código ASCII − 48` (0–9 → 0–9, A → 17, …, Z → 42),
 * o que torna o cálculo retrocompatível com o CNPJ numérico.
 */

/** Pesos do 1º DV. */
export const WEIGHTS_1 = [5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2] as const;
/** Pesos do 2º DV. */
export const WEIGHTS_2 = [6, 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2] as const;

/**
 * Converte um caractere [0-9A-Za-z] no valor usado no cálculo (ASCII − 48).
 * Minúsculas são normalizadas, como em `computeCheckDigits`.
 * @example charValue('A') // 17
 * @example charValue('a') // 17
 */
export function charValue(char: string): number {
  return char.toUpperCase().charCodeAt(0) - 48;
}

function dv(values: number[], weights: readonly number[]): number {
  const rest = weightedSum(values, weights) % 11;
  return rest < 2 ? 0 : 11 - rest;
}

/**
 * Calcula os 2 DVs a partir da base de 12 caracteres (numérica ou alfanumérica).
 * @example computeCheckDigits('12ABC34501DE') // '35'
 */
export function computeCheckDigits(base: string): string {
  const values = Array.from(base, charValue);
  const dv1 = dv(values, WEIGHTS_1);
  const dv2 = dv([...values, dv1], WEIGHTS_2);
  return `${dv1}${dv2}`;
}

/**
 * Indica se o CNPJ (sem máscara) contém letras.
 * @example isAlphanumeric('12ABC34501DE35') // true
 */
export function isAlphanumeric(value: string): boolean {
  return /[A-Z]/i.test(value);
}
