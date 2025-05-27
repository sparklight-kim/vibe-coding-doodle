# TanStack Router Head 관리 구현

## 📋 개요

TanStack Router를 사용하여 리액트 애플리케이션에서 동적 head 관리 기능을 구현했습니다. 이를 통해 각 라우트별로 title, meta 태그, link 태그 등을 동적으로 설정할 수 있습니다.

## 🎯 구현된 기능

### 1. 기본 Head 관리
- 루트 라우트에서 기본 title과 meta 태그 설정
- 각 페이지별 고유한 title과 description 설정
- SEO 최적화를 위한 Open Graph 태그 설정
- Twitter Card 메타 태그 설정

### 2. 동적 Head 관리
- URL 파라미터를 활용한 동적 title 생성
- 라우트별 맞춤형 meta 태그 설정
- 중첩 라우트에서의 head 태그 상속 및 오버라이드

### 3. 구조화된 메타데이터
- 각 라우트별 구조화된 메타데이터 관리
- 일관된 브랜딩을 위한 사이트 정보 설정
- 검색 엔진 최적화를 위한 canonical URL 설정

## 🛠 구현 방법

### 1. 루트 라우트 설정

```typescript
// src/app/routes/__root.tsx
import { createRootRoute, Link, Outlet, HeadContent } from '@tanstack/react-router'

export const Route = createRootRoute({
  head: () => ({
    meta: [
      {
        title: 'My Blog',
      },
      {
        name: 'description',
        content: 'A personal blog about technology, programming, and development',
      },
      {
        name: 'keywords',
        content: 'blog, technology, programming, development, react, typescript',
      },
      {
        property: 'og:type',
        content: 'website',
      },
      {
        property: 'og:site_name',
        content: 'My Blog',
      },
    ],
    links: [
      {
        rel: 'icon',
        href: '/favicon.ico',
      },
      {
        rel: 'canonical',
        href: 'https://myblog.com',
      },
    ],
  }),
  component: () => (
    <>
      <HeadContent />
      {/* 나머지 컴포넌트 */}
    </>
  ),
})
```

### 2. 페이지별 Head 설정

```typescript
// src/app/routes/index.tsx
export const Route = createFileRoute('/')({
  head: () => ({
    meta: [
      {
        title: 'Home - My Blog',
      },
      {
        name: 'description',
        content: 'Welcome to my personal blog. Discover articles about technology, programming, and development.',
      },
      {
        property: 'og:title',
        content: 'Home - My Blog',
      },
      {
        property: 'og:url',
        content: 'https://myblog.com',
      },
    ],
  }),
  component: Index,
})
```

### 3. 동적 파라미터를 활용한 Head 설정

```typescript
// src/app/routes/posts/$slug.tsx
export const Route = createFileRoute('/posts/$slug')({
  head: ({ params }) => ({
    meta: [
      {
        title: `Post ${params.slug} - My Blog`,
      },
      {
        name: 'description',
        content: 'Blog post content.',
      },
      {
        property: 'og:type',
        content: 'article',
      },
      {
        property: 'og:url',
        content: `https://myblog.com/posts/${params.slug}`,
      },
    ],
  }),
  component: PostPage,
})
```

## 🔧 핵심 컴포넌트

### HeadContent 컴포넌트
- TanStack Router에서 제공하는 핵심 컴포넌트
- 루트 컴포넌트에서 반드시 렌더링해야 함
- 각 라우트의 head 설정을 실제 DOM에 적용

### head 함수
- 각 라우트에서 head 태그를 정의하는 함수
- `meta`, `links`, `scripts` 속성을 반환
- 라우트 파라미터와 컨텍스트에 접근 가능

## 📊 테스트 구현

### 테스트 파일 구조
```
src/test/head-management.test.tsx
```

### 테스트 케이스
1. 루트 라우트의 기본 title과 meta 태그 설정 테스트
2. 중첩 라우트에서의 title 오버라이드 테스트
3. 동적 파라미터를 활용한 title과 meta 태그 테스트
4. Link 태그 (canonical URL, favicon) 테스트
5. Script 태그 테스트

### 테스트 환경 설정
- Vitest와 Testing Library 사용
- 메모리 히스토리를 활용한 라우터 테스트
- DOM 상태 관리를 위한 beforeEach/afterEach 설정

## 🎨 주요 특징

### 1. 타입 안전성
- TypeScript를 통한 완전한 타입 안전성
- 라우트 파라미터의 타입 검증
- 컴파일 타임 오류 검출

### 2. 자동 중복 제거
- TanStack Router가 자동으로 중복 태그 제거
- 중첩 라우트에서 마지막 태그가 우선순위를 가짐
- 효율적인 메타데이터 관리

### 3. SEO 최적화
- 구조화된 메타데이터 설정
- Open Graph 태그를 통한 소셜 미디어 최적화
- 검색 엔진 친화적인 URL 구조

## 🚀 사용법

### 1. 기본 설정
```bash
npm install @tanstack/react-router
```

### 2. 라우트 파일 생성
각 라우트 파일에서 `head` 함수를 정의하여 메타데이터 설정

### 3. HeadContent 컴포넌트 추가
루트 컴포넌트에서 `<HeadContent />` 컴포넌트 렌더링

## 📈 성능 최적화

### 1. 지연 로딩
- 라우트별 코드 분할
- 필요한 시점에만 메타데이터 로드

### 2. 캐싱
- 라우트 기반 메타데이터 캐싱
- 불필요한 DOM 조작 최소화

### 3. 메모리 관리
- 컴포넌트 언마운트 시 자동 정리
- 메모리 누수 방지

## 🔍 디버깅 팁

### 1. 개발자 도구 활용
- Elements 탭에서 head 태그 확인
- Network 탭에서 메타데이터 로딩 확인

### 2. 콘솔 로깅
- head 함수 내에서 console.log 활용
- 라우트 변경 시 메타데이터 변화 추적

### 3. 타입 검증
- TypeScript 컴파일러를 통한 타입 오류 확인
- 런타임 오류 방지

## 🎯 향후 개선 사항

### 1. 동적 메타데이터 로딩
- API에서 메타데이터 동적 로딩
- 비동기 데이터를 활용한 head 설정

### 2. 다국어 지원
- i18n을 활용한 다국어 메타데이터
- 언어별 SEO 최적화

### 3. 성능 모니터링
- 메타데이터 로딩 성능 측정
- 사용자 경험 개선

## 📚 참고 자료

- [TanStack Router 공식 문서](https://tanstack.com/router/latest/docs/framework/react/guide/document-head-management)
- [React Head Management Best Practices](https://web.dev/articles/document-head)
- [SEO 최적화 가이드](https://developers.google.com/search/docs/fundamentals/seo-starter-guide)

## 🏁 결론

TanStack Router의 head 관리 기능을 통해 다음과 같은 이점을 얻을 수 있습니다:

1. **타입 안전한 메타데이터 관리**: TypeScript를 통한 컴파일 타임 검증
2. **자동화된 SEO 최적화**: 구조화된 메타데이터 설정
3. **개발자 경험 향상**: 직관적인 API와 자동 중복 제거
4. **성능 최적화**: 효율적인 DOM 조작과 메모리 관리

이러한 구현을 통해 현대적이고 SEO 친화적인 리액트 애플리케이션을 구축할 수 있습니다. 