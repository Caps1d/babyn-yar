<script lang="ts">
  import { type Dialog, melt } from '@melt-ui/svelte'
  import { getContext } from 'svelte'

  const {
    elements: { trigger }
  } = getContext<Dialog>('dialog')
</script>

<button
  use:melt={$trigger}
  class="flex items-center gap-3 rounded-md bg-indigo-600 px-4 py-3 text-sm leading-none text-white outline-none transition-colors hover:bg-indigo-500 disabled:bg-indigo-400"
>
  <slot name="icon" />
  <span class="text-sm font-semibold leading-none">
    <slot name="text" />
  </span>
</button>
