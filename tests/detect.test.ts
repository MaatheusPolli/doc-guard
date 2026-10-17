import { describe, expect, it } from 'vitest';
import { detect } from '../src';

describe('detect', () => {
  it.each([
    ['529.982.247-25', 'cpf'],
    ['52998224725', 'cpf'],
    ['11.222.333/0001-81', 'cnpj'],
    ['12.ABC.345/01DE-35', 'cnpj'],
    ['110.042.490.114', 'ie'],
    ['062.307.904/0081', 'ie'],
    ['P-01100424.3/002', 'ie'],
  ])('%s → %s', (v, type) => expect(detect(v)).toBe(type));
  it.each(['', '123', '111.111.111-11', 'abc', '12.345'])('%s → null', (v) =>
    expect(detect(v)).toBeNull(),
  );

  it('CPF inválido com 11 dígitos ainda pode ser uma IE válida (ex.: MT)', () => {
    expect(detect('529.982.247-26')).toBe('ie');
  });
});
