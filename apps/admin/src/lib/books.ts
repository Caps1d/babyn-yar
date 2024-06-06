import { PUBLIC_API_URL } from '$env/static/public'
import type { Book, Metadata } from './types'
import { ResponseError } from './response-error'

type PaginatedResponse = {
  books: Book[]
  metadata: Metadata
}

export type Filters = {
  title?: string
  sort?: string
  pageSize?: number
}

const baseUrl = PUBLIC_API_URL + '/books'

export function fetchBooksWrapper() {
  const url = new URL(baseUrl)
  const searchParams = new URLSearchParams()
  searchParams.set('page_size', '10')

  return async (page: number = 1, filters: Filters | undefined = undefined) => {
    searchParams.set('page', `${page}`)

    if (filters?.sort !== undefined) {
      searchParams.set('sort', filters.sort)
    }

    if (filters?.title !== undefined) {
      searchParams.set('title', filters.title)
    }

    if (filters?.pageSize !== undefined) {
      searchParams.set('page_size', filters.pageSize.toString())
    }

    url.search = searchParams.toString()

    try {
      const response = await fetch(url)
      const json = await response.json()
      if (!response.ok) {
        const error = new ResponseError(response.status, json.error)
        return { ok: false as const, error }
      }
      return { ok: true as const, data: json as PaginatedResponse }
    } catch (e) {
      console.log(e)
      const error = new ResponseError(500, 'the server encountered an error')
      return { ok: false as const, error }
    }
  }
}

export async function createBook(body: string) {
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

export async function fetchBooks(page: number = 1) {
  const url = new URL(baseUrl)
  url.searchParams.set('page', `${page}`)
  try {
    const response = await fetch(url)
    if (response.ok) {
      const json: { books: Book[]; metadata: Metadata } = await response.json()
      return { ok: true as const, data: json }
    }
    return { ok: false as const }
  } catch (e) {
    console.log(e)
    return { ok: false as const }
  }
}

export async function fetchBook(id: string) {
  try {
    const response = await fetch(`${baseUrl}/${id}`)
    const json = await response.json()
    if (response.ok) {
      const { book } = json as { book: Book }
      book.content = JSON.parse(book.content as unknown as string)
      return { ok: true as const, book }
    }
    const error = new ResponseError(response.status, json.error)
    return { ok: false as const, error }
  } catch (e) {
    console.log(e)
    const error = new ResponseError(500, 'the server encountered an error')
    return { ok: false as const, error }
  }
}

export async function updateBook(id: string, body: string) {
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

export async function deleteBooks(ids: number[]) {
  const url = new URL(baseUrl)
  url.searchParams.set('ids', ids.join(','))
  try {
    const response = await fetch(url, {
      method: 'DELETE',
      credentials: 'include'
    })
    return { ok: response.ok }
  } catch (e) {
    return { ok: false as const }
  }
}
