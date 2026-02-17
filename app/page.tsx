'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/hooks/useAuth'
import { useBookmarks } from '@/hooks/useBookmarks'
import { Header } from '@/components/Header'
import { BookmarkForm } from '@/components/BookmarkForm'
import { BookmarkList } from '@/components/BookmarkList'

export default function Home() {
  const router = useRouter()
  const { user, loading, signOut } = useAuth()
  const { bookmarks, loading: bookmarksLoading, error, addBookmark, deleteBookmark } = useBookmarks(user?.id || null)
  const [isAddingBookmark, setIsAddingBookmark] = useState(false)
  const [deletingId, setDeletingId] = useState<string | null>(null)

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!loading && !user) {
      router.push('/login')
    }
  }, [user, loading, router])

  const handleAddBookmark = async (title: string, url: string) => {
    try {
      setIsAddingBookmark(true)
      await addBookmark(title, url)
    } finally {
      setIsAddingBookmark(false)
    }
  }

  const handleDeleteBookmark = async (id: string) => {
    try {
      setDeletingId(id)
      await deleteBookmark(id)
    } finally {
      setDeletingId(null)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return null // Will redirect in useEffect
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header user={user} onSignOut={signOut} />

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <BookmarkForm onAdd={handleAddBookmark} isLoading={isAddingBookmark} />

        <BookmarkList
          bookmarks={bookmarks}
          onDelete={handleDeleteBookmark}
          isLoading={bookmarksLoading}
          error={error}
        />
      </main>
    </div>
  )
}
