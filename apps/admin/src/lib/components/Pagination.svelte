<script lang="ts">
  import { Select, SelectItem, SelectMenu, SelectTrigger } from '$components'
  import { pageSizeOptions } from '$lib/select-options'
  import { MoveLeft, MoveRight } from 'lucide-svelte'
  import { createEventDispatcher } from 'svelte'

  export let currentPage: number
  export let lastPage: number

  let pageSizeLabel: string = pageSizeOptions[0].label
  let pageSizeValue: string = pageSizeOptions[0].value

  const delta = 3
  $: lower = Math.max(1, currentPage - delta)
  $: upper = Math.min(lastPage, currentPage + delta)
  $: pages = Array.from({ length: upper - lower + 1 }, (_, i) => i + lower)

  const dispatch = createEventDispatcher()

  function selectPage(page: number) {
    dispatch('select', { page })
  }

  function selectPageSize(size: string) {
    dispatch('selectSize', { size: parseInt(size) })
  }

  $: selectPageSize(pageSizeValue)
</script>

<div
  class="flex w-full items-center justify-between rounded-bl-md rounded-br-md border bg-white px-8 font-medium"
>
  <div class="-mt-[1px] flex flex-1 items-center">
    <button
      disabled={currentPage === 1}
      on:click={() => selectPage(currentPage - 1)}
      class="flex items-center gap-1.5 border-t-2 border-transparent py-4 text-sm text-gray-500 hover:border-gray-300 hover:text-gray-900 disabled:cursor-not-allowed disabled:border-transparent disabled:text-gray-500"
    >
      <MoveLeft size={16} />
      <span>Попередня</span>
    </button>
    <div class="pl-4">
      <Select
        bind:selected={pageSizeValue}
        defaultSelected={pageSizeOptions[0]}
      >
        <SelectTrigger
          class="min-w-[170px] py-1 text-sm text-gray-600 hover:text-gray-800"
        >
          {pageSizeLabel}
        </SelectTrigger>
        <SelectMenu>
          {#each pageSizeOptions as size}
            <SelectItem {...size} class="p-1.5 text-sm" />
          {/each}
        </SelectMenu>
      </Select>
    </div>
  </div>
  <div class="-mt-[1px] flex items-center text-sm font-medium">
    {#each pages as page}
      <button
        class="border-t-2 border-t-transparent p-4 text-gray-500 hover:border-t-gray-300"
        class:active={page === currentPage}
        on:click={() => selectPage(page)}
      >
        {page}
      </button>
    {/each}
  </div>
  <div class="-mt-[1px] flex flex-1 items-center justify-end">
    <button
      disabled={currentPage === lastPage}
      on:click={() => selectPage(currentPage + 1)}
      class="flex items-center gap-1.5 border-t-2 border-transparent py-4 text-sm text-gray-500 hover:border-gray-300 hover:text-gray-900 disabled:cursor-not-allowed disabled:border-transparent disabled:text-gray-500"
    >
      <span>Наступна</span>
      <MoveRight size={16} />
    </button>
  </div>
</div>

<style lang="postcss">
  .active {
    @apply !border-t-indigo-700 !text-indigo-700;
  }
</style>
