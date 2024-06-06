<script lang="ts">
  import { melt, createDropdownMenu } from '@melt-ui/svelte'
  import { createEventDispatcher } from 'svelte'
  import {
    AtSignIcon,
    LinkIcon,
    ChevronDownIcon,
    GlobeIcon
  } from 'lucide-svelte'

  export function openMenu() {
    open.set(true)
  }

  export function closeMenu() {
    open.set(false)
  }

  const options = [
    {
      name: 'Internal',
      value: 'internal',
      icon: LinkIcon
    },
    {
      name: 'URL',
      value: 'external',
      icon: GlobeIcon
    },
    {
      name: 'Email',
      value: 'email',
      icon: AtSignIcon
    }
  ]

  let selected = options[0]

  const {
    elements: { menu, trigger, item },
    states: { open }
  } = createDropdownMenu()

  const dispatch = createEventDispatcher()

  function select(option: (typeof options)[number]) {
    dispatch('select', option.value)
    selected = option
  }
</script>

<button
  use:melt={$trigger}
  class="inline-flex items-center gap-1 text-gray-900 outline-none"
>
  <svelte:component this={selected.icon} size={16} />
  <ChevronDownIcon size={16} />
</button>

{#if open}
  <div
    use:melt={$menu}
    class="absolute !left-1/2 bottom-5 z-50 mt-2.5 h-fit max-h-[300px] w-full -translate-x-1/2 flex-col overflow-y-auto rounded-md bg-white p-1 shadow-lg shadow-gray-900/30"
  >
    {#each options as option}
      <div
        use:melt={$item}
        on:m-click={() => select(option)}
        class="relative z-50 flex h-10 min-h-[24px] select-none items-center gap-3 rounded py-2 pl-6 pr-1 text-sm leading-none text-gray-600 outline-none data-[highlighted]:bg-gray-100"
        class:active={selected.value === option.value}
      >
        <svelte:component this={option.icon} size={16} />
        <span>
          {option.name}
        </span>
      </div>
    {/each}
  </div>
{/if}

<style lang="postcss">
  .active {
    @apply text-indigo-600;
  }
</style>
