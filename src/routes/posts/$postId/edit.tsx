import { createFileRoute } from '@tanstack/react-router'
import { useEffect, useMemo, useState } from 'react'

// useBlocker is available in TanStack Router v1
import { useBlocker } from '@tanstack/react-router'

export const Route = createFileRoute('/posts/$postId/edit')({
  component: EditPost,
})

function EditPost() {
  const { postId } = Route.useParams()
  const [title, setTitle] = useState('')
  const [body, setBody] = useState('')
  const [saved, setSaved] = useState(false)

  const dirty = useMemo(() => !saved && (title.length > 0 || body.length > 0), [title, body, saved])
  useBlocker(dirty)

  useEffect(() => {
    // fetch existing post to prefill (optional)
    fetch(`https://jsonplaceholder.typicode.com/posts/${postId}`)
      .then((r) => r.ok ? r.json() : Promise.reject(r.statusText))
      .then((p: { title: string; body: string }) => {
        setTitle(p.title)
        setBody(p.body)
      })
      .catch(() => {})
  }, [postId])

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">Edit Post #{postId}</h2>
      <form
        className="space-y-3"
        onSubmit={async (e) => {
          e.preventDefault()
          // Simulate save
          await new Promise((r) => setTimeout(r, 500))
          setSaved(true)
          alert('Saved!')
        }}
      >
        <div>
          <label className="block text-sm">Title</label>
          <input
            value={title}
            onChange={(e) => {
              setSaved(false)
              setTitle(e.target.value)
            }}
            className="border rounded px-2 py-1 w-full"
          />
        </div>
        <div>
          <label className="block text-sm">Body</label>
          <textarea
            value={body}
            onChange={(e) => {
              setSaved(false)
              setBody(e.target.value)
            }}
            rows={6}
            className="border rounded px-2 py-1 w-full"
          />
        </div>
        <div className="flex gap-2">
          <button className="px-3 py-1 rounded bg-blue-600 text-white">Save</button>
        </div>
      </form>
      {dirty ? <div className="text-xs text-orange-600">未保存の変更があります。離脱時に確認します。</div> : null}
    </div>
  )
}

