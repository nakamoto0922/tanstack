import { createFileRoute, Link, redirect } from '@tanstack/react-router'

export const Route = createFileRoute('/login')({
  component: LoginPage,
})

function LoginPage() {
  return (
    <div className="max-w-md space-y-4">
      <h2 className="text-2xl font-bold">ログイン</h2>
      <p className="text-gray-600 text-sm">デモのため任意の値でログインできます。</p>
      <form
        className="space-y-3"
        onSubmit={(e) => {
          e.preventDefault()
          localStorage.setItem('auth', '1')
          // redirect to settings after login
          window.location.href = '/settings'
        }}
      >
        <div>
          <label className="block text-sm">Email</label>
          <input className="border rounded px-2 py-1 w-full" />
        </div>
        <div>
          <label className="block text-sm">Password</label>
          <input type="password" className="border rounded px-2 py-1 w-full" />
        </div>
        <button className="px-3 py-1 rounded bg-blue-600 text-white">Login</button>
      </form>
      <div className="text-sm">
        <Link to="/" className="text-blue-700 hover:underline">
          ホームへ戻る
        </Link>
      </div>
    </div>
  )
}

