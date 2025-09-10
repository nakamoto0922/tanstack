export type User = {
  id: string
  roles: string[]
}

const AUTH_KEY = 'auth'

export function getUser(): User | null {
  if (typeof window === 'undefined') return null
  const raw = localStorage.getItem(AUTH_KEY)
  if (!raw) return null
  try {
    const parsed = JSON.parse(raw) as User
    if (!Array.isArray(parsed.roles)) return null
    return parsed
  } catch {
    return null
  }
}

export function isAuthed(): boolean {
  return !!getUser()
}

export function hasRole(role: string): boolean {
  const u = getUser()
  return !!u && u.roles.includes(role)
}

export function login(user: User) {
  if (typeof window === 'undefined') return
  localStorage.setItem(AUTH_KEY, JSON.stringify(user))
}

export function logout() {
  if (typeof window === 'undefined') return
  localStorage.removeItem(AUTH_KEY)
}

