import { defineConfig } from 'tsup';

export default defineConfig({
  entry: {
    index: 'src/index.ts',
    'cpf/index': 'src/cpf/index.ts',
    'cnpj/index': 'src/cnpj/index.ts',
    'ie/index': 'src/ie/index.ts',
  },
  format: ['esm', 'cjs'],
  dts: { compilerOptions: { ignoreDeprecations: '6.0' } },
  clean: true,
  sourcemap: true,
  treeshake: true,
  splitting: true,
  target: 'es2020',
});
