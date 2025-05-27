# TanStack Router와 MDX 통합 가이드

## 📋 개요

이 문서는 TanStack Router와 MDX를 함께 사용하여 `/posts/` 폴더 안의 MDX 파일들이 각각 페이지로 인식되는 블로그 시스템을 구축하는 방법을 설명합니다.

## 🛠 기술 스택

- **TanStack Router**: 타입 안전한 클라이언트 사이드 라우팅
- **MDX**: Markdown + JSX 컴포넌트
- **Vite**: 빌드 도구 및 개발 서버
- **TypeScript**: 타입 안전성
- **Tailwind CSS**: 스타일링 (Typography 플러그인 포함)

## 🏗 프로젝트 구조

```
src/
├── app/
│   └── routes/
│       ├── __root.tsx          # 루트 레이아웃
│       ├── index.tsx           # 홈페이지
│       ├── posts.tsx           # 포스트 레이아웃
│       ├── posts/
│       │   └── index.tsx       # 포스트 목록 페이지
│       └── posts/
│           └── $slug.tsx       # 동적 포스트 페이지
└── content/
    └── posts/
        ├── test-post.mdx       # 개별 포스트 파일
        ├── another-post.mdx    # 개별 포스트 파일
        └── not-found.mdx       # 404 페이지
```

## 🔧 주요 구현 사항

### 1. 동적 라우팅 설정

`src/app/routes/posts/$slug.tsx`에서 Vite의 glob import를 사용하여 MDX 파일들을 동적으로 로드:

```typescript
// Vite의 glob import를 사용하여 모든 MDX 파일을 미리 로드
const posts = import.meta.glob('../../../content/posts/*.mdx', { eager: false })

function PostPage() {
  const { slug } = Route.useParams()
  
  // 해당 slug에 맞는 MDX 파일을 찾습니다
  const postPath = `../../../content/posts/${slug}.mdx`
  const PostContent = lazy(() => {
    if (posts[postPath]) {
      return posts[postPath]() as Promise<{ default: React.ComponentType }>
    }
    // 파일이 없으면 not-found 페이지를 보여줍니다
    return posts['../../../content/posts/not-found.mdx']() as Promise<{ default: React.ComponentType }>
  })

  return (
    <article className="prose prose-lg max-w-none">
      <Suspense fallback={<div className="animate-pulse">로딩 중...</div>}>
        <PostContent />
      </Suspense>
    </article>
  )
}
```

### 2. 포스트 목록 자동 생성

`src/app/routes/posts/index.tsx`에서 파일 시스템 기반으로 포스트 목록을 자동 생성:

```typescript
// Vite의 glob import를 사용하여 모든 MDX 파일의 메타데이터를 가져옵니다
const postModules = import.meta.glob('../../../content/posts/*.mdx', { eager: false })

function PostsIndex() {
  // MDX 파일 경로에서 slug를 추출하고 포스트 목록을 생성합니다
  const posts = Object.keys(postModules)
    .filter(path => !path.includes('not-found.mdx')) // not-found 파일은 제외
    .map(path => {
      const slug = path.split('/').pop()?.replace('.mdx', '') || ''
      
      return {
        slug,
        title: slug.split('-').map(word => 
          word.charAt(0).toUpperCase() + word.slice(1)
        ).join(' '),
        description: `${slug}에 대한 포스트입니다.`,
        date: '2024-01-15',
      }
    })
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())

  // ... 렌더링 로직
}
```

### 3. MDX 파일에서 React 컴포넌트 사용

MDX 파일 내에서 직접 React 컴포넌트를 정의하고 사용할 수 있습니다:

```mdx
# Test Post

이것은 TanStack Router와 MDX를 함께 사용하는 테스트 포스트입니다.

## 인터랙티브 컴포넌트

<CustomButton text="클릭해보세요!" />

export function CustomButton({ text }) {
  return (
    <button 
      className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
      onClick={() => alert('MDX에서 컴포넌트가 작동합니다!')}
    >
      {text}
    </button>
  )
}
```

## 🎯 주요 기능

### ✅ 구현된 기능

1. **파일 기반 라우팅**: `/posts/slug` 형태의 URL로 MDX 파일에 접근
2. **동적 포스트 로딩**: Vite의 glob import를 사용한 효율적인 코드 스플리팅
3. **타입 안전성**: TanStack Router의 완전한 TypeScript 지원
4. **자동 포스트 목록**: 파일 시스템 기반 포스트 목록 자동 생성
5. **404 처리**: 존재하지 않는 포스트에 대한 적절한 에러 페이지
6. **MDX 컴포넌트**: MDX 파일 내에서 React 컴포넌트 사용 가능
7. **반응형 디자인**: Tailwind CSS를 사용한 모던한 UI

### 🔄 향후 개선 사항

1. **Frontmatter 지원**: MDX 파일의 메타데이터 파싱
2. **검색 기능**: 포스트 검색 및 필터링
3. **태그 시스템**: 포스트 분류 및 태그 기반 필터링
4. **RSS 피드**: 자동 RSS 피드 생성
5. **SEO 최적화**: 메타 태그 및 구조화된 데이터

## 🧪 테스트

TDD 기반으로 개발되었으며, 다음과 같은 테스트가 포함되어 있습니다:

```typescript
describe('Posts Routes', () => {
  it('should render posts index page', async () => {
    // 포스트 목록 페이지 렌더링 테스트
  })

  it('should render individual post page', async () => {
    // 개별 포스트 페이지 렌더링 테스트
  })
})
```

## 🚀 사용 방법

### 1. 새 포스트 추가

`src/content/posts/` 폴더에 새로운 `.mdx` 파일을 추가하면 자동으로 라우팅됩니다:

```bash
# 새 포스트 파일 생성
touch src/content/posts/my-new-post.mdx
```

### 2. 포스트 접근

- 포스트 목록: `http://localhost:5173/posts`
- 개별 포스트: `http://localhost:5173/posts/my-new-post`

### 3. 개발 서버 실행

```bash
pnpm dev
```

## 📝 결론

TanStack Router와 MDX의 조합으로 다음과 같은 이점을 얻을 수 있습니다:

- **타입 안전성**: 컴파일 타임에 라우팅 오류 감지
- **개발자 경험**: 자동완성과 타입 체크로 향상된 DX
- **성능**: 코드 스플리팅과 lazy loading으로 최적화된 번들 크기
- **유연성**: MDX를 통한 풍부한 컨텐츠 표현
- **확장성**: 파일 기반 시스템으로 쉬운 컨텐츠 관리

이 구조는 블로그, 문서 사이트, 또는 컨텐츠 중심의 웹사이트 구축에 매우 적합합니다. 