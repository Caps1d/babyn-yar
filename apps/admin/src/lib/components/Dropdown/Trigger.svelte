<script lang="ts">
  import { getContext } from 'svelte'
  import { type DropdownMenu, melt } from '@melt-ui/svelte'
  import { cn } from '$lib/cn'

  let className: string = ''
  export { className as class }

  const {
    elements: { trigger }
  } = getContext<DropdownMenu>('dropdown')
</script>

<!-- 'inline-flex items-center gap-0.5 rounded p-1.5 text-sm text-gray-400 outline-none transition-colors hover:text-gray-900 focus:text-gray-900 focus:ring focus:ring-sky-300', -->
<button
  use:melt={$trigger}
  type="button"
  class={cn(
    'flex items-center gap-3 rounded-md bg-indigo-600 px-4 py-3 text-sm font-semibold leading-none text-white hover:bg-indigo-500 disabled:opacity-70',
    className
  )}
>
  <slot />
</button>
