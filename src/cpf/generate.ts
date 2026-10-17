import { isRepeated } from '../shared/digits';
import { randomDigits, resolveRng, type GenerateOptions } from '../shared/random';
import { computeCheckDigits } from './validate';
import { format } from './format';

/**
 * Gera um CPF válido (para massa de teste).
 * @example generate({ seed: 42 }) // sempre o mesmo CPF
 * @example generate({ formatted: true }) // '###.###.###-##'
 */
export function generate(options: GenerateOptions = {}): string {
  const rng = resolveRng(options);
  let base = randomDigits(rng, 9);
  while (isRepeated(base)) base = randomDigits(rng, 9);
  const cpf = base + computeCheckDigits(base);
  return options.formatted ? format(cpf) : cpf;
}
