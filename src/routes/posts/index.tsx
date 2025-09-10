import { createFileRoute, Link, useNavigate } from '@tanstack/react-router'
import { z } from 'zod'

const searchSchema = z.object({
  page: z.coerce.number().int().min(1).catch(1),
  q: z
    .string()
    .transform((s) => s.trim())
    .transform((s) => (s.length ? s : undefined))
    .optional()
    .catch(undefined),
})
type Search = z.infer<typeof searchSchema>

export const Route = createFileRoute('/posts/')({
  validateSearch: (search: Record<string, unknown>): Search => searchSchema.parse(search),
  loaderDeps: ({ search }) => ({ page: search.page, q: search.q }),
  loader: async ({ signal, deps }) => {
    const params = new URLSearchParams()
    params.set('_limit', '10')
    params.set('_page', String(deps.page))
    console.log("deps",deps)
    if (deps.q) params.set('q', deps.q)
    const res = await fetch(`https://jsonplaceholder.typicode.com/posts?${params}`, {
      signal,
    })
    if (!res.ok) throw new Error('Failed to fetch posts')
    const items = (await res.json()) as { id: number; title: string }[]
    return { items }
  },
  pendingComponent: () => <div>Loading posts...</div>,
  errorComponent: ({ error }) => (
    <div className="text-red-700">Error loading posts: {String(error)}</div>
  ),
  component: PostsPage,
})

function PostsPage() {
  const { page, q } = Route.useSearch()
  const { items } = Route.useLoaderData()
  const prevPage = Math.max(1, page - 1)
  const nextPage = page + 1
  const navigate = useNavigate({ from: '/posts/' })

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">Posts</h2>

      <form
        className="flex gap-2"
        onSubmit={(e) => {
          e.preventDefault()
          const form = e.currentTarget as HTMLFormElement
          const input = form.elements.namedItem('q') as HTMLInputElement
          navigate({ to: '/posts/', search: (s: Search) => ({ ...s, q: input.value || undefined, page: 1 }) })
        }}
      >
        <input
          type="search"
          name="q"
          defaultValue={q ?? ''}
          placeholder="検索..."
          className="border rounded px-2 py-1 w-64"
        />
        <button className="px-3 py-1 rounded bg-blue-600 text-white">Search</button>
      </form>

      <ul className="space-y-1">
        {items.map((p) => (
          <li key={p.id}>
            <Link to="/posts/$postId" params={{ postId: String(p.id) }} preload="intent" className="text-blue-700 hover:underline">
              {p.title}
            </Link>
          </li>
        ))}
      </ul>

      <div className="flex items-center gap-2 pt-2">
        <Link
          to="/posts/"
          search={{ page: prevPage, q }}
          disabled={page <= 1}
          className="px-2 py-1 border rounded disabled:opacity-50"
        >
          Prev
        </Link>
        <span>Page {page}</span>
        <Link to="/posts/" search={{ page: nextPage, q }} className="px-2 py-1 border rounded">
          Next
        </Link>
      </div>
    </div>
  )
}
