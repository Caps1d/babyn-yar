<script lang="ts">
  import { getContext } from 'svelte'
  import { type DropdownMenu, melt } from '@melt-ui/svelte'
  import { cn } from '$lib/cn'

  let className: string = ''
  export { className as class }

  const {
    elements: { menu },
    states: { open }
  } = getContext<DropdownMenu>('dropdown')
</script>

{#if $open}
  <div
    use:melt={$menu}
    class={cn(
      'z-40 mt-2 flex max-h-[300px] min-w-[220px] flex-col rounded-md bg-white p-1 shadow-lg shadow-gray-900/30 lg:max-h-none',
      className
    )}
  >
    <slot />
  </div>
{/if}
