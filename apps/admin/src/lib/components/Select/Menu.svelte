<script lang="ts">
  import { cn } from '$lib/cn'
  import { type Select, melt } from '@melt-ui/svelte'
  import { getContext } from 'svelte'

  let className = ''
  export { className as class }

  const {
    elements: { menu },
    states: { open }
  } = getContext<Select>('select')
</script>

{#if $open}
  <div
    use:melt={$menu}
    class={cn(
      'z-10 flex max-h-[300px] flex-col overflow-y-auto rounded border bg-white p-1',
      className
    )}
  >
    <slot />
  </div>
{/if}
