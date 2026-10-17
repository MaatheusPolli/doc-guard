import { describe, expect, it } from 'vitest';
import * as lib from '../src';

describe('API pública', () => {
  it('exporta namespaces e utilitários', () => {
    expect(typeof lib.cpf.validate).toBe('function');
    expect(typeof lib.cnpj.validate).toBe('function');
    expect(typeof lib.ie.validate).toBe('function');
    expect(typeof lib.detect).toBe('function');
    expect(typeof lib.createRng).toBe('function');
    expect(new lib.InvalidDocumentError('cpf', 'x')).toBeInstanceOf(Error);
  });
});
