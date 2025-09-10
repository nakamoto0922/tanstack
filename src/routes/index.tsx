import { createFileRoute, Link } from '@tanstack/react-router'

export const Route = createFileRoute('/')({
  component: HomePage,
})

function Card(props: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded border bg-white p-4 shadow-sm">
      <h3 className="font-semibold mb-2">{props.title}</h3>
      <div className="text-sm text-gray-700">{props.children}</div>
    </div>
  )
}

function HomePage() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">TanStack Router 機能デモ</h1>
      <p className="text-gray-700">
        実務でよく使うパターンを中心に、ファイルベースルーティングで構築したデモアプリです。
      </p>

      <div className="grid md:grid-cols-2 gap-4">
        <Card title="データ取得 (loader / React Query)">
          <ul className="list-disc pl-5">
            <li>
              <Link to="/posts" className="text-blue-600 hover:underline">
                Posts 一覧 (loader, search params)
              </Link>
            </li>
            <li>
              <Link to="/users" className="text-blue-600 hover:underline">
                Users 一覧 (React Query)
              </Link>
            </li>
          </ul>
        </Card>
        <Card title="検索クエリ / validateSearch">
          <Link to="/search" className="text-blue-600 hover:underline">
            /search でクエリ同期フォーム
          </Link>
        </Card>
        <Card title="ネスト / 動的パラメータ">
          <span>posts → /posts/$postId, /comments, /edit</span>
        </Card>
        <Card title="認可ガード / redirect">
          <Link to="/settings" className="text-blue-600 hover:underline">
            /settings (ログイン必須)
          </Link>
        </Card>
        <Card title="コード分割 (lazy)">
          <Link to="/heavy" className="text-blue-600 hover:underline">
            /heavy (lazy ルート)
          </Link>
        </Card>
        <Card title="NotFound / Error / Pending">
          404, ルート毎の error/pending 表示
        </Card>
      </div>

      <p className="text-gray-600">
        詳細解説は docs/router-guide.md を参照してください。
      </p>
    </div>
  )
}

