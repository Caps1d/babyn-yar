<script lang="ts">
  import { type Dialog, melt } from '@melt-ui/svelte'
  import { XIcon } from 'lucide-svelte'
  import { getContext } from 'svelte'
  import type { Size } from './Dialog.svelte'

  export let isDisabled = false

  const {
    elements: { close }
  } = getContext<Dialog>('dialog')
  const size = getContext<Size>('size')
</script>

<button
  use:melt={$close}
  aria-label="Закрити"
  disabled={isDisabled}
  class="absolute inline-flex items-center justify-center rounded-full p-1.5 text-gray-800 outline-none hover:bg-gray-100 focus:ring focus:ring-indigo-300 disabled:opacity-60"
  class:lg={size === 'lg'}
  class:md={size === 'md'}
  class:sm={size === 'sm'}
>
  <XIcon class="h-4 w-4" />
</button>

<style lang="postcss">
  .sm {
    @apply right-3 top-3 md:right-6 md:top-6;
  }

  .md {
    @apply right-5 top-5 lg:right-9 lg:top-9;
  }

  .lg {
    @apply right-5 top-5 lg:right-9 lg:top-9;
  }
</style>
