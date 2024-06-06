import type { Event, Metadata } from './types'
import { PUBLIC_API_URL } from '$env/static/public'
import { ResponseError } from './response-error'

type PaginatedResponse = {
  events: Event[]
  metadata: Metadata
}

export type Filters = {
  title?: string
  sort?: string
  pageSize?: number
}

const baseUrl = PUBLIC_API_URL + '/events'

export function fetchEventsWrapper() {
  const url = new URL(baseUrl)
  const searchParams = new URLSearchParams()
  searchParams.set('page_size', '10')

  return async (page: number = 1, filters: Filters | undefined = undefined) => {
    searchParams.set('page', `${page}`)

    if (filters?.title !== undefined) {
      searchParams.set('title', filters.title)
    }

    if (filters?.sort !== undefined) {
      searchParams.set('sort', filters.sort)
    }

    if (filters?.pageSize !== undefined) {
      searchParams.set('page_size', filters.pageSize.toString())
    }

    url.search = searchParams.toString()

    try {
      const response = await fetch(url)
      const json = await response.json()
      if (response.ok) {
        return { ok: true as const, data: json as PaginatedResponse }
      }
      const error = new ResponseError(response.status, json.error)
      return { ok: false as const, error }
    } catch (e) {
      console.log(e)
      const error = new ResponseError(500, 'the server encountered an error')
      return { ok: false as const, error }
    }
  }
}

export async function fetchEvent(id: string) {
  const res = await fetch(`${baseUrl}/${id}`)
  if (!res.ok) {
    const json = await res.json()
    const error = new ResponseError(res.status, json.error)
    return { ok: false as const, error }
  }
  const { event } = (await res.json()) as { event: Event }
  event.content = JSON.parse(event.content as unknown as string)
  return { ok: true as const, event }
}

export async function createEvent(body: string) {
  try {
    const response = await fetch(baseUrl, {
      method: 'POST',
      body,
      credentials: 'include'
    })
    if (!response.ok) {
      const json = await response.json()
      const error = new ResponseError(response.status, json.error)
      return { ok: false as const, error }
    }
    return { ok: true as const }
  } catch (e) {
    console.log(e)
    const error = new ResponseError(500, 'the server encountered an error')
    return { ok: false as const, error }
  }
}

export async function updateEvent(id: string, body: string) {
  try {
    const response = await fetch(`${baseUrl}/${id}`, {
      method: 'PATCH',
      body,
      credentials: 'include'
    })
    if (!response.ok) {
      const json = await response.json()
      const error = new ResponseError(response.status, json.error)
      return { ok: false as const, error }
    }
    return { ok: true as const }
  } catch (e) {
    console.log(e)
    const error = new ResponseError(500, 'the server encountered an error')
    return { ok: false as const, error }
  }
}

export async function fetchEvents(page: number = 1) {
  const url = new URL(baseUrl)
  url.searchParams.set('page', `${page}`)
  const response = await fetch(url)
  const json = await response.json()

  return json as PaginatedResponse
}

export async function deleteEvents(ids: number[]) {
  const url = new URL(baseUrl)
  url.searchParams.append('ids', ids.join(','))
  const response = await fetch(url, {
    method: 'DELETE',
    credentials: 'include'
  })
  return response.ok
}
