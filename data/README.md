# Just Prince2 Study App — full question bank

- [Search all 820 original questions](../bank/index.html)
- [Download complete bank (JSON)](questions.json)
- [Download complete bank (CSV)](questions.csv)
- [Question counts and formats](manifest.json)
- [Research-led subset of 425 questions](../research/research-questions.json)

JSON fields: `id`, `topic`, `domain`, `level`, `type`, `stem`, `options`, `correct` (zero-based index, with 0=A), `why`, `optionWhy`, `ref`, `sourceBatch`.

The study app can **shuffle answer order**. Don't memorize option letters. Earlier questions may only have a single overall explanation; in those cases `optionWhy` is null rather than an invented explanation. New research-led questions have four individually written option rationales.

These independently authored questions are not live PeopleCert exam questions. Publisher-owned course papers and private study documents are not included in the public repo.
