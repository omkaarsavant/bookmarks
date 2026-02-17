'use client'

import { useEffect, useState, useCallback } from 'react'
import { createClient } from '@/lib/supabase'

export interface Bookmark {
  id: string
  user_id: string
  title: string
  url: string
  created_at: string
}

export const useBookmarks = (userId: string | null) => {
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const supabase = createClient()

  // Fetch bookmarks
  const fetchBookmarks = useCallback(async () => {
    if (!userId) {
      setLoading(false)
      return
    }

    try {
      setLoading(true)
      const { data, error: fetchError } = await supabase
        .from('bookmarks')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })

      if (fetchError) throw fetchError

      setBookmarks(data || [])
      setError(null)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error fetching bookmarks')
      console.error('Error fetching bookmarks:', err)
    } finally {
      setLoading(false)
    }
  }, [userId, supabase])

  // Subscribe to real-time updates
  useEffect(() => {
    if (!userId) return

    fetchBookmarks()

    // Subscribe to changes in bookmarks table
    const channel = supabase
      .channel('bookmarks-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'bookmarks',
          filter: `user_id=eq.${userId}`,
        },
        (payload) => {
          if (payload.eventType === 'INSERT') {
            setBookmarks((prev) => [payload.new as Bookmark, ...prev])
          } else if (payload.eventType === 'DELETE') {
            setBookmarks((prev) =>
              prev.filter((b) => b.id !== (payload.old as Bookmark).id)
            )
          } else if (payload.eventType === 'UPDATE') {
            setBookmarks((prev) =>
              prev.map((b) =>
                b.id === (payload.new as Bookmark).id
                  ? (payload.new as Bookmark)
                  : b
              )
            )
          }
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [userId, fetchBookmarks, supabase])

  const addBookmark = async (title: string, url: string) => {
    if (!userId) {
      setError('User not authenticated')
      return null
    }

    try {
      const { data, error: insertError } = await supabase
        .from('bookmarks')
        .insert({
          user_id: userId,
          title,
          url,
        })
        .select()
        .single()

      if (insertError) throw insertError

      return data
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : 'Error adding bookmark'
      setError(errorMessage)
      console.error('Error adding bookmark:', err)
      return null
    }
  }

  const deleteBookmark = async (id: string) => {
    try {
      const { error: deleteError } = await supabase
        .from('bookmarks')
        .delete()
        .eq('id', id)
        .eq('user_id', userId)

      if (deleteError) throw deleteError

      setBookmarks((prev) => prev.filter((b) => b.id !== id))
      setError(null)
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : 'Error deleting bookmark'
      setError(errorMessage)
      console.error('Error deleting bookmark:', err)
    }
  }

  return {
    bookmarks,
    loading,
    error,
    addBookmark,
    deleteBookmark,
  }
}
