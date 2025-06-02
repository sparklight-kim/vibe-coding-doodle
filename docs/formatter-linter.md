# Prettier & ESLint 설정 가이드 (2024 최신)

## 1. Prettier(코드 포매터)

### 설치
```bash
pnpm add -D prettier
```

### 설정 파일
- `.prettierrc` 예시:
```json
{
  "semi": true,
  "trailingComma": "es5",
  "singleQuote": true,
  "printWidth": 80,
  "tabWidth": 2
}
```
- `.prettierignore` 예시:
```
node_modules
dist
build
```

### 사용법
- 전체 포맷: `pnpm format`

---

## 2. ESLint(코드 린터)

### 설치
```bash
pnpm add -D eslint @typescript-eslint/eslint-plugin @typescript-eslint/parser eslint-plugin-react eslint-plugin-react-hooks eslint-config-prettier eslint-plugin-prettier
```

### 설정 파일
- `.eslintrc.json` 예시:
```json
{
  "extends": [
    "eslint:recommended",
    "plugin:react/recommended",
    "plugin:@typescript-eslint/recommended",
    "plugin:react-hooks/recommended",
    "plugin:prettier/recommended"
  ],
  "plugins": ["react", "@typescript-eslint", "prettier"],
  "rules": {
    "react/react-in-jsx-scope": "off",
    "prettier/prettier": "error"
  },
  "parser": "@typescript-eslint/parser",
  "parserOptions": {
    "ecmaFeatures": {
      "jsx": true
    },
    "ecmaVersion": "latest",
    "sourceType": "module"
  },
  "settings": {
    "react": {
      "version": "detect"
    }
  }
}
```
- `.eslintignore` 예시:
```
node_modules
dist
build
```

### 사용법
- 전체 린트: `pnpm lint`

---

## 3. VSCode 연동(권장)
- `.vscode/extensions.json`:
```json
{
  "recommendations": [
    "esbenp.prettier-vscode",
    "dbaeumer.vscode-eslint"
  ]
}
```
- `.vscode/settings.json`:
```json
{
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "editor.formatOnSave": true,
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true
  }
}
```

---

## 4. 참고
- 포매터/린터 규칙은 프로젝트 상황에 맞게 자유롭게 커스터마이즈할 수 있습니다.
- TDD 기반 개발을 위해 테스트 환경도 함께 구축하세요. 