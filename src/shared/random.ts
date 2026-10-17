/** Função que devolve um número em [0, 1), como `Math.random`. */
export type Rng = () => number;

/** Opções aceitas pelas funções `generate`. */
export interface GenerateOptions {
  /** Semente para resultados reprodutíveis. Ignorada se `rng` for informado. */
  readonly seed?: number;
  /** Gerador de números aleatórios injetável. */
  readonly rng?: Rng;
  /** Se `true`, retorna o documento com máscara. */
  readonly formatted?: boolean;
}

/**
 * PRNG determinístico (mulberry32).
 * @example const rng = createRng(42); rng(); // sempre o mesmo valor
 */
export function createRng(seed: number): Rng {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/**
 * Resolve o RNG a partir das opções: `rng` > `seed` > `Math.random`.
 * @example resolveRng({ seed: 1 })
 */
export function resolveRng(options: GenerateOptions = {}): Rng {
  if (options.rng) return options.rng;
  if (options.seed !== undefined) return createRng(options.seed);
  return Math.random;
}

/**
 * Gera `length` dígitos aleatórios.
 * @example randomDigits(createRng(1), 3) // ex.: '482'
 */
export function randomDigits(rng: Rng, length: number): string {
  let out = '';
  for (let i = 0; i < length; i++) out += Math.floor(rng() * 10);
  return out;
}

/**
 * Escolhe um elemento aleatório de uma lista não vazia.
 * @example pick(createRng(1), ['a', 'b'])
 */
export function pick<T>(rng: Rng, items: readonly T[]): T {
  return items[Math.floor(rng() * items.length)] as T;
}
