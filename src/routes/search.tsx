import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { z } from 'zod'

const searchSchema = z.object({
  q: z.string().catch(''),
  sort: z.enum(['relevance', 'date']).catch('relevance'),
})
type Search = z.infer<typeof searchSchema>

export const Route = createFileRoute('/search')({
  validateSearch: (s: Record<string, unknown>): Search => searchSchema.parse(s),
  component: SearchPage,
})

function SearchPage() {
  const search = Route.useSearch()
  const navigate = useNavigate({ from: '/search' })

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">Search</h2>
      <form
        className="flex gap-2"
        onSubmit={(e) => {
          e.preventDefault()
        }}
      >
        <input
          type="search"
          value={search.q}
          onChange={(e) =>
            navigate({ to: '/search', search: (s: Search) => ({ ...s, q: e.target.value }), replace: true })
          }
          placeholder="検索ワード"
          className="border rounded px-2 py-1 w-64"
        />
        <select
          value={search.sort}
          onChange={(e) =>
            navigate({
              to: '/search',
              search: (s: Search) => ({ ...s, sort: e.target.value as Search['sort'] }),
              replace: true,
            })
          }
          className="border rounded px-2 py-1"
        >
          <option value="relevance">関連度</option>
          <option value="date">日付</option>
        </select>
      </form>

      <div className="text-sm text-gray-700">
        クエリ文字列と完全同期します：<code>?q={search.q}&sort={search.sort}</code>
      </div>
    </div>
  )
}
