import { defineConfig } from 'astro/config'
import tailwind from '@astrojs/tailwind'
import react from '@astrojs/react'
import mdx from '@astrojs/mdx'
import node from '@astrojs/node'

import sitemap from '@astrojs/sitemap'

const isProd = import.meta.env.PROD

// https://astro.build/config
export default defineConfig({
  site: 'https://babynyar.gov.ua',
  publicDir: isProd ? './public' : '../../public',
  integrations: [tailwind(), react(), mdx(), sitemap()],
  adapter: node({
    mode: 'standalone'
  }),
  output: 'hybrid'
})
