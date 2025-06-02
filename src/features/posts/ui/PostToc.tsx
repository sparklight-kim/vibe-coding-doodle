import type { TocItem } from '../../../shared/utils/mdx'

interface PostTocProps {
  toc: TocItem[]
}

export function PostToc({ toc }: PostTocProps) {
  if (!toc.length) return null
  return (
    <nav className="hidden md:block fixed top-32 right-8 w-64 max-h-[70vh] overflow-y-auto bg-white/80 dark:bg-gray-900/80 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg p-4 z-20">
      <h2 className="text-lg font-bold mb-3 text-gray-700 dark:text-gray-200">목차</h2>
      <ul className="space-y-2">
        {toc.map(item => (
          <li key={item.id} className={item.depth === 2 ? 'ml-0' : item.depth === 3 ? 'ml-4' : 'ml-8'}>
            <a
              href={`#${item.id}`}
              className="flex items-center gap-1 text-sm text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400"
            >
              <span className="font-mono select-none">
                {item.depth === 2 ? '#' : item.depth === 3 ? '##' : '###'}
              </span>
              <span>{item.text}</span>
            </a>
          </li>
        ))}
      </ul>
    </nav>
  )
} 