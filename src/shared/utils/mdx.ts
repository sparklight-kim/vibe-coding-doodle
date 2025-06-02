import remarkGfm from 'remark-gfm'
import remarkParse from 'remark-parse'
import { unified } from 'unified'
import { visit } from 'unist-util-visit'
import { z } from 'zod'

// Zod 스키마 정의
export const PostFrontmatterSchema = z.object({
  title: z.string().min(1, '제목은 필수입니다'),
  description: z.string().optional(),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, '날짜는 YYYY-MM-DD 형식이어야 합니다'),
  updatedAt: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, '수정일은 YYYY-MM-DD 형식이어야 합니다').optional(),
  published: z.boolean().default(true),
  tags: z.array(z.string()).default([]),
})

export const PostDataSchema = z.object({
  slug: z.string().min(1),
  frontmatter: PostFrontmatterSchema,
  content: z.string(),
})

// TypeScript 타입 추론
export type PostFrontmatter = z.infer<typeof PostFrontmatterSchema>
export type PostData = z.infer<typeof PostDataSchema>

// 검증 결과 타입
export type ParseResult<T> =
  | { success: true; data: T }
  | { success: false; error: string; data?: Partial<T> }

// 브라우저 친화적인 frontmatter 파싱 함수
function parseFrontmatter(content: string): { data: Record<string, any>; content: string } {
  const frontmatterRegex = /^---\s*\n([\s\S]*?)\n---\s*\n([\s\S]*)$/
  const match = content.match(frontmatterRegex)

  if (!match) {
    return { data: {}, content }
  }

  const [, frontmatterStr, mdxContent] = match
  const data: Record<string, any> = {}

  // 간단한 YAML 파싱 (기본적인 key: value 형태만 지원)
  const lines = frontmatterStr.split('\n')

  for (const line of lines) {
    const trimmedLine = line.trim()
    if (!trimmedLine || trimmedLine.startsWith('#')) continue

    const colonIndex = trimmedLine.indexOf(':')
    if (colonIndex === -1) continue

    const key = trimmedLine.slice(0, colonIndex).trim()
    let valueStr = trimmedLine.slice(colonIndex + 1).trim()
    let value: any

    // 값 타입 변환
    if (valueStr.startsWith('"') && valueStr.endsWith('"')) {
      // 문자열
      value = valueStr.slice(1, -1)
    } else if (valueStr.startsWith('[') && valueStr.endsWith(']')) {
      // 배열
      try {
        value = JSON.parse(valueStr)
      } catch {
        value = valueStr.slice(1, -1).split(',').map(item => item.trim().replace(/"/g, ''))
      }
    } else if (valueStr === 'true') {
      value = true
    } else if (valueStr === 'false') {
      value = false
    } else if (!isNaN(Number(valueStr))) {
      value = Number(valueStr)
    } else {
      value = valueStr
    }

    data[key] = value
  }

  return { data, content: mdxContent }
}

export function parseMDXContent(content: string): ParseResult<{ frontmatter: PostFrontmatter; content: string }> {
  try {
    const { data, content: mdxContent } = parseFrontmatter(content)

    // Zod로 frontmatter 검증
    const validationResult = PostFrontmatterSchema.safeParse({
      title: data.title,
      description: data.description,
      date: data.date || new Date().toISOString().split('T')[0],
      updatedAt: data.updatedAt,
      published: data.published !== false, // 기본값은 true
      tags: data.tags || [],
    })

    if (!validationResult.success) {
      const errorMessages = validationResult.error.errors
        .map(err => `${err.path.join('.')}: ${err.message}`)
        .join(', ')

      return {
        success: false,
        error: `Frontmatter 검증 실패: ${errorMessages}`,
        data: {
          frontmatter: {
            title: data.title || 'Untitled',
            description: data.description,
            date: data.date || new Date().toISOString().split('T')[0],
            updatedAt: data.updatedAt,
            published: data.published !== false,
            tags: data.tags || [],
          } as PostFrontmatter,
          content: mdxContent,
        }
      }
    }

    return {
      success: true,
      data: {
        frontmatter: validationResult.data,
        content: mdxContent,
      }
    }
  } catch (error) {
    return {
      success: false,
      error: `MDX 파싱 실패: ${error instanceof Error ? error.message : '알 수 없는 오류'}`,
    }
  }
}

export function validatePostData(data: unknown): ParseResult<PostData> {
  const validationResult = PostDataSchema.safeParse(data)

  if (!validationResult.success) {
    const errorMessages = validationResult.error.errors
      .map(err => `${err.path.join('.')}: ${err.message}`)
      .join(', ')

    return {
      success: false,
      error: `포스트 데이터 검증 실패: ${errorMessages}`,
    }
  }

  return {
    success: true,
    data: validationResult.data,
  }
}

export function getPostSlugFromPath(path: string): string {
  return path.split('/').pop()?.replace('.mdx', '') || ''
}

// 유틸리티 함수: 안전한 날짜 파싱
export function parseDate(dateString: string): Date | null {
  try {
    const date = new Date(dateString)
    return isNaN(date.getTime()) ? null : date
  } catch {
    return null
  }
}

// 유틸리티 함수: 날짜 포맷팅
export function formatDate(date: string | Date, locale: string = 'ko-KR'): string {
  try {
    const dateObj = typeof date === 'string' ? new Date(date) : date
    return dateObj.toLocaleDateString(locale, {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })
  } catch {
    return typeof date === 'string' ? date : date.toISOString().split('T')[0]
  }
}

export interface TocItem {
  id: string
  text: string
  depth: number
}

export function extractTocFromMdx(mdxContent: string): TocItem[] {
  const tree = unified().use(remarkParse).use(remarkGfm).parse(mdxContent)
  const toc: TocItem[] = []
  visit(tree, 'heading', (node: any) => {
    if (node.depth < 2 || node.depth > 3) return
    const text = node.children.map((c: any) => c.value || '').join('')
    const id = text
      .toLowerCase()
      .replace(/[^a-z0-9가-힣\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
    toc.push({ id, text, depth: node.depth })
  })
  return toc
} 