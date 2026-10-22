---
'@matheuspolli/doc-guard': patch
---

Corrige `cnpj.charValue`, que devolvia valores errados para letras minúsculas (`charValue('a')` dava 49 em vez de 17). Agora normaliza a caixa, igual ao que `computeCheckDigits` já fazia internamente.
