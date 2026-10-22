// Verifica que o pacote construído carrega e funciona nas versões de Node que
// o campo `engines` promete, sem instalar nada: a biblioteca não tem
// dependências de runtime. O vitest exige Node 22.12+, então as versões
// antigas são cobertas por este teste de fumaça em vez da suíte completa.
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
const failures = [];

function check(label, actual, expected) {
  const ok = actual === expected;
  console.log(`${ok ? 'ok  ' : 'FALHOU'} ${label} -> ${actual}`);
  if (!ok) failures.push(`${label}: esperado ${expected}, recebeu ${actual}`);
}

const esm = await import('../dist/index.js');
check('esm cpf.validate', esm.cpf.validate('529.982.247-25'), true);
check('esm cpf.validate (repetido)', esm.cpf.validate('111.111.111-11'), false);
check('esm cnpj.validate', esm.cnpj.validate('11.222.333/0001-81'), true);
check('esm cnpj alfanumérico', esm.cnpj.validate('12.ABC.345/01DE-35'), true);
check('esm cnpj.charValue minúscula', esm.cnpj.charValue('a'), 17);
check('esm ie.validate', esm.ie.validate('SP', '110.042.490.114'), true);
check('esm detect', esm.detect('529.982.247-25'), 'cpf');

const cjs = require('../dist/index.cjs');
check('cjs cpf.validate', cjs.cpf.validate('529.982.247-25'), true);
check('cjs ie.validateAny', cjs.ie.validateAny('110.042.490.114').join(), 'SP');

const sub = await import('../dist/cpf/index.js');
check('subpath cpf', sub.validate('529.982.247-25'), true);

if (failures.length > 0) {
  console.error(`\n${failures.length} verificação(ões) falharam no Node ${process.version}:`);
  for (const f of failures) console.error(`  - ${f}`);
  process.exit(1);
}
console.log(`\nTodas as verificações passaram no Node ${process.version}.`);
