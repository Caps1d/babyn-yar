import type { Metadata, VictimTestimony } from './types'
import { ResponseError } from './response-error'
import { PUBLIC_API_URL } from '$env/static/public'

type PaginatedResponse = {
  testimonies: VictimTestimony[]
  metadata: Metadata
}

export type Filters = {
  sort?: string
  pageSize?: number
}

const baseUrl = PUBLIC_API_URL + '/victim-testimonies'

export function fetchTestimoniesWrapper() {
  const url = new URL(baseUrl)
  const searchParams = new URLSearchParams()
  searchParams.set('page_size', '10')

  return async (page: number = 1, filters: Filters | undefined = undefined) => {
    searchParams.set('page', `${page}`)

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

export async function createTestimony(body: string) {
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

type TestimonyResponse = {
  testimonies: VictimTestimony[]
  metadata: Metadata
}

export async function fetchTestimonies(page: number = 1) {
  const url = new URL(baseUrl)
  url.searchParams.set('page', `${page}`)
  const response = await fetch(url)
  const json = await response.json()

  return json as TestimonyResponse
}

export async function fetchTestimony(id: string) {
  try {
    const res = await fetch(`${baseUrl}/${id}`)
    const json = await res.json()
    if (res.ok) {
      const { testimony } = json as { testimony: VictimTestimony }
      testimony.content = JSON.parse(testimony.content as unknown as string)
      return { ok: true as const, testimony }
    }
    const error = new ResponseError(res.status, json.error)
    return { ok: false as const, error }
  } catch (e) {
    console.log(e)
    const error = new ResponseError(500, 'the server encountered an error')
    return { ok: false as const, error }
  }
}

export async function updateTestimony(id: string, body: string) {
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

export async function deleteTestimonies(ids: number[]) {
  const url = new URL(baseUrl)
  url.searchParams.set('ids', ids.join(','))
  const response = await fetch(url, {
    method: 'DELETE',
    credentials: 'include'
  })
  return response.ok
}
