# TanStack Router + MDX 블로그 시스템

TanStack Router와 MDX를 함께 사용하여 구축한 타입 안전한 블로그 시스템입니다.

## ✨ 주요 기능

- 🚀 **TanStack Router**: 완전한 타입 안전성을 제공하는 클라이언트 사이드 라우팅
- 📝 **MDX 지원**: Markdown + JSX 컴포넌트로 풍부한 컨텐츠 작성
- 🔄 **동적 라우팅**: `/posts/` 폴더의 MDX 파일들이 자동으로 페이지로 인식
- 📱 **반응형 디자인**: Tailwind CSS를 사용한 모던한 UI
- 🧪 **TDD 기반**: Vitest와 Testing Library를 사용한 테스트 주도 개발
- ⚡ **성능 최적화**: Vite의 코드 스플리팅과 lazy loading

## 🛠 기술 스택

- **Frontend**: React 19, TypeScript
- **라우팅**: TanStack Router
- **컨텐츠**: MDX (Markdown + JSX)
- **스타일링**: Tailwind CSS v4 + Typography 플러그인
- **빌드 도구**: Vite
- **테스팅**: Vitest, Testing Library, MSW
- **코드 품질**: Biome (ESLint + Prettier 대체)

## 🚀 시작하기

### 설치

```bash
# 의존성 설치
pnpm install

# 개발 서버 실행
pnpm dev
```

### 새 포스트 작성

1. `src/content/posts/` 폴더에 새로운 `.mdx` 파일을 생성합니다:

```bash
touch src/content/posts/my-new-post.mdx
```

2. MDX 파일에 컨텐츠를 작성합니다:

```mdx
# 새로운 포스트

이것은 새로운 포스트입니다.

## 인터랙티브 컴포넌트

<CustomButton text="클릭해보세요!" />

export function CustomButton({ text }) {
  return (
    <button className="bg-blue-500 text-white px-4 py-2 rounded">
      {text}
    </button>
  )
}
```

3. 브라우저에서 `http://localhost:5173/posts/my-new-post`로 접근하면 자동으로 페이지가 생성됩니다.

## 📁 프로젝트 구조

```
src/
├── app/
│   ├── routes/
│   │   ├── __root.tsx          # 루트 레이아웃
│   │   ├── index.tsx           # 홈페이지
│   │   ├── posts.tsx           # 포스트 레이아웃
│   │   ├── posts/
│   │   │   └── index.tsx       # 포스트 목록 페이지
│   │   └── posts/
│   │       └── $slug.tsx       # 동적 포스트 페이지
│   ├── main.tsx                # 앱 진입점
│   └── index.css               # 글로벌 스타일
├── content/
│   └── posts/                  # MDX 포스트 파일들
├── shared/
│   ├── components/ui/          # 재사용 가능한 UI 컴포넌트
│   └── utils/router/           # 라우터 설정
└── test/
    └── setup.ts                # 테스트 설정
```

## 🧪 테스트

```bash
# 모든 테스트 실행
pnpm test

# 테스트 UI 실행
pnpm test:ui

# 특정 파일 테스트
pnpm test src/app/routes/posts.test.tsx
```

## 📝 사용 가능한 스크립트

```bash
pnpm dev          # 개발 서버 실행
pnpm build        # 프로덕션 빌드
pnpm preview      # 빌드 결과 미리보기
pnpm test         # 테스트 실행
pnpm lint         # 코드 린팅
pnpm format       # 코드 포맷팅
pnpm check        # 코드 품질 검사
```

## 📚 문서

자세한 구현 내용과 사용법은 [TanStack Router와 MDX 통합 가이드](./docs/tanstack-router-mdx-integration.md)를 참고하세요.

## 🤝 기여하기

1. 이 저장소를 포크합니다
2. 새로운 기능 브랜치를 생성합니다 (`git checkout -b feature/amazing-feature`)
3. 변경사항을 커밋합니다 (`git commit -m 'Add some amazing feature'`)
4. 브랜치에 푸시합니다 (`git push origin feature/amazing-feature`)
5. Pull Request를 생성합니다

## 📄 라이선스

이 프로젝트는 MIT 라이선스 하에 배포됩니다.
