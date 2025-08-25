module.exports = {
  // Basic formatting
  printWidth: 100,
  tabWidth: 2,
  useTabs: false,
  semi: true,
  singleQuote: true,
  quoteProps: 'as-needed',
  jsxSingleQuote: true,
  trailingComma: 'es5',
  bracketSpacing: true,
  bracketSameLine: false,
  arrowParens: 'avoid',
  endOfLine: 'lf',
  
  // TypeScript specific
  parser: 'typescript',
  
  // File-specific overrides
  overrides: [
    {
      files: '*.json',
      options: {
        parser: 'json',
        printWidth: 80,
        tabWidth: 2,
      },
    },
    {
      files: '*.md',
      options: {
        parser: 'markdown',
        printWidth: 80,
        proseWrap: 'always',
        tabWidth: 2,
      },
    },
    {
      files: '*.yaml',
      options: {
        parser: 'yaml',
        tabWidth: 2,
        singleQuote: false,
      },
    },
    {
      files: '*.yml',
      options: {
        parser: 'yaml',
        tabWidth: 2,
        singleQuote: false,
      },
    },
    {
      files: ['package.json', 'tsconfig*.json'],
      options: {
        parser: 'json',
        printWidth: 80,
        tabWidth: 2,
        trailingComma: 'none',
      },
    },
  ],
};