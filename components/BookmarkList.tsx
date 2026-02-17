'use client'

import { Bookmark } from '@/hooks/useBookmarks'
import { BookmarkCard } from './BookmarkCard'

interface BookmarkListProps {
  bookmarks: Bookmark[]
  onDelete: (id: string) => void
  isLoading?: boolean
  error?: string | null
}

export const BookmarkList = ({
  bookmarks,
  onDelete,
  isLoading,
  error,
}: BookmarkListProps) => {
  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
        {error}
      </div>
    )
  }

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[...Array(3)].map((_, i) => (
          <div
            key={i}
            className="bg-gray-100 border border-gray-200 rounded-lg p-4 animate-pulse h-24"
          />
        ))}
      </div>
    )
  }

  if (bookmarks.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500 text-lg">No bookmarks yet.</p>
        <p className="text-gray-400">Add your first bookmark above!</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold text-gray-900 mb-4">
        Your Bookmarks ({bookmarks.length})
      </h2>
      {bookmarks.map((bookmark) => (
        <BookmarkCard
          key={bookmark.id}
          bookmark={bookmark}
          onDelete={onDelete}
        />
      ))}
    </div>
  )
}
