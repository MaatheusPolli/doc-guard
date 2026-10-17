import { validate as isCpf } from './cpf/validate';
import { validate as isCnpj } from './cnpj/validate';
import { validateAny } from './ie';
import type { DocumentType } from './shared/errors';

/**
 * Detecta o tipo de um documento válido. Prioridade: CPF → CNPJ → IE
 * (algumas IEs têm o mesmo tamanho de CPF/CNPJ; em caso de ambiguidade vence CPF/CNPJ).
 * @example detect('529.982.247-25') // 'cpf'
 * @example detect('12.ABC.345/01DE-35') // 'cnpj'
 * @example detect('110.042.490.114') // 'ie'
 * @example detect('123') // null
 */
export function detect(value: string): DocumentType | null {
  if (isCpf(value)) return 'cpf';
  if (isCnpj(value)) return 'cnpj';
  if (validateAny(value).length > 0) return 'ie';
  return null;
}
