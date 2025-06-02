export interface PostFrontmatter {
  title: string
  description: string
  date: string
  updatedAt?: string
  published: boolean
  tags: string[]
}

export interface Post {
  slug: string
  frontmatter: PostFrontmatter
  content?: string
}

export interface TagInfo {
  name: string
  count: number
  posts: Post[]
} 