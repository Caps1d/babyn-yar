import { z } from 'zod'

const baseSchema = z.object({
  type: z.literal('base').optional().default('base'),
  title: z.string(),
  description: z.string()
})

const compactSchema = baseSchema.extend({
  type: z.literal('compact')
})

export const siteCollectionSchema = z.union([baseSchema, compactSchema])

export const eventSchema = z.object({
  title: z.string(),
  description: z.string(),
  slug: z.string(),
  image: z.string(),
  featured: z.boolean().default(false)
})

export const librarySchema = z.object({
  title: z.string(),
  date: z.string(),
  imgSrc: z.string(),
  href: z.string()
})

export const holocaustDocumentsSchema = z.object({
  title: z.string(),
  description: z.string(),
  date: z.string(),
  imgSrc: z.string(),
  href: z.string()
})

export const testimoniesSchema = z.object({
  title: z.string(),
  description: z.string(),
  date: z.string(),
  imgSrc: z.string(),
  href: z.string()
})

export const legislativeBasisSchema = z.object({
  title: z.string(),
  imgSrc: z.string(),
  href: z.string()
})

export const exhibitionsSchema = z.object({
  title: z.string(),
  imgSrc: z.string(),
  href: z.string()
})

export type EventData = z.infer<typeof eventSchema>
export type LibraryData = z.infer<typeof librarySchema>
export type HolocaustDocumentData = z.infer<typeof holocaustDocumentsSchema>
export type TestimonyData = z.infer<typeof testimoniesSchema>
export type LegislativeBasisData = z.infer<typeof legislativeBasisSchema>
export type ExhibitionData = z.infer<typeof exhibitionsSchema>
