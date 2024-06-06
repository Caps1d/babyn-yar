<script lang="ts">
  import { DropdownItem } from '$components'
  import type { ArrowDownIcon } from 'lucide-svelte'

  type Icon = typeof ArrowDownIcon

  export let icon: Icon | undefined
  export let active: boolean
</script>

<DropdownItem
  on:select
  class="h-10 shrink-0 text-sm data-[highlighted]:bg-gray-100 {active
    ? 'text-indigo-600'
    : ''}"
>
  <span>
    <slot />
  </span>
  <span>
    <svelte:component this={icon} class="h-4 w-4 text-gray-400" />
  </span>
</DropdownItem>
