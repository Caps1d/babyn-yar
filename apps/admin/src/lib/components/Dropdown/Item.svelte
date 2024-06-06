<script lang="ts">
  import { createEventDispatcher, getContext } from 'svelte'
  import { type DropdownMenu, melt } from '@melt-ui/svelte'
  import { cn } from '$lib/cn'

  let className: string = ''
  export { className as class }

  const dispatch = createEventDispatcher()

  function select() {
    dispatch('select')
  }

  const {
    elements: { item }
  } = getContext<DropdownMenu>('dropdown')
</script>

<!-- relative z-20 flex h-10 min-h-[24px] select-none items-center gap-1 rounded py-2 pl-6 pr-1 text-sm leading-none text-gray-600 outline-none data-[highlighted]:bg-gray-100 -->
<button
  use:melt={$item}
  on:click={select}
  type="button"
  class={cn(
    'flex h-10 min-h-[24px] select-none items-center gap-1 rounded py-2 pl-6 pr-1 leading-none text-gray-600 outline-none data-[highlighted]:bg-gray-100 data-[highlighted]:text-gray-800',
    className
  )}
>
  <slot />
</button>
