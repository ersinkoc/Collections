module.exports = {
  root: true,
  
  // Parser and environment
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 2020,
    sourceType: 'module',
    project: ['./tsconfig.json', './tsconfig.*.json'],
    tsconfigRootDir: __dirname,
  },
  
  // Environments
  env: {
    node: true,
    es2020: true,
    jest: true,
  },
  
  // Plugins
  plugins: [
    '@typescript-eslint',
    'import',
    'jest',
    'jsdoc',
  ],
  
  // Base configurations
  extends: [
    'eslint:recommended',
    '@typescript-eslint/recommended',
    '@typescript-eslint/recommended-requiring-type-checking',
    'plugin:import/recommended',
    'plugin:import/typescript',
    'plugin:jest/recommended',
    'plugin:jsdoc/recommended',
    'prettier'
  ],
  
  // Global settings
  settings: {
    'import/resolver': {
      typescript: {
        alwaysTryTypes: true,
        project: ['./tsconfig.json', './tsconfig.*.json'],
      },
    },
  },
  
  // Rules configuration
  rules: {
    // TypeScript specific rules
    '@typescript-eslint/explicit-function-return-type': ['error', {
      allowExpressions: true,
      allowTypedFunctionExpressions: true,
      allowHigherOrderFunctions: true,
      allowDirectConstAssertionInArrowFunctions: true,
    }],
    '@typescript-eslint/explicit-module-boundary-types': 'error',
    '@typescript-eslint/no-explicit-any': 'warn',
    '@typescript-eslint/no-unused-vars': ['error', { 
      argsIgnorePattern: '^_',
      varsIgnorePattern: '^_',
    }],
    '@typescript-eslint/prefer-const': 'error',
    '@typescript-eslint/no-var-requires': 'error',
    '@typescript-eslint/ban-types': ['error', {
      extendDefaults: true,
      types: {
        '{}': false, // Allow {} for records
        'Function': false, // Allow Function type for plugin system
      },
    }],
    '@typescript-eslint/consistent-type-definitions': ['error', 'interface'],
    '@typescript-eslint/no-unnecessary-type-assertion': 'error',
    '@typescript-eslint/prefer-nullish-coalescing': 'error',
    '@typescript-eslint/prefer-optional-chain': 'error',
    '@typescript-eslint/no-floating-promises': 'error',
    '@typescript-eslint/no-misused-promises': 'error',
    '@typescript-eslint/await-thenable': 'error',
    '@typescript-eslint/strict-boolean-expressions': ['warn', {
      allowString: false,
      allowNumber: false,
      allowNullableObject: false,
      allowNullableBoolean: false,
      allowNullableString: false,
      allowNullableNumber: false,
      allowAny: false,
    }],
    
    // Import rules
    'import/order': ['error', {
      groups: [
        'builtin',
        'external',
        'internal',
        ['parent', 'sibling'],
        'index',
      ],
      'newlines-between': 'always',
      alphabetize: {
        order: 'asc',
        caseInsensitive: true,
      },
    }],
    'import/no-unresolved': 'error',
    'import/no-cycle': 'error',
    
    // General ESLint rules
    'no-console': ['warn', { 
      allow: ['warn', 'error', 'info', 'time', 'timeEnd'] 
    }],
    'no-debugger': 'error',
    'no-alert': 'error',
    'no-var': 'error',
    'prefer-const': 'error',
    'prefer-arrow-callback': 'error',
    'object-shorthand': 'error',
    'prefer-template': 'error',
    'no-useless-concat': 'error',
    'prefer-spread': 'error',
    
    // Code style
    'max-len': ['error', {
      code: 100,
      tabWidth: 2,
      ignoreUrls: true,
      ignoreStrings: true,
      ignoreTemplateLiterals: true,
      ignoreRegExpLiterals: true,
    }],
    'max-lines': ['warn', {
      max: 500,
      skipBlankLines: true,
      skipComments: true,
    }],
    'complexity': ['warn', 15],
    'max-depth': ['warn', 4],
    'max-params': ['warn', 5],
    
    // Error handling
    'no-throw-literal': 'error',
    'prefer-promise-reject-errors': 'error',
    
    // Security
    'no-eval': 'error',
    'no-implied-eval': 'error',
    'no-new-func': 'error',
    'no-script-url': 'error',
    
    // JSDoc rules
    'jsdoc/require-description': 'error',
    'jsdoc/require-param-description': 'error',
    'jsdoc/require-returns-description': 'error',
    'jsdoc/check-tag-names': 'error',
    
    // Jest rules (for test files)
    'jest/expect-expect': 'error',
    'jest/no-disabled-tests': 'warn',
    'jest/no-focused-tests': 'error',
    'jest/no-identical-title': 'error',
    'jest/prefer-to-have-length': 'warn',
    'jest/valid-expect': 'error',
  },
  
  // Override rules for specific file patterns
  overrides: [
    // Test files
    {
      files: ['**/*.test.ts', '**/*.spec.ts', '**/tests/**/*.ts'],
      rules: {
        '@typescript-eslint/no-explicit-any': 'off',
        '@typescript-eslint/no-non-null-assertion': 'off',
        'max-lines-per-function': 'off',
        'jsdoc/require-jsdoc': 'off',
        'jsdoc/require-description': 'off',
      },
    },
    
    // Example files
    {
      files: ['examples/**/*.js', 'examples/**/*.ts'],
      rules: {
        'no-console': 'off',
        '@typescript-eslint/no-var-requires': 'off',
        'import/no-unresolved': 'off',
        'jsdoc/require-jsdoc': 'off',
      },
    },
    
    // Benchmark files
    {
      files: ['benchmarks/**/*.js'],
      rules: {
        'no-console': 'off',
        '@typescript-eslint/no-var-requires': 'off',
        'import/no-unresolved': 'off',
        'max-lines-per-function': 'off',
      },
    },
    
    // Configuration files
    {
      files: [
        '*.config.js',
        '*.config.ts',
        '.eslintrc.js',
        'jest.config.js',
      ],
      rules: {
        '@typescript-eslint/no-var-requires': 'off',
        'import/no-unresolved': 'off',
        'jsdoc/require-jsdoc': 'off',
      },
    },
    
    // Plugin files (allow more flexibility for Function type)
    {
      files: ['src/plugins/**/*.ts'],
      rules: {
        '@typescript-eslint/ban-types': ['error', {
          extendDefaults: true,
          types: {
            'Function': false,
            '{}': false,
          },
        }],
      },
    },
  ],
  
  // Ignore patterns
  ignorePatterns: [
    'node_modules/',
    'dist/',
    'coverage/',
    '*.d.ts',
    '*.js.map',
    '*.d.ts.map',
  ],
};