<script lang="ts">
  import { FileVideo2, FileText } from 'lucide-svelte'

  export let contentType: string
  export let src: string
  export let fileName: string

  $: [name, ext] = fileName.split('.')
</script>

<div
  class="h-[100px] max-h-[100px] w-full min-w-[160px] overflow-x-hidden rounded-lg bg-gray-100 lg:h-[140px] lg:max-h-[140px] lg:min-w-[220px]"
>
  <div class="h-full w-full">
    <div
      class="flex h-[100px] items-center justify-center text-gray-500 lg:h-[140px]"
    >
      {#if contentType.startsWith('image')}
        <img {src} alt={fileName} class="!max-h-full !max-w-full" />
      {:else if contentType.startsWith('video')}
        <FileVideo2 class="h-12 w-12 text-amber-400 lg:h-16 lg:w-16" />
      {:else}
        <FileText class="h-12 w-12 text-blue-400 lg:h-16 lg:w-16" />
      {/if}
    </div>
  </div>
</div>
<p class="line-clamp-1 text-xs font-semibold text-gray-800 lg:text-sm">
  {name}
</p>
<p class="text-xs text-gray-400 lg:text-sm">.{ext}</p>
