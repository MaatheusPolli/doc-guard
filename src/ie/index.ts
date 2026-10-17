import { isRepeated } from '../shared/digits';
import { applyMask } from '../shared/mask';
import { InvalidDocumentError } from '../shared/errors';
import { resolveRng, type GenerateOptions } from '../shared/random';
import { registry } from './registry';
import { UFS, type IeRule, type UF } from './types';

export { UFS, registry, type IeRule, type UF };
export type { GenerateOptions, Rng } from '../shared/random';
export { InvalidDocumentError } from '../shared/errors';

function normalize(value: string): string {
  return String(value ?? '')
    .replace(/[^0-9a-z]/gi, '')
    .toUpperCase();
}

function ruleFor(uf: string): IeRule | undefined {
  return registry[String(uf ?? '').toUpperCase() as UF];
}

/**
 * Indica se `uf` é uma sigla válida (aceita minúsculas).
 * @example isUF('sp') // true
 */
export function isUF(uf: string): uf is UF {
  return ruleFor(uf) !== undefined;
}

/**
 * Valida a Inscrição Estadual de uma UF, com ou sem máscara.
 * @example validate('SP', '110.042.490.114') // true
 * @example validate('MG', '062.307.904/0081') // true
 */
export function validate(uf: UF | Lowercase<UF>, value: string): boolean {
  const rule = ruleFor(uf);
  if (!rule || typeof value !== 'string' || /[^0-9a-z.\-/\s]/i.test(value)) return false;
  const ie = normalize(value);
  if (isRepeated(ie)) return false;
  return rule.validate(ie);
}

/**
 * Testa o valor contra as 27 regras e devolve as UFs compatíveis.
 * @example validateAny('110.042.490.114') // ['SP']
 */
export function validateAny(value: string): UF[] {
  return UFS.filter((uf) => validate(uf, value));
}

/**
 * Lança `InvalidDocumentError` se a IE for inválida para a UF.
 * @example assertValid('SP', '110042490114') // não lança
 */
export function assertValid(uf: UF | Lowercase<UF>, value: string): void {
  if (!validate(uf, value)) throw new InvalidDocumentError('ie', String(value));
}

/**
 * Aplica a máscara usual da UF (não valida). Se o tamanho não corresponder a
 * nenhuma máscara conhecida, devolve o valor normalizado.
 * @example format('SP', '110042490114') // '110.042.490.114'
 */
export function format(uf: UF | Lowercase<UF>, value: string): string {
  const ie = normalize(value);
  const rule = ruleFor(uf);
  const mask = rule?.masks.find((m) => m.split('#').length - 1 === ie.length);
  return mask ? applyMask(mask, ie) : ie;
}

/**
 * Remove a máscara (mantém o "P" do produtor rural de SP).
 * @example unformat('110.042.490.114') // '110042490114'
 */
export function unformat(value: string): string {
  return normalize(value);
}

/**
 * Gera uma IE válida para a UF (massa de teste).
 * @example generate('PR', { seed: 1 })
 * @example generate('MG', { formatted: true })
 */
export function generate(uf: UF | Lowercase<UF>, options: GenerateOptions = {}): string {
  const rule = ruleFor(uf);
  if (!rule) throw new RangeError(`UF desconhecida: "${uf}"`);
  const ie = rule.generate(resolveRng(options));
  return options.formatted ? format(rule.uf, ie) : ie;
}
