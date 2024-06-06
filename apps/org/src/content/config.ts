import { defineCollection, z } from 'astro:content'
import { siteCollectionSchema, legislativeBasisSchema } from 'content-schema'

const siteCollection = defineCollection({
  schema: siteCollectionSchema
})

const legislativeBasisCollection = defineCollection({
  type: 'data',
  schema: z.object({
    // @ts-ignore
    legislativeBasis: z.array(legislativeBasisSchema)
  })
})

export const collections = {
  site: siteCollection,
  'legislative-basis': legislativeBasisCollection
}
