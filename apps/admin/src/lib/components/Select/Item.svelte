<script lang="ts">
  import { cn } from '$lib/cn'
  import { type Select, melt } from '@melt-ui/svelte'
  import { getContext } from 'svelte'

  let className = ''
  export { className as class }

  export let label: string
  export let value: string

  const {
    elements: { option },
    helpers: { isSelected }
  } = getContext<Select>('select')
</script>

<div
  use:melt={$option({ value, label })}
  class:selected={$isSelected(value)}
  class={cn(
    'rounded p-2 hover:cursor-pointer data-[highlighted]:bg-gray-400/10',
    className
  )}
>
  {label}
</div>

<style lang="postcss">
  .selected {
    @apply text-indigo-600;
  }
</style>
