import { Link, Outlet, createFileRoute, redirect } from '@tanstack/react-router'
import { z } from 'zod'
import { isAuthed } from '@/lib/auth'

const searchSchema = z.object({
  forbidden: z.string().optional().catch(undefined),
  back: z.string().optional().catch(undefined),
})

export const Route = createFileRoute('/settings/')({
  validateSearch: (s: Record<string, unknown>) => searchSchema.parse(s),
  beforeLoad: ({ location }) => {
    if (!isAuthed()) {
      const redirectTo = `${location.pathname}${location.search ?? ''}${location.hash ?? ''}`
      throw redirect({ to: '/login', search: { redirect: redirectTo }, replace: true })
    }
  },
  component: SettingsLayout,
})

function SettingsLayout() {
  const { forbidden, back } = Route.useSearch()
  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">Settings</h2>
      <nav className="flex gap-3 text-sm">
        <Link to="/settings/profile" className="hover:underline">
          Profile
        </Link>
        <Link to="/settings/account" className="hover:underline">
          Account
        </Link>
        <Link to="/settings/admin" className="hover:underline">
          Admin
        </Link>
      </nav>
      {forbidden ? (
        <div className="text-sm text-orange-700 bg-orange-50 border border-orange-200 rounded p-2">
          権限がありません。
          {back ? (
            <>
              {' '}
              <Link to={back} className="underline">
                前のページに戻る
              </Link>
            </>
          ) : null}
        </div>
      ) : null}
      <Outlet />
    </div>
  )
}
