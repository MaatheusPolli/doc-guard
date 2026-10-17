import { isRepeated, onlyAlphanumeric } from '../shared/digits';
import { InvalidDocumentError } from '../shared/errors';
import { computeCheckDigits } from './alphanumeric';

/** Opções de validação do CNPJ. */
export interface CnpjValidateOptions {
  /** Aceitar CNPJ alfanumérico. Padrão: `true`. */
  readonly alphanumeric?: boolean;
}

const PATTERN = /^[0-9A-Z]{12}\d{2}$/;

/**
 * Valida um CNPJ numérico ou alfanumérico, com ou sem máscara.
 * @example validate('11.222.333/0001-81') // true
 * @example validate('12.ABC.345/01DE-35') // true
 * @example validate('12.ABC.345/01DE-35', { alphanumeric: false }) // false
 */
export function validate(value: string, options: CnpjValidateOptions = {}): boolean {
  if (typeof value !== 'string' || /[^0-9a-z.\-/\s]/i.test(value)) return false;
  const cnpj = onlyAlphanumeric(value);
  if (!PATTERN.test(cnpj) || isRepeated(cnpj)) return false;
  if (options.alphanumeric === false && /[A-Z]/.test(cnpj)) return false;
  return computeCheckDigits(cnpj.slice(0, 12)) === cnpj.slice(12);
}

/**
 * Lança `InvalidDocumentError` se o CNPJ for inválido.
 * @example assertValid('11.222.333/0001-81') // não lança
 */
export function assertValid(value: string, options: CnpjValidateOptions = {}): void {
  if (!validate(value, options)) throw new InvalidDocumentError('cnpj', String(value));
}
