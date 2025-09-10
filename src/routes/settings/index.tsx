import { Link, Outlet, createFileRoute, redirect } from '@tanstack/react-router'

export const Route = createFileRoute('/settings/')({
  beforeLoad: () => {
    const authed = typeof window !== 'undefined' && !!localStorage.getItem('auth')
    if (!authed) {
      throw redirect({ to: '/login', replace: true })
    }
  },
  component: SettingsLayout,
})

function SettingsLayout() {
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
      </nav>
      <Outlet />
    </div>
  )
}

