import { createFileRoute } from '@tanstack/react-router'

type Comment = { id: number; name: string; email: string; body: string }

export const Route = createFileRoute('/posts/$postId/comments')({
  loader: async ({ params, signal }) => {
    const res = await fetch(
      `https://jsonplaceholder.typicode.com/posts/${params.postId}/comments`,
      { signal },
    )
    if (!res.ok) throw new Error('Failed to fetch comments')
    return (await res.json()) as Comment[]
  },
  pendingComponent: () => <div>Loading comments...</div>,
  component: Comments,
})

function Comments() {
  const comments = Route.useLoaderData()
  return (
    <div className="mt-4 space-y-2">
      <h3 className="font-semibold">Comments</h3>
      <ul className="space-y-2">
        {comments.map((c) => (
          <li key={c.id} className="rounded border bg-white p-3">
            <div className="font-medium">{c.name}</div>
            <div className="text-xs text-gray-500">{c.email}</div>
            <p className="mt-1 text-sm">{c.body}</p>
          </li>
        ))}
      </ul>
    </div>
  )
}

