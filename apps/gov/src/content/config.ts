import { defineCollection, z } from 'astro:content'
import {
  siteCollectionSchema,
  legislativeBasisSchema,
  exhibitionsSchema
} from 'content-schema'

const siteColletion = defineCollection({
  schema: siteCollectionSchema
})

const legislativeBasisCollection = defineCollection({
  type: 'data',
  schema: z.object({
    // @ts-ignore
    legislativeBasis: z.array(legislativeBasisSchema)
  })
})

const exhibitionsCollection = defineCollection({
  type: 'data',
  schema: z.object({
    // @ts-ignore
    exhibitions: z.array(exhibitionsSchema)
  })
})

export const collections = {
  site: siteColletion,
  'legislative-basis': legislativeBasisCollection,
  exhibitions: exhibitionsCollection
}
