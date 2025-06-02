# React + TypeScript + Vite

이 템플릿은 React, TypeScript, Vite 기반의 최신 프론트엔드 개발 환경을 제공합니다.

## Tech Stack

- **언어**: TypeScript, JavaScript
- **프레임워크**: React 19.1
- **빌드**: Vite
- **라우터**: Tanstack Router
- **상태관리**: Zustand
- **HTTP**: Axios, Tanstack Query
- **스타일**: PandaCSS, Framer Motion
- **런타임/컴파일 유효성**: TypeScript, Zod
- **포매터/린터**: prettier, eslint
- **테스트**: Vitest, Testing Library, MSW
- **문서화**: Storybook

---

## 기타

---

## 프로젝트 구조 (FSD 아키텍처)

```plaintext
src/
 |- app/route/           # tanstack-router 기반 라우팅
 |- entities/            # 데이터 단위 (model, api, schema)
 |- features/            # 기능 단위 (ui, api, schema)
 |- shared/              # 공통 컴포넌트, 설정, 타입, 함수 등
```
