import { useQuery } from '@tanstack/react-query'
import { createFileRoute, Link } from '@tanstack/react-router'

type User = { id: number; name: string; email: string }

export const Route = createFileRoute('/users/')({
  component: UsersPage,
})

function UsersPage() {
  const { data, isLoading, error } = useQuery({
    queryKey: ['users'],
    queryFn: async () => {
      const res = await fetch('https://jsonplaceholder.typicode.com/users')
      if (!res.ok) throw new Error('Failed to fetch users')
      return (await res.json()) as User[]
    },
  })

  if (isLoading) return <div>Loading users...</div>
  if (error) return <div className="text-red-700">Error loading users</div>

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">Users</h2>
      <ul className="space-y-1">
        {data!.map((u) => (
          <li key={u.id} className="flex items-center gap-2">
            <span className="font-medium">{u.name}</span>
            <span className="text-xs text-gray-600">{u.email}</span>
            <Link
              to="/search"
              search={{ q: u.name }}
              className="ml-auto text-blue-700 hover:underline text-xs"
            >
              Search this name
            </Link>
          </li>
        ))}
      </ul>
    </div>
  )
}

