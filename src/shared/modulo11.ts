/**
 * Soma ponderada: Σ digits[i] × weights[i].
 * @example weightedSum([1, 2], [3, 4]) // 11
 */
export function weightedSum(digits: readonly number[], weights: readonly number[]): number {
  let sum = 0;
  for (let i = 0; i < weights.length; i++) sum += (digits[i] ?? 0) * (weights[i] ?? 0);
  return sum;
}

/**
 * Gera pesos decrescentes de `from` até `to` (inclusive).
 * @example descendingWeights(9, 2) // [9, 8, 7, 6, 5, 4, 3, 2]
 */
export function descendingWeights(from: number, to = 2): number[] {
  const weights: number[] = [];
  for (let w = from; w >= to; w--) weights.push(w);
  return weights;
}

/**
 * Dígito verificador módulo 11 na variante mais comum:
 * resto < 2 → 0, senão 11 − resto.
 * @example modulo11([1, 2, 3, 4, 5, 6, 7, 8, 9], descendingWeights(10)) // 0
 */
export function modulo11(digits: readonly number[], weights: readonly number[]): number {
  const rest = weightedSum(digits, weights) % 11;
  return rest < 2 ? 0 : 11 - rest;
}
