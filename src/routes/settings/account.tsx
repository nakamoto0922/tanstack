import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/settings/account')({
  component: AccountPage,
})

function AccountPage() {
  return (
    <div className="rounded border bg-white p-4">
      <div className="font-semibold">アカウント設定</div>
      <div className="text-sm text-gray-700 mt-1">ここにアカウント設定フォームなど。</div>
    </div>
  )
}

