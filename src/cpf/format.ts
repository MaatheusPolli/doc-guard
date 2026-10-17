import { onlyDigits } from '../shared/digits';
import { applyMask } from '../shared/mask';

/** Máscara do CPF. */
export const MASK = '###.###.###-##';

/**
 * Aplica a máscara `000.000.000-00` (não valida).
 * @example format('12345678909') // '123.456.789-09'
 */
export function format(value: string): string {
  return applyMask(MASK, onlyDigits(value).slice(0, 11));
}

/**
 * Remove a máscara, mantendo apenas dígitos.
 * @example unformat('123.456.789-09') // '12345678909'
 */
export function unformat(value: string): string {
  return onlyDigits(value);
}
