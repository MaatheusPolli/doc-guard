/** Tipos de documento suportados. */
export type DocumentType = 'cpf' | 'cnpj' | 'ie';

/**
 * Erro lançado por `assertValid` quando o documento é inválido.
 * @example try { cpf.assertValid('1') } catch (e) { e instanceof InvalidDocumentError }
 */
export class InvalidDocumentError extends Error {
  readonly document: DocumentType;
  readonly value: string;

  constructor(document: DocumentType, value: string) {
    super(`${document.toUpperCase()} inválido: "${value}"`);
    this.name = 'InvalidDocumentError';
    this.document = document;
    this.value = value;
  }
}
