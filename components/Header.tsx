'use client'

import { User } from '@supabase/supabase-js'
import { useRouter } from 'next/navigation'

interface HeaderProps {
  user: User | null
  onSignOut: () => Promise<void>
  loading?: boolean
}

export const Header = ({ user, onSignOut, loading }: HeaderProps) => {
  const router = useRouter()

  const handleSignOut = async () => {
    try {
      await onSignOut()
      router.push('/login')
    } catch (error) {
      console.error('Error signing out:', error)
    }
  }

  return (
    <header className="bg-white border-b border-gray-200 shadow-sm">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">📌 Bookmarks</h1>
            {user?.email && (
              <p className="text-sm text-gray-600 mt-1">
                Logged in as {user.email}
              </p>
            )}
          </div>
          {user && (
            <button
              onClick={handleSignOut}
              disabled={loading}
              className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
            >
              Sign Out
            </button>
          )}
        </div>
      </div>
    </header>
  )
}
