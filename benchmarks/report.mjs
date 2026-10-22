// Imprime como tabela markdown, pronta para colar no README, os resultados que
// validate.bench.ts grava via `writeResult`: o vitest 5 não exibe nada em modo
// bench. O throughput medido é em iterações/s e cada iteração valida
// DOCS_PER_ITERATION documentos.
import { readFileSync } from 'node:fs';

const DOCS_PER_ITERATION = 1000;

const BENCHES = [
  ['cpf.validate', 'cpf-validate.json'],
  ['cnpj.validate (50% alfanumérico)', 'cnpj-validate.json'],
  ["ie.validate('SP')", 'ie-validate.json'],
  ['ie.validateAny (27 regras)', 'ie-validate-any.json'],
];

const formatter = new Intl.NumberFormat('pt-BR', { maximumFractionDigits: 0 });

const rows = BENCHES.map(([label, file]) => {
  const path = new URL(`results/${file}`, import.meta.url);
  let result;
  try {
    result = JSON.parse(readFileSync(path, 'utf8'));
  } catch {
    console.error(`Resultado ausente: ${file}. Rode "npm run bench".`);
    process.exit(1);
  }
  return {
    label,
    perSecond: formatter.format(result.throughput.mean * DOCS_PER_ITERATION),
    error: `±${result.throughput.rme.toFixed(1)}%`,
  };
});

const pad = (value, size) => value.padEnd(size);
const padStart = (value, size) => value.padStart(size);
const labelWidth = Math.max(...rows.map((r) => r.label.length), 'Operação'.length);
const valueWidth = Math.max(...rows.map((r) => r.perSecond.length), 'Validações/s'.length);
const errorWidth = Math.max(...rows.map((r) => r.error.length), 'Erro'.length);

console.log(
  `\nNode ${process.version}, ${formatter.format(DOCS_PER_ITERATION)} documentos por iteração:\n`,
);
console.log(
  `| ${pad('Operação', labelWidth)} | ${padStart('Validações/s', valueWidth)} | ${padStart('Erro', errorWidth)} |`,
);
console.log(
  `| ${'-'.repeat(labelWidth)} | ${'-'.repeat(valueWidth - 1)}: | ${'-'.repeat(errorWidth - 1)}: |`,
);
for (const row of rows) {
  console.log(
    `| ${pad(row.label, labelWidth)} | ${padStart(row.perSecond, valueWidth)} | ${padStart(row.error, errorWidth)} |`,
  );
}
console.log();
