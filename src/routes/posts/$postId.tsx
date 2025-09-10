import { Link, createFileRoute, redirect } from '@tanstack/react-router'
import { z } from 'zod'

type Post = { id: number; title: string; body: string }

export const Route = createFileRoute('/posts/$postId')({
  parseParams: (p) => z.object({ postId: z.string().regex(/^\d+$/) }).parse(p),
  loader: async ({ params, signal }) => {
    const res = await fetch(`https://jsonplaceholder.typicode.com/posts/${params.postId}`, { signal })
    if (res.status === 404) {
      throw redirect({ to: '/posts', replace: true })
    }
    if (!res.ok) throw new Error('Failed to fetch post')
    return (await res.json()) as Post
  },
  pendingComponent: () => <div>Loading post...</div>,
  errorComponent: ({ error }) => (
    <div className="text-red-700">Error loading post: {String(error)}</div>
  ),
  component: PostPage,
})

function PostPage() {
  const post = Route.useLoaderData()
  const { postId } = Route.useParams()
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">{post.title}</h2>
        <div className="flex gap-2">
          <Link
            to="/posts/$postId/edit"
            params={{ postId }}
            className="px-3 py-1 rounded border"
          >
            Edit
          </Link>
          <Link to="/posts" className="px-3 py-1 rounded border">
            Back
          </Link>
        </div>
      </div>
      <p className="whitespace-pre-wrap">{post.body}</p>

      <div className="pt-2 border-t">
        <h3 className="font-semibold mb-2">Nested</h3>
        <div className="flex gap-3 text-sm">
          <Link to="/posts/$postId/comments" params={{ postId }} className="text-blue-700 hover:underline">
            Comments
          </Link>
        </div>
      </div>
    </div>
  )
}
