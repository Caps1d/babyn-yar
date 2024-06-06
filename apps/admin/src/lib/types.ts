import type { JSONContent } from '@tiptap/core'

type BaseContent = {
  id: number
  createdAt: string
  updatedAt: string
  occuredOn: string
  title: string
  description: string
  content: JSONContent
  cover: string
  lang: string
}

export type Event = BaseContent & {
  occuredOn: string
  version: number
  user: User
}

export type VictimTestimony = BaseContent & {
  documents: string[]
  user: User
}

export type Book = BaseContent & {
  documents: string[]
  user: User
}

export type HolocaustDocument = BaseContent & {
  version: number
  user: User
}

export type Metadata = {
  currentPage: number
  firstPage: number
  lastPage: number
  pageSize: number
  totalRecords: number
}

export type Asset = {
  id: number
  createdAt: string
  url: string
  fileName: string
  contentType: string
}

export type User = {
  id: number
  createdAt: string
  updatedAt: string
  fullName: string
  email: string
  permissions: string[]
}

export type UserErrorResponse = {
  fullName?: string
  email?: string
  password?: string
}
