import type { Rng } from '../shared/random';

/** Siglas das 27 unidades federativas. */
export const UFS = [
  'AC',
  'AL',
  'AM',
  'AP',
  'BA',
  'CE',
  'DF',
  'ES',
  'GO',
  'MA',
  'MG',
  'MS',
  'MT',
  'PA',
  'PB',
  'PE',
  'PI',
  'PR',
  'RJ',
  'RN',
  'RO',
  'RR',
  'RS',
  'SC',
  'SE',
  'SP',
  'TO',
] as const;

/** Sigla de unidade federativa. */
export type UF = (typeof UFS)[number];

/** Regra de validação da Inscrição Estadual de uma UF. */
export interface IeRule {
  readonly uf: UF;
  /** Tamanhos aceitos (sem máscara). */
  readonly lengths: readonly number[];
  /** Máscaras de exibição; a escolhida é a que tem tantos `#` quanto o tamanho do valor. */
  readonly masks: readonly string[];
  /** Valida o valor já normalizado (sem pontuação, maiúsculo). */
  validate(value: string): boolean;
  /** Gera uma IE válida (sem máscara). */
  generate(rng: Rng): string;
}
