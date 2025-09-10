import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/settings/profile')({
  component: ProfilePage,
})

function ProfilePage() {
  return (
    <div className="rounded border bg-white p-4">
      <div className="font-semibold">プロフィール設定</div>
      <div className="text-sm text-gray-700 mt-1">ここにプロフィール編集フォームなど。</div>
    </div>
  )
}

