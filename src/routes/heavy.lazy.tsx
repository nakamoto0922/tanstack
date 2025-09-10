import { createLazyFileRoute } from '@tanstack/react-router'

export const Route = createLazyFileRoute('/heavy')({
  component: HeavyPage,
  pendingComponent: () => <div>Loading heavy page...</div>,
})

function HeavyPage() {
  // Simulate heavy content
  const items = Array.from({ length: 1000 }, (_, i) => i)
  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">Heavy (Lazy) Page</h2>
      <p className="text-sm text-gray-600">このルートは .lazy.tsx によりコード分割されています。</p>
      <div className="grid grid-cols-4 gap-2">
        {items.map((i) => (
          <div key={i} className="border rounded p-2 text-center bg-white">
            #{i + 1}
          </div>
        ))}
      </div>
    </div>
  )
}

