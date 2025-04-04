# PyCrab Frontend

A modern React application built with TypeScript, Vite, and Tailwind CSS.

## Prerequisites

- Node.js (v20 or higher recommended)
- pnpm (v10 or higher recommended)

If you don't have pnpm installed, you can install it using:

```bash
npm install -g pnpm
```

## Getting Started

1. Clone the repository:
```bash
git clone <repository-url>
cd pycrab-fe
```

2. Install dependencies:
```bash
pnpm install
```

3. Start the development server:
```bash
pnpm dev
```

4. Build for production:
```bash
pnpm build
```

## Available Scripts

- `pnpm dev` - Start development server with hot reload
- `pnpm build` - Build for production
- `pnpm preview` - Preview production build locally
- `pnpm lint` - Run ESLint
- `pnpm lint:fix` - Fix ESLint errors automatically
- `pnpm format` - Format code with Prettier
- `pnpm format:check` - Check code formatting

## Technology Stack

- React 18
- TypeScript
- Vite 5
- Tailwind CSS 4
- Radix UI
- Zustand (State Management)
- ESLint + Prettier (Code Quality)

## ESLint Configuration

This project uses ESLint v9 with the new flat config system. File ignores are configured directly in `eslint.config.js` using the `ignores` property:

```js
export default tseslint.config({
  extends: [
    // Remove ...tseslint.configs.recommended and replace with this
    ...tseslint.configs.recommendedTypeChecked,
    // Alternatively, use this for stricter rules
    ...tseslint.configs.strictTypeChecked,
    // Optionally, add this for stylistic rules
    ...tseslint.configs.stylisticTypeChecked,
  ],
  languageOptions: {
    // other options...
    parserOptions: {
      project: ['./tsconfig.node.json', './tsconfig.app.json'],
      tsconfigRootDir: import.meta.dirname,
    },
  },
  ignores: [
    'node_modules',
    'dist',
    'build',
    '*.config.js',
    // ... other ignore patterns
  ],
})
```

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default tseslint.config({
  plugins: {
    // Add the react-x and react-dom plugins
    'react-x': reactX,
    'react-dom': reactDom,
  },
  rules: {
    // other rules...
    // Enable its recommended typescript rules
    ...reactX.configs['recommended-typescript'].rules,
    ...reactDom.configs.recommended.rules,
  },
})
```

## Package Manager

This project uses pnpm as its package manager. Please do not use npm or yarn to install dependencies as this might lead to inconsistencies. The project includes a `pnpm-lock.yaml` file to ensure dependency version consistency across the team.

## Managing Dependencies

### Installing Packages

- Add a production dependency:
```bash
pnpm add <package-name>
```

- Add a development dependency:
```bash
pnpm add -D <package-name>
```

- Add a specific version:
```bash
pnpm add <package-name>@<version>
```

### Upgrading Packages

- Upgrade a single package to latest version:
```bash
pnpm up <package-name>@latest
```

- Check outdated packages:
```bash
pnpm outdated
```

- Upgrade all packages (following semver):
```bash
pnpm up
```

### Examples

```bash
# Upgrade ESLint to latest version
pnpm add -D eslint@latest

# Add a production dependency like axios
pnpm add axios

# Add multiple dev dependencies
pnpm add -D @types/node @types/react

# Add a specific version
pnpm add -D typescript@5.2.2
```

## Contributing

1. Make sure you have pnpm installed
2. Fork the repository
3. Create your feature branch (`git checkout -b feature/amazing-feature`)
4. Commit your changes using conventional commits
5. Push to the branch (`git push origin feature/amazing-feature`)
6. Open a Pull Request

## License

[Add your license here]
