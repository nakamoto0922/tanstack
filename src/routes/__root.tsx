import {
  Link,
  Outlet,
  ScrollRestoration,
  createRootRouteWithContext,
} from '@tanstack/react-router'
import { TanStackRouterDevtools } from '@tanstack/react-router-devtools'
import type { QueryClient } from '@tanstack/react-query'

type RouterContext = {
  queryClient: QueryClient
}

export const Route = createRootRouteWithContext<RouterContext>()({
  component: RootLayout,
  notFoundComponent: () => (
    <div className="p-6">
      <h1 className="text-2xl font-bold">404 - Not Found</h1>
      <p className="text-gray-600 mt-2">ページが見つかりませんでした。</p>
      <div className="mt-4">
        <Link to="/" className="text-blue-600 hover:underline">
          ホームに戻る
        </Link>
      </div>
    </div>
  ),
  errorComponent: ({ error }) => (
    <div className="p-6">
      <h1 className="text-2xl font-bold">エラーが発生しました</h1>
      <pre className="bg-red-50 text-red-700 p-4 rounded mt-2 whitespace-pre-wrap">
        {String(error)}
      </pre>
    </div>
  ),
})

function RootLayout() {
  const isAuthed = typeof window !== 'undefined' && !!localStorage.getItem('auth')

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
      <header className="sticky top-0 z-10 backdrop-blur bg-white/80 border-b">
        <div className="max-w-6xl mx-auto px-3 h-14 flex items-center justify-between">
          <nav className="flex items-center gap-4 text-sm">
            <Link to="/" className="font-semibold">
              TanStack Router Demo
            </Link>
            <Link to="/posts" preload="intent" className="hover:underline">
              Posts
            </Link>
            <Link to="/users" preload className="hover:underline">
              Users
            </Link>
            <Link to="/search" className="hover:underline">
              Search
            </Link>
            <Link to="/settings" className="hover:underline">
              Settings
            </Link>
            <Link to="/heavy" preload className="hover:underline">
              Heavy (lazy)
            </Link>
          </nav>
          <div className="text-sm flex items-center gap-3">
            {isAuthed ? (
              <button
                className="px-3 py-1 rounded bg-gray-900 text-white hover:bg-black"
                onClick={() => {
                  localStorage.removeItem('auth')
                  // force a navigation to update UI
                  window.location.href = '/'
                }}
              >
                Logout
              </button>
            ) : (
              <Link
                to="/login"
                className="px-3 py-1 rounded bg-blue-600 text-white hover:bg-blue-700"
              >
                Login
              </Link>
            )}
          </div>
        </div>
      </header>
      <main className="max-w-6xl mx-auto px-3 py-6">
        <Outlet />
      </main>
      <ScrollRestoration />
      <TanStackRouterDevtools position="bottom-right" />
    </div>
  )
}

