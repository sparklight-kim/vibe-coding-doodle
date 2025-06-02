import React from 'react'

interface TagBadgeListProps {
  tags: string[]
  selected: string[]
  onToggle: (tag: string) => void
  counts: Record<string, number>
}

export function TagBadgeList({ tags, selected, onToggle, counts }: TagBadgeListProps) {
  return (
    <div className="flex flex-wrap gap-2 mb-6">
      {tags.map((tag) => {
        const isActive = selected.includes(tag)
        return (
          <button
            key={tag}
            type="button"
            className={`px-3 py-1 rounded-full border text-sm font-medium transition-colors
              ${isActive ? 'bg-blue-600 text-white border-blue-600' : 'bg-gray-100 text-gray-700 border-gray-200 hover:bg-blue-100 hover:text-blue-700'}`}
            onClick={() => onToggle(tag)}
            data-testid="tag-badge"
            aria-pressed={isActive}
          >
            {tag} <span className="ml-1 text-xs text-gray-500">({counts[tag] ?? 0})</span>
          </button>
        )
      })}
    </div>
  )
} 