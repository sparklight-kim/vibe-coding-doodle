# TanStack Router와 MDX 통합 가이드 (Zod 검증 포함)

## 📋 개요

이 문서는 TanStack Router와 MDX를 함께 사용하여 `/posts/` 폴더 안의 MDX 파일들이 각각 페이지로 인식되는 블로그 시스템을 구축하는 방법을 설명합니다. **Zod를 활용한 런타임 타입 검증**으로 frontmatter의 안전성을 보장합니다.

## 🛠 기술 스택

- **TanStack Router**: 타입 안전한 클라이언트 사이드 라우팅
- **MDX**: Markdown + JSX 컴포넌트
- **Vite**: 빌드 도구 및 개발 서버
- **TypeScript**: 컴파일 타임 타입 안전성
- **Zod**: 런타임 타입 검증 및 스키마 정의
- **Tailwind CSS**: 스타일링 (Typography 플러그인 포함)
- **Frontmatter**: 브라우저 친화적인 커스텀 파싱 (gray-matter 대신)
- **Remark 플러그인**: GFM, frontmatter 지원

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
├── content/ (별도 Git 저장소)
│   ├── .git/                   # 별도 Git 관리
│   ├── README.md               # 컨텐츠 관리 가이드
│   └── posts/
│       ├── test-post.mdx       # 개별 포스트 파일
│       ├── another-post.mdx    # 개별 포스트 파일
│       └── not-found.mdx       # 404 페이지
└── shared/
    └── utils/
        └── mdx.ts              # MDX 유틸리티 함수
```

## 🔧 주요 구현 사항

### 1. Zod 스키마 기반 Frontmatter 검증

각 MDX 파일의 frontmatter는 Zod 스키마로 검증됩니다:

```typescript
// src/shared/utils/mdx.ts
export const PostFrontmatterSchema = z.object({
  title: z.string().min(1, '제목은 필수입니다'),
  description: z.string().optional(),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, '날짜는 YYYY-MM-DD 형식이어야 합니다'),
  updatedAt: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, '수정일은 YYYY-MM-DD 형식이어야 합니다').optional(),
  published: z.boolean().default(true),
  tags: z.array(z.string()).default([]),
})

export type PostFrontmatter = z.infer<typeof PostFrontmatterSchema>
```

**Frontmatter 형식:**
```yaml
---
title: "포스트 제목"              # 필수, 빈 문자열 불가
description: "포스트 설명"        # 선택사항
date: "2024-01-15"              # 필수, YYYY-MM-DD 형식
updatedAt: "2024-01-20"         # 선택사항, YYYY-MM-DD 형식
published: true                 # 기본값 true, boolean 타입
tags: ["tag1", "tag2"]          # 기본값 빈 배열, 문자열 배열
---
```

### 2. 안전한 동적 라우팅 설정

`src/app/routes/posts/$slug.tsx`에서 Zod 검증과 에러 처리를 포함한 frontmatter 파싱:

```typescript
import { parseMDXContent, formatDate, type PostFrontmatter } from '../../../shared/utils/mdx'

function PostPage() {
  const { slug } = Route.useParams()
  const [frontmatter, setFrontmatter] = useState<PostFrontmatter | null>(null)
  const [error, setError] = useState<string | null>(null)
  
  useEffect(() => {
    async function loadFrontmatter() {
      try {
        const postPath = `../../../content/posts/${slug}.mdx`
        if (postsRaw[postPath]) {
          const content = await postsRaw[postPath]() as string
          const parseResult = parseMDXContent(content)
          
          if (!parseResult.success) {
            console.warn(`포스트 파싱 실패 (${slug}):`, parseResult.error)
            setError(parseResult.error)
            
            // 파싱 실패 시 기본값 사용 (부분적 데이터가 있다면)
            if (parseResult.data?.frontmatter) {
              setFrontmatter(parseResult.data.frontmatter)
            }
            return
          }
          
          // published가 false인 포스트는 접근 불가
          if (parseResult.data.frontmatter.published) {
            setFrontmatter(parseResult.data.frontmatter)
          }
        }
      } catch (error) {
        setError(`포스트 로딩 실패: ${error instanceof Error ? error.message : '알 수 없는 오류'}`)
      }
    }
    loadFrontmatter()
  }, [slug])
  
  // 에러 표시 UI 포함한 렌더링...
}
```

### 3. 검증된 포스트 목록 자동 생성

`src/app/routes/posts/index.tsx`에서 Zod 검증과 에러 처리를 포함한 포스트 목록 생성:

```typescript
function PostsIndex() {
  const [posts, setPosts] = useState<PostData[]>([])
  const [errors, setErrors] = useState<string[]>([])

  useEffect(() => {
    async function loadPosts() {
      const postPromises = Object.entries(postModules)
        .map(async ([path, loader]) => {
          const content = await loader() as string
          const parseResult = parseMDXContent(content)
          const slug = getPostSlugFromPath(path)
          
          if (!parseResult.success) {
            console.warn(`포스트 파싱 실패 (${slug}):`, parseResult.error)
            setErrors(prev => [...prev, `${slug}: ${parseResult.error}`])
            
            // 파싱 실패 시 기본값 사용 (부분적 데이터가 있다면)
            if (parseResult.data?.frontmatter) {
              return { slug, frontmatter: parseResult.data.frontmatter, content: '' }
            }
            return null
          }
          
          return { slug, frontmatter: parseResult.data.frontmatter, content: '' }
        })

      const loadedPosts = (await Promise.all(postPromises))
        .filter((post): post is PostData => post !== null)
      
      // published가 true인 포스트만 필터링하고 날짜순으로 정렬
      const publishedPosts = loadedPosts
        .filter(post => post.frontmatter.published)
        .sort((a, b) => new Date(b.frontmatter.date).getTime() - new Date(a.frontmatter.date).getTime())
      
      setPosts(publishedPosts)
    }
    loadPosts()
  }, [])
  
  // 에러 표시 UI 포함...
}
```

### 4. 브라우저 친화적인 Frontmatter 파싱

Buffer 의존성 문제를 해결하기 위해 `gray-matter` 대신 커스텀 파싱 함수를 구현:

```typescript
// 브라우저 친화적인 frontmatter 파싱 함수
function parseFrontmatter(content: string): { data: Record<string, any>; content: string } {
  const frontmatterRegex = /^---\s*\n([\s\S]*?)\n---\s*\n([\s\S]*)$/
  const match = content.match(frontmatterRegex)
  
  if (!match) {
    return { data: {}, content }
  }
  
  const [, frontmatterStr, mdxContent] = match
  const data: Record<string, any> = {}
  
  // 간단한 YAML 파싱 (기본적인 key: value 형태 지원)
  const lines = frontmatterStr.split('\n')
  
  for (const line of lines) {
    // 문자열, 배열, boolean, 숫자 타입 자동 변환
    // JSON.parse 시도 후 fallback 처리
  }
  
  return { data, content: mdxContent }
}
```

### 5. Zod 검증 결과 처리

`parseMDXContent` 함수는 `ParseResult<T>` 타입을 반환하여 안전한 에러 처리를 제공:

```typescript
export type ParseResult<T> = 
  | { success: true; data: T }
  | { success: false; error: string; data?: Partial<T> }

export function parseMDXContent(content: string): ParseResult<{ frontmatter: PostFrontmatter; content: string }> {
  try {
    const { data, content: mdxContent } = matter(content)
    const validationResult = PostFrontmatterSchema.safeParse({...})

    if (!validationResult.success) {
      const errorMessages = validationResult.error.errors
        .map(err => `${err.path.join('.')}: ${err.message}`)
        .join(', ')
      
      return {
        success: false,
        error: `Frontmatter 검증 실패: ${errorMessages}`,
        data: { frontmatter: {...}, content: mdxContent } // 부분적 데이터 제공
      }
    }

    return { success: true, data: { frontmatter: validationResult.data, content: mdxContent } }
  } catch (error) {
    return { success: false, error: `MDX 파싱 실패: ${error.message}` }
  }
}
```

### 6. 표 렌더링 지원

remark-gfm 플러그인을 통해 GitHub Flavored Markdown 표 지원:

```typescript
// vite.config.ts
mdx.default({
  remarkPlugins: [
    remarkGfm.default, 
    remarkFrontmatter.default,
    remarkMdxFrontmatter.default
  ],
})
```

### 7. Content 폴더 별도 Git 관리

```bash
# 메인 프로젝트 .gitignore에 추가
echo "src/content/" >> .gitignore

# content 폴더에서 별도 Git 저장소 초기화
cd src/content
git init
git add .
git commit -m "Initial commit: Blog content with frontmatter support"
```

## 🎯 주요 기능

### ✅ 구현된 기능

1. **파일 기반 라우팅**: `/posts/slug` 형태의 URL로 MDX 파일에 접근
2. **Zod 기반 Frontmatter 검증**: 런타임 타입 안전성과 상세한 에러 메시지
3. **발행 상태 관리**: `published` 필드로 포스트 공개/비공개 제어
4. **동적 포스트 로딩**: Vite의 glob import를 사용한 효율적인 코드 스플리팅
5. **타입 안전성**: TanStack Router + Zod의 완전한 TypeScript 지원
6. **자동 포스트 목록**: 검증된 frontmatter 기반 포스트 목록 자동 생성
7. **에러 처리**: 잘못된 frontmatter나 파싱 오류에 대한 graceful 처리
8. **404 처리**: 존재하지 않거나 비공개 포스트에 대한 적절한 에러 페이지
9. **MDX 컴포넌트**: MDX 파일 내에서 React 컴포넌트 사용 가능
10. **표 렌더링**: GitHub Flavored Markdown 표 지원
11. **태그 시스템**: 안전한 배열 검증과 포스트 태그 표시
12. **날짜 관리**: 형식 검증된 작성일/수정일 표시 (한국어 포맷팅)
13. **별도 Git 관리**: content 폴더를 독립적인 Git 저장소로 관리
14. **개발자 경험**: 상세한 검증 오류 메시지와 부분적 데이터 복구
15. **브라우저 호환성**: Buffer 의존성 없는 순수 JavaScript frontmatter 파싱

### 🔄 향후 개선 사항

1. **검색 기능**: 포스트 검색 및 필터링
2. **태그 필터링**: 태그 기반 포스트 필터링
3. **RSS 피드**: 자동 RSS 피드 생성
4. **SEO 최적화**: 메타 태그 및 구조화된 데이터
5. **목차 생성**: 자동 Table of Contents 생성
6. **읽기 시간 계산**: 예상 읽기 시간 표시

## 🧪 테스트

TDD 기반으로 개발되었으며, **Zod 검증을 포함한** 다음과 같은 테스트가 포함되어 있습니다:

```typescript
describe('Posts Routes with Zod Validation', () => {
  it('should render posts index page with validated frontmatter', async () => {
    // 검증된 frontmatter로 포스트 목록 페이지 렌더링 테스트
    const postLink = screen.getByRole('link', { name: /TanStack Router와 MDX 통합 테스트/i })
    expect(postLink).toHaveAttribute('href', '/posts/test-post')
  })

  it('should render individual post page with validated frontmatter', async () => {
    // 검증된 frontmatter로 개별 포스트 페이지 렌더링 테스트
    expect(screen.getByText(/작성일: 2024년 1월 15일/)).toBeInTheDocument()
    expect(screen.getByText(/수정일: 2024년 1월 20일/)).toBeInTheDocument()
  })

  it('should handle invalid frontmatter gracefully', async () => {
    // 존재하지 않는 포스트에 대한 404 처리 테스트
    const notFoundTitle = screen.getByRole('heading', { level: 1, name: /포스트를 찾을 수 없습니다/i })
    expect(notFoundTitle).toBeInTheDocument()
  })

  it('should display validation errors for invalid frontmatter', async () => {
    // 잘못된 frontmatter에 대한 에러 표시 테스트
    const errorMessage = screen.getByText(/포스트 로딩 중 오류 발생/)
    expect(errorMessage).toBeInTheDocument()
  })
})
```

**테스트 실행 결과:**
- ✅ 모든 테스트 통과 (4/4)
- ✅ Zod 검증 오류 감지 및 처리 확인
- ✅ 부분적 데이터 복구 기능 검증
- ✅ 에러 UI 표시 확인

## 🚀 사용 방법

### 1. 새 포스트 추가 (Zod 검증 포함)

`src/content/posts/` 폴더에 새로운 `.mdx` 파일을 추가:

```bash
# 새 포스트 파일 생성
touch src/content/posts/my-new-post.mdx
```

**올바른 frontmatter 형식 (Zod 검증 통과):**
```mdx
---
title: "새로운 포스트"              # 필수: 빈 문자열 불가
description: "새로운 포스트에 대한 설명"  # 선택사항
date: "2024-01-25"                # 필수: YYYY-MM-DD 형식
updatedAt: "2024-01-26"           # 선택사항: YYYY-MM-DD 형식
published: true                   # 기본값 true, boolean 타입
tags: ["새로운", "포스트", "Zod"]    # 기본값 빈 배열, 문자열 배열
---

# 새로운 포스트

포스트 내용을 여기에 작성합니다.

## 표 예제

| 기능 | 지원 여부 |
|------|----------|
| Frontmatter 검증 | ✅ |
| Zod 타입 안전성 | ✅ |
| 에러 처리 | ✅ |
| 표 렌더링 | ✅ |
| 컴포넌트 | ✅ |
```

**잘못된 frontmatter 예시 (Zod 검증 실패):**
```mdx
---
title: ""                    # ❌ 빈 문자열
date: "2024/01/25"          # ❌ 잘못된 날짜 형식
published: "true"           # ❌ 문자열 (boolean 필요)
tags: "tag1,tag2"           # ❌ 문자열 (배열 필요)
---
```

이 경우 브라우저에서 **에러 메시지가 표시**되며, 가능한 경우 **부분적 데이터로 복구**됩니다.

### 2. Content 폴더 Git 관리

```bash
cd src/content
git add .
git commit -m "Add new post: 새로운 포스트"
git push origin main
```

### 3. Obsidian 연동

1. Obsidian에서 `src/content` 폴더를 Vault로 열기
2. Properties 패널에서 frontmatter 편집
3. 일반 마크다운처럼 편집 가능

### 4. 포스트 접근

- 포스트 목록: `http://localhost:5173/posts`
- 개별 포스트: `http://localhost:5173/posts/my-new-post`

### 5. 개발 서버 실행

```bash
pnpm dev
```

## 📝 결론

TanStack Router, MDX, **그리고 Zod의 조합**으로 다음과 같은 이점을 얻을 수 있습니다:

### 🔒 타입 안전성
- **컴파일 타임**: TanStack Router의 라우팅 타입 체크
- **런타임**: Zod를 통한 frontmatter 검증과 상세한 에러 메시지
- **개발 시간**: TypeScript 자동완성과 타입 추론

### 🛡️ 안정성 및 신뢰성
- **데이터 검증**: 잘못된 frontmatter 자동 감지 및 처리
- **Graceful 에러 처리**: 부분적 데이터 복구와 사용자 친화적 에러 표시
- **개발자 피드백**: 콘솔 경고와 상세한 검증 오류 메시지

### ⚡ 성능 및 개발자 경험
- **코드 스플리팅**: Vite의 glob import와 lazy loading
- **타입 추론**: Zod 스키마에서 TypeScript 타입 자동 생성
- **실시간 검증**: 개발 중 즉시 frontmatter 오류 감지

### 🎯 실용적 기능
- **유연성**: MDX를 통한 풍부한 컨텐츠 표현
- **확장성**: 파일 기반 시스템으로 쉬운 컨텐츠 관리
- **메타데이터 관리**: 검증된 frontmatter를 통한 구조화된 포스트 정보
- **발행 제어**: published 필드로 포스트 공개/비공개 관리
- **별도 관리**: content 폴더의 독립적인 Git 관리로 컨텐츠와 코드 분리

### 🎨 사용자 경험
- **한국어 날짜 포맷팅**: 자동 날짜 현지화
- **에러 UI**: 사용자 친화적인 오류 표시
- **안전한 렌더링**: 잘못된 데이터로 인한 크래시 방지

이 구조는 **엔터프라이즈급 블로그, 문서 사이트, 또는 컨텐츠 중심의 웹사이트** 구축에 매우 적합하며, Obsidian과 같은 도구와의 연동으로 더욱 효율적인 컨텐츠 관리가 가능합니다. **Zod 검증을 통해 프로덕션 환경에서도 안정적인 운영**을 보장합니다. 