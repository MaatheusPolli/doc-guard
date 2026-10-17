/**
 * Remove tudo o que não é dígito.
 * @example onlyDigits('123.456.789-09') // '12345678909'
 */
export function onlyDigits(value: string): string {
  return String(value ?? '').replace(/\D/g, '');
}

/**
 * Remove pontuação e espaços, mantendo dígitos e letras (em maiúsculas).
 * @example onlyAlphanumeric('12.abc.345/01de-35') // '12ABC34501DE35'
 */
export function onlyAlphanumeric(value: string): string {
  return String(value ?? '')
    .replace(/[^0-9a-z]/gi, '')
    .toUpperCase();
}

/**
 * Converte uma string de dígitos em array de números.
 * @example toDigits('123') // [1, 2, 3]
 */
export function toDigits(value: string): number[] {
  return Array.from(value, (c) => c.charCodeAt(0) - 48);
}

/**
 * Indica se a string é composta por um único caractere repetido.
 * @example isRepeated('11111111111') // true
 */
export function isRepeated(value: string): boolean {
  return value.length > 0 && value.split('').every((c) => c === value[0]);
}
