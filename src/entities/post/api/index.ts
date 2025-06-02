import type { Post, TagInfo } from '../types'

// 모든 포스트를 가져오는 함수
export async function getAllPosts(): Promise<Post[]> {
  // 실제 구현에서는 MDX 파일들을 동적으로 import하여 frontmatter를 추출
  const postModules = import.meta.glob('/src/content/posts/*.mdx', { eager: true })

  const posts: Post[] = []

  for (const [path, module] of Object.entries(postModules)) {
    const slug = path.split('/').pop()?.replace('.mdx', '') || ''
    const frontmatter = (module as any).frontmatter

    if (frontmatter?.published) {
      posts.push({
        slug,
        frontmatter,
      })
    }
  }

  return posts.sort((a, b) =>
    new Date(b.frontmatter.date).getTime() - new Date(a.frontmatter.date).getTime()
  )
}

// 모든 태그 정보를 가져오는 함수
export async function getAllTags(): Promise<TagInfo[]> {
  const posts = await getAllPosts()
  const tagMap = new Map<string, Post[]>()

  // 모든 포스트의 태그를 수집
  posts.forEach(post => {
    post.frontmatter.tags.forEach(tag => {
      if (!tagMap.has(tag)) {
        tagMap.set(tag, [])
      }
      tagMap.get(tag)!.push(post)
    })
  })

  // TagInfo 배열로 변환하고 알파벳 순으로 정렬
  return Array.from(tagMap.entries())
    .map(([name, posts]) => ({
      name,
      count: posts.length,
      posts: posts.sort((a, b) =>
        new Date(b.frontmatter.date).getTime() - new Date(a.frontmatter.date).getTime()
      ),
    }))
    .sort((a, b) => a.name.localeCompare(b.name))
}

// 특정 태그의 포스트들을 가져오는 함수
export async function getPostsByTag(tagName: string): Promise<Post[]> {
  const posts = await getAllPosts()

  return posts.filter(post =>
    post.frontmatter.tags.includes(tagName)
  )
} 