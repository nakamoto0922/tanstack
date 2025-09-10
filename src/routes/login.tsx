import { createFileRoute, Link, useNavigate } from '@tanstack/react-router'
import { z } from 'zod'
import { login } from '@/lib/auth'

const searchSchema = z.object({
  redirect: z
    .string()
    .optional()
    .transform((v) => (v && v.startsWith('/') ? v : undefined))
    .catch(undefined),
})

export const Route = createFileRoute('/login')({
  validateSearch: (s: Record<string, unknown>) => searchSchema.parse(s),
  component: LoginPage,
})

function LoginPage() {
  const { redirect } = Route.useSearch()
  const navigate = useNavigate()
  let next = redirect ?? '/settings'
  return (
    <div className="max-w-md space-y-4">
      <h2 className="text-2xl font-bold">ログイン</h2>
      <p className="text-gray-600 text-sm">デモのため任意の値でログインできます。</p>
      <form
        className="space-y-3"
        onSubmit={(e) => {
          e.preventDefault()
          const form = e.currentTarget as HTMLFormElement
          const email = (form.elements.namedItem('email') as HTMLInputElement)?.value || 'demo@example.com'
          const isAdmin = (form.elements.namedItem('admin') as HTMLInputElement)?.checked
          login({ id: email, roles: isAdmin ? ['admin'] : [] })
          navigate({ to: next, replace: true })
        }}
      >
        <div>
          <label className="block text-sm">Email</label>
          <input name="email" className="border rounded px-2 py-1 w-full" />
        </div>
        <div>
          <label className="block text-sm">Password</label>
          <input type="password" className="border rounded px-2 py-1 w-full" />
        </div>
        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" name="admin" />
          Admin ロールでログイン
        </label>
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
