import { ResponseError } from './response-error'
import { PUBLIC_API_URL } from '$env/static/public'
import type { Metadata } from './types'

export type CommonFilters = {
  sort?: string
  pageSize?: number
}

export type PaginatedResponse<T> = {
  items: T[]
  metadata: Metadata
}

export function createFetcher<T>(endpoint: string, key: string) {
  const baseUrl = `${PUBLIC_API_URL}/${endpoint}`

  const url = new URL(baseUrl)
  const searchParams = new URLSearchParams()
  searchParams.set('page_size', '10')

  return async (page: number = 1, filters: CommonFilters = {}) => {
    searchParams.set('page', `${page}`)

    Object.entries(filters).forEach(([key, value]) => {
      console.log(key, value)
      if (value !== undefined) {
        searchParams.set(key, value.toString())
      }
    })

    url.search = searchParams.toString()

    try {
      const response = await fetch(url)
      const json = await response.json()

      if (!response.ok) {
        const error = new ResponseError(response.status, json.error)
        return { ok: false as const, error }
      }

      const items = json[key]
      const metadata = json.metadata

      return {
        ok: true as const,
        data: { items, metadata } as PaginatedResponse<T>
      }
    } catch (e) {
      console.error(e)
      const error = new ResponseError(500, 'The server encountered an error')
      return { ok: false as const, error }
    }
  }
}
