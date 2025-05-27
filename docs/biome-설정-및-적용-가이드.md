# Biome 기본 포매터 설정 및 적용 가이드

## 1. Biome 설치

```bash
pnpm add --save-dev --save-exact @biomejs/biome
```

## 2. VSCode 기본 포매터 설정

`.vscode/settings.json` 파일에 아래와 같이 설정합니다.

```json
{
  "editor.defaultFormatter": "biomejs.biome",
  "editor.codeActionsOnSave": {
    "quickfix.biome": "explicit",
    "source.organizeImports.biome": "explicit"
  },
  "editor.formatOnSave": true
}
```

## 3. biome.json 설정 파일 추가

프로젝트 루트에 `biome.json` 파일을 생성하고 아래와 같이 설정합니다.

```json
{
  "$schema": "https://biomejs.dev/schemas/1.9.4/schema.json",
  "files": {
    "ignore": ["node_modules"]
  },
  "organizeImports": {
    "enabled": true
  },
  "formatter": {
    "enabled": true,
    "indentStyle": "space",
    "indentWidth": 2,
    "lineEnding": "lf",
    "lineWidth": 120
  },
  "linter": {
    "enabled": true,
    "rules": {
      "recommended": true
    }
  }
}
```

## 4. package.json 스크립트 추가

`package.json`의 scripts에 아래 명령어를 추가합니다.

```json
{
  "scripts": {
    "format": "biome format . --write",
    "lint": "biome lint . --apply",
    "check": "biome check ."
  }
}
```

## 5. 적용 결과

- VSCode에서 저장 시 자동으로 biome 포매터가 동작합니다.
- `pnpm format`, `pnpm lint`, `pnpm check` 명령어로 코드 스타일 및 린트 검사를 biome으로 일원화할 수 있습니다.
- 기존 Prettier, ESLint 설정이 필요 없습니다.

---

> 최신 Biome 공식 문서: [https://biomejs.dev/docs/](https://biomejs.dev/docs/) 