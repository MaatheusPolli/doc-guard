import { isRepeated, onlyDigits, toDigits } from '../shared/digits';
import { descendingWeights, modulo11 } from '../shared/modulo11';
import { InvalidDocumentError } from '../shared/errors';

/**
 * Calcula os dois dígitos verificadores de um CPF a partir dos 9 primeiros dígitos.
 * @example computeCheckDigits('123456789') // '09'
 */
export function computeCheckDigits(base: string): string {
  const d = toDigits(base);
  const dv1 = modulo11(d, descendingWeights(10));
  const dv2 = modulo11([...d, dv1], descendingWeights(11));
  return `${dv1}${dv2}`;
}

/**
 * Valida um CPF, com ou sem máscara. Rejeita sequências repetidas.
 * @example validate('123.456.789-09') // true
 * @example validate('111.111.111-11') // false
 */
export function validate(value: string): boolean {
  if (typeof value !== 'string' || /[^\d.\-\s]/.test(value)) return false;
  const cpf = onlyDigits(value);
  if (cpf.length !== 11 || isRepeated(cpf)) return false;
  return computeCheckDigits(cpf.slice(0, 9)) === cpf.slice(9);
}

/**
 * Lança `InvalidDocumentError` se o CPF for inválido.
 * @example assertValid('123.456.789-09') // não lança
 */
export function assertValid(value: string): void {
  if (!validate(value)) throw new InvalidDocumentError('cpf', String(value));
}
