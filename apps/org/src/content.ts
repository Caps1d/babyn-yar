import { getCollection, getEntry } from 'astro:content'

export const allPages = await getCollection('site')
export const allLegislativeBasis = await getEntry(
  'legislative-basis',
  'legislative-basis'
)
