# Vite + React MDX 환경 설정 가이드

## 1. MDX 관련 라이브러리 설치

```bash
pnpm add @mdx-js/react @mdx-js/rollup
pnpm add -D @types/mdx
```

## 2. vite.config.ts 설정

vite에서 mdx를 사용할 수 있도록 `@mdx-js/rollup` 플러그인을 plugins 배열에 추가합니다.

```ts
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tsconfigPaths from 'vite-tsconfig-paths'
import tailwindcss from '@tailwindcss/vite'
import { TanStackRouterVite } from '@tanstack/router-plugin/vite'

export default defineConfig(async () => {
  const mdx = await import('@mdx-js/rollup')
  return {
    plugins: [
      TanStackRouterVite({
        target: 'react',
        autoCodeSplitting: true,
        routesDirectory: 'src/app/routes',
        generatedRouteTree: 'src/shared/utils/router/routeTree.gen.ts',
      }),
      react(),
      tailwindcss(),
      tsconfigPaths(),
      mdx.default(),
    ],
    build: {
      rollupOptions: {
        input: 'src/app/main.tsx',
      },
    },
  }
})
```

## 3. 타입 선언 추가

`src/app/vite-env.d.ts`에 아래 타입 선언을 추가합니다.

```ts
declare module '*.mdx' {
  let MDXComponent: (props: any) => JSX.Element
  export default MDXComponent
}
```

## 4. tsconfig.app.json, tsconfig.node.json에 types 추가

```json
{
  "compilerOptions": {
    // ...
    "types": ["vite/client", "mdx"]
  }
}
```

## 5. 빌드 및 테스트

설정 후 `pnpm run build`로 빌드가 정상적으로 되는지 확인합니다.

---

이제 `.mdx` 파일을 import하여 React 컴포넌트처럼 사용할 수 있습니다. 