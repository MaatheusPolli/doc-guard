# doc-guard

Histórico de versões gerado pelo [changesets](https://github.com/changesets/changesets).

## 0.1.4

### Patch Changes

- cb08b24: Corrige a documentação: o subcaminho de CPF ocupa ~1,5 KB gzip (não menos de 1 KB), as fixtures têm 239 IEs reais (não 250), e a seção do CNPJ alfanumérico passa a descrever o que a IN RFB nº 2.229/2024 definiu, com adoção prevista para 31/07/2026, em vez de afirmar vigência. Sem mudanças de código.

## 0.1.3

### Patch Changes

- 007efa4: Corrige `cnpj.charValue`, que devolvia valores errados para letras minúsculas (`charValue('a')` dava 49 em vez de 17). Agora normaliza a caixa, igual ao que `computeCheckDigits` já fazia internamente.

## 0.1.2

### Patch Changes

- 7de0179: Valida o fluxo de release automatizado com changesets. Sem mudanças de código.

## 0.1.1

### Patch Changes

- Amplia as keywords do `package.json` para facilitar a busca no npm.
- Publicação do pacote passa a ser feita pelo GitHub Actions, com provenance, ao enviar uma tag `v*`.

## 0.1.0

### Minor Changes

- Primeira versão: CPF, CNPJ (numérico e alfanumérico 2026) e Inscrição Estadual das 27 UFs, com `validate`, `assertValid`, `format`, `unformat`, `generate` e `detect`.
