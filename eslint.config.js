import js from '@eslint/js';
import prettierConfig from 'eslint-config-prettier';
import prettierPlugin from 'eslint-plugin-prettier';
import react from 'eslint-plugin-react';
import reactHooks from 'eslint-plugin-react-hooks';
import globals from 'globals';
import tseslint from 'typescript-eslint';

// prettier-plugin-prettier의 recommended 룰 직접 병합
const prettierRecommended = {
  plugins: { prettier: prettierPlugin },
  rules: {
    'prettier/prettier': 'error',
  },
};

export default [
  // 기본 JS 권장 규칙
  js.configs.recommended,
  // 타입스크립트 권장 규칙 (flat config spread)
  ...tseslint.configs.recommended,
  // React flat config 적용
  react.configs.flat.recommended,
  // React Hooks는 flat config 미지원이므로 직접 룰 병합
  {
    plugins: { 'react-hooks': reactHooks },
    rules: {
      ...reactHooks.configs.recommended.rules,
    },
  },
  prettierRecommended,
  // 프로젝트별 커스텀 규칙
  {
    files: ['**/*.{js,jsx,ts,tsx}'],
    languageOptions: {
      parser: tseslint.parser,
      ecmaVersion: 'latest',
      sourceType: 'module',
      globals: {
        ...globals.browser,
        ...globals.node,
      },
      parserOptions: {
        ecmaFeatures: { jsx: true },
      },
    },
    settings: {
      react: {
        version: 'detect',
      },
    },
  },
  // 무시할 파일/폴더
  {
    ignores: ['node_modules', 'dist', 'build', 'public'],
  },
  // prettier config 적용 (flat config에서 spread 필요)
  prettierConfig,
];
