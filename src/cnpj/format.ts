import { onlyAlphanumeric } from '../shared/digits';
import { applyMask } from '../shared/mask';

/** Máscara do CNPJ (vale também para o alfanumérico). */
export const MASK = '##.###.###/####-##';

/**
 * Aplica a máscara `00.000.000/0000-00` (não valida). Letras viram maiúsculas.
 * @example format('11222333000181') // '11.222.333/0001-81'
 * @example format('12abc34501de35') // '12.ABC.345/01DE-35'
 */
export function format(value: string): string {
  return applyMask(MASK, onlyAlphanumeric(value).slice(0, 14));
}

/**
 * Remove a máscara, mantendo dígitos e letras (maiúsculas).
 * @example unformat('12.ABC.345/01DE-35') // '12ABC34501DE35'
 */
export function unformat(value: string): string {
  return onlyAlphanumeric(value);
}
