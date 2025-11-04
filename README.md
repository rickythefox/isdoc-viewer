# TypeScript Template

A modern TypeScript template with tsx for execution, Biome for linting/formatting, and automatic import sorting.

## Features

- **TypeScript 5.9+** - Latest TypeScript with strict type checking
- **tsx** - Fast TypeScript execution without build step
- **Biome** - Ultra-fast linting, formatting, and import sorting
- **pnpm** - Fast, disk space efficient package manager
- **ES Modules** - Modern ESM support

## Getting Started

### Prerequisites

- Node.js 18+
- pnpm (install via `npm install -g pnpm` or `corepack enable`)

### Installation

```bash
# Clone this template (or use as GitHub template)
git clone <your-repo-url>
cd typescript-template

# Install dependencies
pnpm install
```

## Usage

### Development

```bash
# Run TypeScript directly with tsx
pnpm dev
```

### Type Checking

```bash
# Run TypeScript compiler for type checking (no output)
pnpm typecheck
```

### Linting & Formatting

```bash
# Lint code
pnpm lint

# Format code
pnpm format

# Check and fix formatting, imports, and linting
pnpm check
```

## Project Structure

```
.
├── src/
│   ├── index.ts      # Main entry point
│   └── utils.ts      # Example utilities
├── biome.json        # Biome configuration
├── tsconfig.json     # TypeScript configuration
├── package.json      # Project metadata and scripts
└── .gitignore        # Git ignore rules
```

## Configuration

### TypeScript (tsconfig.json)

Configured with strict type checking, ES2022 target, and modern module resolution.

### Biome (biome.json)

Configured with:
- 2-space indentation
- Double quotes for strings
- Automatic import sorting and organization
- Git integration for efficient file handling
- Recommended linting rules enabled

## Scripts

- `pnpm dev` - Run the application with tsx
- `pnpm build` - Type check the project
- `pnpm typecheck` - Run TypeScript type checking
- `pnpm lint` - Lint code with Biome
- `pnpm format` - Format code with Biome
- `pnpm check` - Run Biome check (lint + format + organize imports)

## License

MIT
