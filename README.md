# ISDOC Invoice Reader

[![CI/CD Pipeline](https://github.com/rickythefox/isdoc-viewer/actions/workflows/ci-cd.yml/badge.svg)](https://github.com/[user]/[repo]/actions/workflows/ci-cd.yml)
[![Build Status](https://github.com/rickythefox/isdoc-viewer/actions/workflows/quality-check.yml/badge.svg)](https://github.com/[user]/[repo]/actions/workflows/quality-check.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9+-blue)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-18.3-61DAFB?logo=react)](https://react.dev)
[![Vite](https://img.shields.io/badge/Vite-6.4-646CFF?logo=vite)](https://vitejs.dev)

A modern, type-safe React application for reading and displaying Czech ISDOC 6.0.2 electronic invoices. Features include professional invoice rendering, QR code generation for payments, print-friendly views, and PDF export.

## Available online

[https://isdoc-reader.cz/](https://isdoc-reader.cz/)

**The app is client-side only, no data leaves your browser!**

## ✨ Key Features

### 🗂️ Invoice Parsing & Display

-   **ISDOC 6.0.2 Support**: Full compliance with Czech electronic invoice standard
-   **Professional Layout**: Multi-section invoice display matching Czech standards
-   **Type-Safe**: Complete TypeScript interfaces for all invoice elements
-   **Error Handling**: Graceful handling of missing/empty fields

### 💳 Payment Information

-   **Czech QR Codes**: SPD 1.0 format compatible with all Czech banking apps
-   **Bank Details**: Complete account information (IBAN, BIC, bank name)
-   **Payment Symbols**: Variable, constant, and specific symbols
-   **Due Date Highlighting**: Prominent display of payment deadline

### 📄 Document Export

-   **Print View**: Optimized CSS for A4 paper printing
-   **PDF Export**: Client-side PDF generation with layout preservation
-   **Multi-page**: Automatic handling of invoices spanning multiple pages
-   **Responsive**: Works on desktop, tablet, and mobile

## 🚀 Quick Start

### Prerequisites

-   **Node.js** 18+
-   **pnpm** 10.17+

### Installation & Development

```bash
# Clone repository
git clone https://github.com/[user]/[repo].git
cd isdoc-online

# Install dependencies
pnpm install

# Start development server
pnpm dev
# Open http://localhost:5173

# Run type checking
pnpm typecheck

# Run linting
pnpm lint

# Build for production
pnpm build
```

## Available Commands

```bash
# Development
pnpm dev              # Start dev server
pnpm build            # Build for production
pnpm preview          # Preview production build

# Code Quality
pnpm typecheck        # TypeScript type checking
pnpm lint             # Biome linting
pnpm format           # Code formatting
pnpm check            # Lint + format + fix
```

## 📄 License

This project is licensed under the **MIT License** - see [LICENSE](LICENSE) file for details.

## 🤝 Contributing

Contributions welcome! Please:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Make your changes
4. Commit (`git commit -m 'Add amazing feature'`)
5. Push to branch (`git push origin feature/amazing-feature`)
6. Open a Pull Request

All contributions must pass:

-   ✅ TypeScript type checking
-   ✅ Biome linting
-   ✅ Formatting
-   ✅ Production build

**Made with ❤️ using React, TypeScript, and Vite**
