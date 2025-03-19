<p align="center">
    <img src="./.repository/logotype.png" width="100px" />
</p>

# Bitran

Bitran (**B**lock & **I**nliner **tran**spiler) is a highly customizable text processor and transpiler for converting any structured text into programming-friendly DOM (document object model) that consists of elements: blocks and inliners. These elements can be easily analyzed or rendered into any other format: HTML, Vue, etc...

🚧 **Bitran is under heavy development!**

**Key features:**

- User defined blocks and inliners
- YAML structured blocks structure support
- Infinite nesting of blocks and inliners
- Flexible meta syntax with YAML support
- Handy DOM representation of text
- Built-in ID assignment and error handling

## Monorepo Structure

- `packages/core` — Bitran types, schemas and DOM
- `packages/transpiler` — text → (**parse**) → DOM → (**stringify**) → text
- `packages/renderer-vue` — rendering DOM with Vue framework

## Local Development

1. Fork `bitran-js/bitran` repository to your GitHub account and then clone it to your local device
2. Install [Bun](https://bun.sh/) if you does not have it already
3. Run `bun install` and then `bun run build`

Now the project is ready for your edits!
