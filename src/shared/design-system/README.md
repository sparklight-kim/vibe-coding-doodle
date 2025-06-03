# 🍏 Apple 스타일 PandaCSS 디자인 시스템

## 개요

- Apple 공식 디자인 가이드와 최신 트렌드를 참고하여 컬러 팔레트를 정의했습니다.
- 컬러 토큰은 라이트/다크 모드를 모두 지원하며, 시맨틱하게 구성되어 있습니다.
- PandaCSS의 tokens/semanticTokens를 활용해 타입 안전성과 확장성을 확보했습니다.

## 컬러 토큰 구조

- `src/shared/design-system/apple-colors.ts`에 라이트/다크 모드별 컬러 정의
- 주요 키: `primary`, `secondary`, `background`, `surface`, `border`, `text`, `textSecondary`, `accent`, `success`, `warning`, `error`, `info`

```ts
export const appleColors = {
  light: { ... },
  dark: { ... }
}
```

## PandaCSS 테마 적용

- `panda.config.ts`에서 컬러 토큰을 tokens.colors, semanticTokens.colors로 확장
- 라이트 모드는 tokens, 다크 모드는 semanticTokens의 `_dark` 조건으로 자동 적용

```ts
// 예시
{
  theme: {
    extend: {
      tokens: {
        colors: { ...appleColors.light }
      },
      semanticTokens: {
        colors: {
          primary: { value: { base: '{colors.primary}', _dark: appleColors.dark.primary } },
          // ... 이하 동일
        }
      }
    }
  }
}
```

## 사용 예시

```tsx
import { css } from 'styled-system/css';

export function Example() {
  return <div className={css({ bg: 'primary', color: 'text' })}>Apple 스타일 디자인 시스템 적용 예시</div>;
}
```

## 테스트

- Vitest 기반 TDD로 컬러 토큰의 일관성과 HEX 포맷, 주요 키 포함 여부를 검증

## 라이트/다크 모드 지원

- PandaCSS의 semanticTokens를 활용해 자동으로 모드 전환 지원

---

> 최신 Apple 디자인 트렌드와 접근성 가이드라인을 반영한 컬러 시스템입니다.
