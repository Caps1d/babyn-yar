import type { HolocaustDocument, Metadata } from './types'
import { PUBLIC_API_URL } from '$env/static/public'
import { ResponseError } from './response-error'

type PaginatedResponse = {
  documents: HolocaustDocument[]
  metadata: Metadata
}

export type Filters = {
  pageSize?: number
  sort?: string
}

const baseUrl = PUBLIC_API_URL + '/holocaust-documents'

export function fetchHolocaustDocumentsWrapper() {
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

export async function fetchHolocaustDocument(id: string) {
  const response = await fetch(`${baseUrl}/${id}`)
  if (!response.ok) {
    const json = await response.json()
    const error = new ResponseError(response.status, json.error)
    return { ok: false as const, error }
  }
  const { document } = (await response.json()) as {
    document: HolocaustDocument
  }
  document.content = JSON.parse(document.content as unknown as string)
  return { ok: true as const, document }
}

export async function createHolocaustDocument(body: string) {
  try {
    const response = await fetch(baseUrl, {
      method: 'POST',
      body,
      credentials: 'include'
    })
    if (response.ok) {
      return { ok: true as const }
    }
    const json = await response.json()
    const error = new ResponseError(response.status, json.error)
    return { ok: false as const, error }
  } catch (e) {
    console.log(e)
    const error = new ResponseError(500, 'the server encountered an error')
    return { ok: false as const, error }
  }
}

export async function updateHolocaustDocument(id: string, body: string) {
  try {
    const response = await fetch(`${baseUrl}/${id}`, {
      method: 'PATCH',
      body,
      credentials: 'include'
    })
    if (response.ok) {
      return { ok: true as const }
    }
    const json = await response.json()
    const error = new ResponseError(response.status, json.error)
    return { ok: false as const, error }
  } catch (e) {
    console.log(e)
    const error = new ResponseError(500, 'the server encountered an error')
    return { ok: false as const, error }
  }
}

export async function fetchHolocaustDocuments(page: number = 1) {
  const url = new URL(baseUrl)
  url.searchParams.set('page', `${page}`)
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

export async function deleteHolocaustDocuments(ids: number[]) {
  const url = new URL(baseUrl)
  url.searchParams.append('ids', ids.join(','))
  try {
    const response = await fetch(url, {
      method: 'DELETE',
      credentials: 'include'
    })
    if (response.ok) {
      return { ok: true as const }
    }
    const json = await response.json()
    const error = new ResponseError(response.status, json.error)
    return { ok: false as const, error }
  } catch (e) {
    console.log(e)
    const error = new ResponseError(500, 'the server encountered an error')
    return { ok: false as const, error }
  }
}
