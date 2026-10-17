/**
 * doc-guard — validação, formatação e geração de documentos brasileiros.
 *
 * Para bundles menores importe por documento: `doc-guard/cpf`, `doc-guard/cnpj`, `doc-guard/ie`.
 */
export * as cpf from './cpf';
export * as cnpj from './cnpj';
export * as ie from './ie';
export { detect } from './detect';
export { InvalidDocumentError, type DocumentType } from './shared/errors';
export { createRng, type GenerateOptions, type Rng } from './shared/random';
export type { UF, IeRule } from './ie/types';
