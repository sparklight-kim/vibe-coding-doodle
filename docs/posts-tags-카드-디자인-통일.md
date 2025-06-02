# posts/tags 페이지 카드 디자인 통일 및 공통 PostList 컴포넌트 적용 (최신)

## 개요

- posts 페이지와 tags 페이지의 포스트 카드 디자인을 완전히 동일하게 통일
- features/posts/ui/PostList.tsx의 공통 컴포넌트를 사용하여 유지보수성과 일관성 강화
- 디자인 변경 시 한 곳만 수정하면 두 페이지 모두 반영됨
- 헤더는 상단 고정(sticky) + 반응형 좌우 여백
- 다크 모드 지원 (헤더 우측 토글, 시스템 모드 기본, localStorage 유지)
- 태그 뱃지 옆에 해당 포스트 개수 표시
- 페이지네이션(10개씩, << < 1 2 3 4 5 > >>, 입력창)

## 적용 방법

### 1. 공통 PostList 컴포넌트 작성
- 위치: `src/features/posts/ui/PostList.tsx`
- 카드 레이아웃, 태그 뱃지, hover 효과, 날짜, 설명 등 모든 스타일을 통일
- 태그 뱃지도 동일한 스타일(`bg-gray-100 text-gray-600 px-2 py-1 text-xs rounded-full`)

### 2. 헤더 상단 고정 및 반응형 여백
- `src/app/routes/__root.tsx`에서 nav에 `sticky top-0 z-30 bg-white/90 dark:bg-gray-900/90 container mx-auto px-4 md:px-8` 적용

### 3. 다크 모드 지원
- `src/shared/components/ui/DarkModeToggle.tsx`에서 lucide-react 아이콘 토글
- 시스템 모드 기본, localStorage 유지

### 4. 태그 뱃지 옆 개수 표시
- `TagBadgeList`에서 `{tag} ({count})` 형태로 표시

### 5. 페이지네이션
- posts/tags 페이지 모두 10개씩, 하단에 페이지네이션 UI
- << < 1 2 3 4 5 > >>, 입력창, 날짜 내림차순 정렬

## 코드 예시

```tsx
// posts 페이지
import { PostList } from '../../features/posts/ui/PostList'
...
<PostList posts={posts} />
// 하단에 페이지네이션 UI

// tags 페이지
import { PostList } from '../../features/tags/ui/PostList'
...
<PostList posts={filteredPosts} />
// 하단에 페이지네이션 UI
```

## 효과
- 디자인 일관성: 두 페이지의 카드 UI가 완전히 동일
- 유지보수성: 한 곳만 수정하면 전체 반영
- 타입 안전성: 타입 불일치 및 undefined 문제 해결
- UX 향상: 다크모드, 반응형, 페이지네이션, 태그별 개수 등 최신 블로그 UX 반영

## 참고
- 실제 카드 디자인은 features/posts/ui/PostList.tsx에서 관리
- 추가 디자인/기능 변경 시 해당 파일만 수정
- 다크모드, 페이지네이션, 태그 개수 등은 각 컴포넌트/라우트에서 관리 