import { dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import { FlatCompat } from '@eslint/eslintrc'
import tseslint from '@typescript-eslint/eslint-plugin'
import tsparser from '@typescript-eslint/parser'
import importPlugin from 'eslint-plugin-import'
import prettier from 'eslint-plugin-prettier'
import reactHooks from 'eslint-plugin-react-hooks'
import globals from 'globals'

const isProductionMode = process.env.NODE_ENV === 'production'
const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const compat = new FlatCompat({
  baseDirectory: __dirname,
})

const eslintConfig = [
  // Next.js 및 TypeScript 관련 규칙 확장
  ...compat.extends(
    'next/core-web-vitals',
    'next/typescript',
    'prettier' // Prettier와 충돌하는 ESLint 규칙 비활성화
  ),

  // 모든 파일에 적용되는 공통 규칙
  {
    plugins: {
      import: importPlugin,
      'react-hooks': reactHooks,
      prettier,
    },
    rules: {
      // 일관된 코드 스타일
      'arrow-body-style': 'off',
      'prefer-arrow-callback': 'error',
      'no-else-return': 'off',
      'prefer-const': 'error',
      'no-var': 'error',
      'object-shorthand': 'error',

      // 접근성 관련
      'jsx-a11y/alt-text': 'error',
      'jsx-a11y/anchor-has-content': 'error',
      'jsx-a11y/aria-props': 'error',
      'jsx-a11y/aria-role': 'error',
      'jsx-a11y/aria-unsupported-elements': 'error',

      // React 관련
      'react/jsx-no-useless-fragment': 'error',
      'react/jsx-pascal-case': 'error',
      'react/self-closing-comp': 'error',
      'react/jsx-curly-brace-presence': [
        'error',
        { props: 'never', children: 'never' },
      ],

      // React Hooks 관련 규칙
      'react-hooks/rules-of-hooks': 'error',
      'react-hooks/exhaustive-deps': 'warn',

      // 오류 방지 규칙
      'no-duplicate-imports': 'off',
      'no-console': isProductionMode
        ? ['error', { allow: ['warn', 'error'] }]
        : ['warn', { allow: ['log', 'warn', 'error'] }],

      // Prettier 통합
      'prettier/prettier': 'error',

      // import 순서 관련 규칙
      'import/order': [
        'error',
        {
          // import 그룹 순서 정의
          groups: [
            'builtin', // Node.js 내장 모듈 (fs, path 등)
            'external', // npm 패키지 (react, next, lodash 등)
            'internal', // 프로젝트 내부 경로 별칭 (@/components 등)
            'parent', // 상위 디렉토리 (../components 등)
            'sibling', // 같은 디렉토리 (./Button 등)
            'index', // 현재 디렉토리 (. 또는 ./ 등)
            'object', // 객체 import (import * as name from 'module')
            'type', // 타입 import (import type { Type } from 'module')
          ],
          // 그룹 간 빈 줄 추가
          'newlines-between': 'never',
          // 알파벳 순 정렬 설정
          alphabetize: {
            order: 'asc', // 오름차순 정렬
            caseInsensitive: true, // 대소문자 구분 안 함
          },
          // 특정 패턴에 대한 그룹 및 위치 지정
          pathGroups: [
            // react와 next를 external 그룹 최상단에 배치
            {
              pattern: 'react',
              group: 'external',
              position: 'before',
            },
            {
              pattern: 'next',
              group: 'external',
              position: 'before',
            },
            // 프로젝트 내부 경로 별칭(@로 시작하는 import)
            {
              pattern: '@/**',
              group: 'internal',
            },
          ],
          // 특정 import 타입을 pathGroups 규칙에서 제외
          pathGroupsExcludedImportTypes: ['react'],
        },
      ],
      // import 문은 파일 최상단에 위치해야 함
      'import/first': 'error',
      // 중복 import 금지
      'import/no-duplicates': 'error',
      // 변경 가능한 export 금지 (let, var로 선언된 변수 export 금지)
      'import/no-mutable-exports': 'error',
    },
  },

  // TypeScript 파일 전용 설정
  {
    files: ['**/*.{ts,tsx}'],
    languageOptions: {
      parser: tsparser,
      parserOptions: {
        project: './tsconfig.json',
        ecmaFeatures: {
          jsx: true,
        },
      },
    },

    plugins: {
      '@typescript-eslint': tseslint,
    },
    rules: {
      '@typescript-eslint/no-explicit-any': 'warn',
      '@typescript-eslint/no-non-null-assertion': 'warn',
      '@typescript-eslint/prefer-nullish-coalescing': 'off',
      '@typescript-eslint/prefer-optional-chain': 'error',
      '@typescript-eslint/no-unnecessary-type-assertion': 'error',
      '@typescript-eslint/consistent-type-definitions': ['error', 'interface'],
      '@typescript-eslint/no-import-type-side-effects': 'error',
      '@typescript-eslint/no-redeclare': 'error',
      '@typescript-eslint/no-floating-promises': 'error',
      '@typescript-eslint/no-misused-promises': 'off',
      '@typescript-eslint/await-thenable': 'error',
      '@typescript-eslint/no-unnecessary-condition': 'off',
      '@typescript-eslint/consistent-indexed-object-style': ['error', 'record'],
      '@typescript-eslint/no-unused-vars': [
        'warn',
        {
          argsIgnorePattern: '^_',
          varsIgnorePattern: '^_',
          caughtErrorsIgnorePattern: '^_',
        },
      ],
      '@typescript-eslint/consistent-type-imports': [
        'error',
        {
          prefer: 'type-imports',
          disallowTypeAnnotations: false,
        },
      ],
      '@typescript-eslint/explicit-function-return-type': 'off',
      '@typescript-eslint/ban-ts-comment': [
        'error',
        { 'ts-ignore': 'allow-with-description' },
      ],
      '@typescript-eslint/naming-convention': [
        'error',
        {
          selector: 'interface',
          format: ['PascalCase'],
          // prefix: ['I'],
        },
        {
          selector: 'typeAlias',
          format: ['PascalCase'],
          // prefix: ['T'],
        },
        {
          selector: 'enum',
          format: ['PascalCase'],
          // prefix: ['E'],
        },
      ],

      // 기본 규칙 비활성화
      'no-unused-vars': 'off',
      'no-redeclare': 'off',
      'no-undef': 'off',
    },
  },

  // JavaScript 파일 전용 설정
  {
    files: ['**/*.{js,jsx,mjs,cjs}'],
    rules: {
      'no-unused-vars': [
        'warn',
        {
          argsIgnorePattern: '^_',
          varsIgnorePattern: '^_',
          caughtErrorsIgnorePattern: '^_',
        },
      ],
    },
  },

  // Next.js 파일에 대한 특별 규칙
  {
    files: ['pages/**/*.{js,jsx,ts,tsx}', 'app/**/*.{js,jsx,ts,tsx}'],
    rules: {
      // Next.js 페이지 컴포넌트 관련 규칙
      'import/no-default-export': 'off',
      'react/display-name': 'off',
      'react/function-component-definition': [
        'error',
        {
          namedComponents: 'function-declaration',
          unnamedComponents: 'arrow-function',
        },
      ],
      // Next.js 성능 최적화 관련 규칙
      'react/jsx-no-bind': [
        'warn',
        {
          ignoreDOMComponents: true,
          ignoreRefs: true,
          allowArrowFunctions: true,
          allowFunctions: false,
          allowBind: false,
        },
      ],
    },
  },

  // 설정 파일들에 대한 특별 규칙
  {
    files: [
      '*.config.{js,mjs,cjs,ts}',
      'next.config.{js,mjs}',
      'eslint.config.{js,mjs}',
    ],
    languageOptions: {
      globals: {
        ...globals.node,
      },
    },
    rules: {
      'no-console': 'off',
      '@typescript-eslint/no-var-requires': 'off',
      'import/no-anonymous-default-export': 'off',
      '@typescript-eslint/no-require-imports': 'off',
    },
  },

  // 테스트 파일에 대한 특별 규칙
  {
    files: ['**/__tests__/**/*', '**/*.{test,spec}.{js,jsx,ts,tsx}'],
    languageOptions: {
      globals: {
        ...globals.jest,
      },
    },
    rules: {
      'no-console': 'off',
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/no-non-null-assertion': 'off',
      'import/no-anonymous-default-export': 'off',
      'jest/valid-expect': 'error',
      'jest/no-disabled-tests': 'warn',
      'jest/no-focused-tests': 'error',
      'jest/no-identical-title': 'error',
      'jest/prefer-to-have-length': 'warn',
      'jest/valid-expect-in-promise': 'error',
    },
  },

  // 제외할 파일 및 디렉토리
  {
    ignores: [
      './src/libs/supabase/database.types.ts',
      'storybook-static/**',
      'node_modules/**',
      '.vercel/**',
      '.github/**',
      '.next/**',
      'out/**',
      'build/**',
      'dist/**',
      'public/**',
      '.env*',
      '*.min.js',
      'coverage/**',
      '.nyc_output/**',
      'next-env.d.ts',
      'package-lock.json',
      'bun.lock',
    ],
  },
]

export default eslintConfig
