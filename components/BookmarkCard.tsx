'use client'

import { Bookmark } from '@/hooks/useBookmarks'

interface BookmarkCardProps {
  bookmark: Bookmark
  onDelete: (id: string) => void
  isDeleting?: boolean
}

export const BookmarkCard = ({
  bookmark,
  onDelete,
  isDeleting,
}: BookmarkCardProps) => {
  const handleDelete = () => {
    onDelete(bookmark.id)
  }

  return (
    <div className="bg-white border border-gray-200 rounded-lg shadow-md p-4 hover:shadow-lg transition-shadow">
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 min-w-0">
          <h3 className="text-lg font-semibold text-gray-900 truncate">
            {bookmark.title}
          </h3>
          <a
            href={bookmark.url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 hover:text-blue-800 text-sm truncate block mt-1"
          >
            {bookmark.url}
          </a>
          <p className="text-xs text-gray-500 mt-2">
            {new Date(bookmark.created_at).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'short',
              day: 'numeric',
              hour: '2-digit',
              minute: '2-digit',
            })}
          </p>
        </div>
        <button
          onClick={handleDelete}
          disabled={isDeleting}
          className="flex-shrink-0 px-3 py-1 bg-red-100 text-red-700 rounded hover:bg-red-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm font-medium"
        >
          {isDeleting ? 'Deleting...' : 'Delete'}
        </button>
      </div>
    </div>
  )
}
