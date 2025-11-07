// For more info, see https://github.com/storybookjs/eslint-plugin-storybook#configuration-flat-config-format
import storybook from "eslint-plugin-storybook";

import js from '@eslint/js';
import react from 'eslint-plugin-react';
import reactHooks from 'eslint-plugin-react-hooks';
import jsxA11y from 'eslint-plugin-jsx-a11y';

export default [js.configs.recommended, react.configs.flat.recommended, {
  files: ['**/*.{js,jsx,ts,tsx}'],
  plugins: {
    react,
    'react-hooks': reactHooks,
    'jsx-a11y': jsxA11y,
  },
  languageOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
    parserOptions: {
      ecmaFeatures: {
        jsx: true,
      },
    },
    globals: {
      // Browser globals
      window: 'readonly',
      document: 'readonly',
      console: 'readonly',
      navigator: 'readonly',
      localStorage: 'readonly',
      sessionStorage: 'readonly',
      fetch: 'readonly',
      alert: 'readonly',
      confirm: 'readonly',
      setTimeout: 'readonly',
      clearTimeout: 'readonly',
      setInterval: 'readonly',
      clearInterval: 'readonly',
      requestAnimationFrame: 'readonly',
      cancelAnimationFrame: 'readonly',
      performance: 'readonly',
      PerformanceObserver: 'readonly',
      IntersectionObserver: 'readonly',
      ResizeObserver: 'readonly',
      MutationObserver: 'readonly',
      getComputedStyle: 'readonly',
      Event: 'readonly',
      CustomEvent: 'readonly',
      TouchEvent: 'readonly',
      KeyboardEvent: 'readonly',
      MouseEvent: 'readonly',
      HTMLElement: 'readonly',
      HTMLInputElement: 'readonly',
      HTMLFormElement: 'readonly',
      FileReader: 'readonly',
      Blob: 'readonly',
      File: 'readonly',
      FormData: 'readonly',
      URL: 'readonly',
      URLSearchParams: 'readonly',
      CSS: 'readonly',

      // Node.js globals
      process: 'readonly',
      Buffer: 'readonly',
      global: 'readonly',
      __dirname: 'readonly',
      __filename: 'readonly',
      module: 'readonly',
      require: 'readonly',
      exports: 'readonly',

      // Testing globals
      vi: 'readonly',
      describe: 'readonly',
      it: 'readonly',
      test: 'readonly',
      expect: 'readonly',
      beforeEach: 'readonly',
      afterEach: 'readonly',
      beforeAll: 'readonly',
      afterAll: 'readonly',
    },
  },
  settings: {
    react: {
      version: '18.3',
    },
  },
  rules: {
    // React specific rules
    'react/prop-types': 'off', // We use PropTypes at component level
    'react/no-unused-prop-types': 'warn',
    'react/jsx-uses-react': 'off',
    'react/react-in-jsx-scope': 'off',
    'react/jsx-key': 'error',
    'react/no-array-index-key': 'warn',
    'react/no-deprecated': 'error',
    'react/no-direct-mutation-state': 'error',
    'react/no-unescaped-entities': 'warn',

    // React Hooks - Relaxed
    'react-hooks/exhaustive-deps': 'off', // Too noisy for large codebase
    'react-hooks/rules-of-hooks': 'error',

    // General code quality - Relaxed for large codebase
    'no-unused-vars': ['warn', {
      argsIgnorePattern: '^_',
      varsIgnorePattern: '^_'
    }],
    'no-console': 'off', // Allow console for development
    'no-debugger': 'warn',
    'no-duplicate-imports': 'warn',
    'prefer-const': 'warn',
    'no-var': 'warn',
    'eqeqeq': ['warn', 'always'],
    'curly': 'off', // Allow single-line if statements
    'no-eval': 'error',
    'no-implied-eval': 'error',

    // Accessibility - Essential rules only
    'jsx-a11y/alt-text': 'warn',
    'jsx-a11y/aria-props': 'warn',
    'jsx-a11y/aria-proptypes': 'warn',
    'jsx-a11y/aria-unsupported-elements': 'warn',
    'jsx-a11y/role-has-required-aria-props': 'warn',
    'jsx-a11y/role-supports-aria-props': 'warn',
    'jsx-a11y/click-events-have-key-events': 'off',
    'jsx-a11y/no-noninteractive-element-interactions': 'off',
    'jsx-a11y/anchor-is-valid': 'off',

    // Performance and best practices - Essential only
    'no-unused-expressions': 'warn',
    'no-unreachable': 'error',
    'no-constant-condition': 'warn',
    'no-dupe-keys': 'error',
    'no-duplicate-case': 'error',
    'no-empty': 'warn',
    'no-extra-boolean-cast': 'warn',
    'no-func-assign': 'error',
    'no-inner-declarations': 'warn',
    'no-invalid-regexp': 'error',
    'no-irregular-whitespace': 'warn',
    'no-obj-calls': 'error',
    'no-sparse-arrays': 'warn',
    'no-undef': 'error',    'use-isnan': 'error',
    'valid-typeof': 'error',

    // Additional relaxed rules
    'no-case-declarations': 'off',
    'react/display-name': 'off',
    'react/jsx-no-undef': 'off',
  },
}, {
  files: ['**/*.{ts,tsx}'],
  rules: {
    // Disable parsing errors for TypeScript files in JS project
    'no-undef': 'off',
  },
}, {
  ignores: [
    'dist/**',
    'node_modules/**',
    '*.config.js',
    'src/types/**', // Ignore TypeScript definition files
    '**/*.d.ts',
    'src/utils/*.ts', // Ignore TypeScript utility files
  ],
}, ...storybook.configs["flat/recommended"]];