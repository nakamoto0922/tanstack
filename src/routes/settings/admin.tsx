import { createFileRoute, redirect } from '@tanstack/react-router'
import { hasRole } from '@/lib/auth'

export const Route = createFileRoute('/settings/admin')({
  beforeLoad: ({ location }) => {
    if (!hasRole('admin')) {
      const back = `${location.pathname}${location.search ?? ''}${location.hash ?? ''}`
      throw redirect({ to: '/settings', search: { forbidden: '1', back }, replace: true })
    }
  },
  component: AdminPage,
})

function AdminPage() {
  return (
    <div className="rounded border bg-white p-4">
      <div className="font-semibold">管理者設定</div>
      <div className="text-sm text-gray-700 mt-1">このページは admin ロールのみアクセス可能です。</div>
    </div>
  )
}

