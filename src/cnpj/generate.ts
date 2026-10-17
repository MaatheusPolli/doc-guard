import { isRepeated } from '../shared/digits';
import { pick, randomDigits, resolveRng, type GenerateOptions } from '../shared/random';
import { computeCheckDigits } from './alphanumeric';
import { format } from './format';

/** Opções de geração do CNPJ. */
export interface CnpjGenerateOptions extends GenerateOptions {
  /** Gera CNPJ alfanumérico. Padrão: `false`. */
  readonly alphanumeric?: boolean;
}

const ALPHABET = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');

/**
 * Gera um CNPJ válido (matriz, filial 0001) para massa de teste.
 * @example generate({ seed: 1 })
 * @example generate({ alphanumeric: true, formatted: true }) // 'AB.C12.3DE/0001-XX'
 */
export function generate(options: CnpjGenerateOptions = {}): string {
  const rng = resolveRng(options);
  let root: string;
  do {
    root = options.alphanumeric
      ? Array.from({ length: 8 }, () => pick(rng, ALPHABET)).join('')
      : randomDigits(rng, 8);
  } while (isRepeated(root) || (options.alphanumeric && !/[A-Z]/.test(root)));
  const base = `${root}0001`;
  const cnpj = base + computeCheckDigits(base);
  return options.formatted ? format(cnpj) : cnpj;
}
