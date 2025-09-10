import { createFileRoute } from '@tanstack/react-router'

type Search = { q: string; sort: 'relevance' | 'date' }

export const Route = createFileRoute('/search')({
  validateSearch: (s: Record<string, unknown>): Search => {
    const q = typeof s.q === 'string' ? s.q : ''
    const sort = s.sort === 'date' ? 'date' : 'relevance'
    return { q, sort }
  },
  component: SearchPage,
})

function SearchPage() {
  const search = Route.useSearch()

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
          onChange={(e) => Route.navigate({ search: (s) => ({ ...s, q: e.target.value }) })}
          placeholder="検索ワード"
          className="border rounded px-2 py-1 w-64"
        />
        <select
          value={search.sort}
          onChange={(e) =>
            Route.navigate({ search: (s) => ({ ...s, sort: e.target.value as Search['sort'] }) })
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

