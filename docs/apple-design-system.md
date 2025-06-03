# 🍏 Apple 스타일 PandaCSS 디자인 시스템 사용법

## 1. 개요

- Apple 공식 디자인 가이드와 최신 트렌드를 참고한 컬러 팔레트 기반 디자인 시스템입니다.
- 라이트/다크 모드를 모두 지원하며, 시맨틱 컬러 토큰 구조로 확장성과 일관성을 보장합니다.
- PandaCSS의 tokens/semanticTokens를 활용해 타입 안전성과 자동 모드 전환을 지원합니다.

---

## 2. 컬러 토큰 구조

- 컬러 정의는 `src/shared/design-system/apple-colors.ts`에 위치합니다.
- 주요 컬러 키:
  - `primary`, `secondary`, `background`, `surface`, `border`, `text`, `textSecondary`, `accent`, `success`, `warning`, `error`, `info`
- 라이트/다크 모드별로 각각 HEX 코드로 정의되어 있습니다.

```ts
export const appleColors = {
  light: { ... },
  dark: { ... }
}
```

---

## 3. PandaCSS 테마 적용

- `panda.config.ts`에서 컬러 토큰을 tokens.colors, semanticTokens.colors로 확장합니다.
- 라이트 모드는 tokens, 다크 모드는 semanticTokens의 `_dark` 조건으로 자동 적용됩니다.

```ts
// panda.config.ts 예시
import { appleColors } from './src/shared/design-system/apple-colors';

const toPandaColorTokens = (colors: Record<string, string>) =>
  Object.fromEntries(Object.entries(colors).map(([k, v]) => [k, { value: v }]));

export default defineConfig({
  theme: {
    extend: {
      tokens: {
        colors: { ...toPandaColorTokens(appleColors.light) },
      },
      semanticTokens: {
        colors: Object.fromEntries(
          Object.keys(appleColors.light).map((key) => [
            key,
            {
              value: {
                base: `{colors.${key}}`,
                _dark: appleColors.dark[key],
              },
            },
          ])
        ),
      },
    },
  },
});
```

---

## 4. 실제 사용 예시

```tsx
import { css } from 'styled-system/css';

export function Example() {
  return (
    <div className={css({ bg: 'primary', color: 'text', p: 16, borderRadius: 8 })}>
      🍏 Apple 스타일 디자인 시스템 적용 예시
    </div>
  );
}
```

- 위 예시처럼 `bg`, `color` 등에 시맨틱 컬러 키를 그대로 사용할 수 있습니다.
- 다크 모드에서는 자동으로 다크 컬러가 적용됩니다.

---

## 5. 라이트/다크 모드 지원

- PandaCSS의 semanticTokens를 활용해 자동으로 모드 전환이 지원됩니다.
- 시스템/브라우저의 다크 모드 설정에 따라 컬러가 자동 적용됩니다.

---

## 6. 테스트 방법

- `src/shared/design-system/__tests__/apple-colors.test.ts`에서 TDD 기반으로 컬러 토큰의 일관성, HEX 포맷, 주요 키 포함 여부를 검증합니다.
- 테스트 실행:

```bash
pnpm exec vitest run src/shared/design-system/__tests__/apple-colors.test.ts
```

---

## 7. 참고

- 컬러 시스템은 최신 Apple 디자인 트렌드와 접근성 가이드라인을 반영합니다.
- 추가적인 컴포넌트, 패턴, 확장 요청은 언제든 문의해 주세요.
