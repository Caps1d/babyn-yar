<script lang="ts">
  import { cn } from '$lib/cn'
  import { type Select, melt } from '@melt-ui/svelte'
  import { ChevronDown } from 'lucide-svelte'
  import { getContext } from 'svelte'

  let className = ''
  export { className as class }

  const {
    elements: { trigger },
    states: { selectedLabel }
  } = getContext<Select>('select')
</script>

<button
  use:melt={$trigger}
  type="button"
  class={cn(
    'flex min-w-[220px] items-center justify-between rounded border bg-white px-3 py-2 leading-none outline-none hover:border-sky-400 focus:border-sky-400 focus:ring focus:ring-sky-100 data-[state=open]:border-sky-400 data-[state=open]:ring data-[state=open]:ring-sky-100',
    className
  )}
>
  <span>
    {#if $selectedLabel}
      {$selectedLabel}
    {:else}
      <slot />
    {/if}
  </span>
  <ChevronDown class="h-4 w-4" />
</button>
