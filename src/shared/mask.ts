/**
 * Aplica uma máscara declarativa. Cada `#` consome um caractere de `value`;
 * os demais caracteres da máscara são copiados literalmente.
 * @example applyMask('###.###.###-##', '12345678909') // '123.456.789-09'
 */
export function applyMask(mask: string, value: string): string {
  let out = '';
  let i = 0;
  for (const m of mask) {
    if (i >= value.length) break;
    out += m === '#' ? value[i++] : m;
  }
  return out;
}
