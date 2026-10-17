import { isRepeated, toDigits } from '../shared/digits';
import { weightedSum } from '../shared/modulo11';
import { randomDigits, pick, type Rng } from '../shared/random';

export { toDigits, weightedSum };
export { descendingWeights, modulo11 } from '../shared/modulo11';

/**
 * Verifica se `value` tem só dígitos e um dos tamanhos aceitos.
 * @example hasShape('123', [3]) // true
 */
export function hasShape(value: string, lengths: readonly number[]): boolean {
  return /^\d+$/.test(value) && lengths.includes(value.length);
}

/**
 * Gera uma IE a partir de padrões: `#` é dígito aleatório, `?` é posição de DV
 * resolvida por força bruta contra `validate`, os demais caracteres são literais.
 * @example generateFromPatterns(rng, ['24#####?'], validate)
 */
export function generateFromPatterns(
  rng: Rng,
  patterns: readonly string[],
  validate: (value: string) => boolean,
): string {
  for (;;) {
    const pattern = pick(rng, patterns).replace(/#/g, () => randomDigits(rng, 1));
    const slots = [...pattern].flatMap((c, i) => (c === '?' ? [i] : []));
    const combos = 10 ** slots.length;
    for (let n = 0; n < combos; n++) {
      const chars = [...pattern];
      const fill = String(n).padStart(slots.length, '0');
      slots.forEach((pos, k) => (chars[pos] = fill[k] as string));
      const candidate = chars.join('');
      if (!isRepeated(candidate.replace(/^P/, '')) && validate(candidate)) return candidate;
    }
  }
}
