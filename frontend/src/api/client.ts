// Placeholder for future HTTP client (axios/fetch).
// Hooks currently resolve from `src/api/mocks/`. When backend lands, swap
// each hook's queryFn to call apiClient against VITE_API_URL.

export const API_BASE_URL =
  (import.meta.env.VITE_API_URL as string | undefined) ?? 'http://localhost:3001'

export async function apiClient<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${API_BASE_URL}${path}`, {
    ...init,
    headers: { 'content-type': 'application/json', ...(init?.headers ?? {}) },
  })
  if (!res.ok) throw new Error(`API ${res.status} ${res.statusText} at ${path}`)
  return (await res.json()) as T
}
