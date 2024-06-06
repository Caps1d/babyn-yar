<script lang="ts">
  import { createEventDispatcher } from 'svelte'
  import { Trash2Icon, FileVideo2Icon, FileTextIcon } from 'lucide-svelte'

  export let src: string
  export let fileName: string
  export let extension: string
  export let index: number
  export let type: string

  const dispatch = createEventDispatcher<{
    remove: { index: number }
    change: { i: number; fileName: string }
  }>()

  function remove() {
    dispatch('remove', { index })
  }

  function change(
    e: Event & { currentTarget: EventTarget & HTMLInputElement }
  ) {
    dispatch('change', { i: index, fileName: e.currentTarget.value })
  }
</script>

<li
  class="group relative grid w-full grid-cols-[230px_auto] gap-5 rounded-md p-4 hover:bg-gray-50"
>
  <button
    on:click={remove}
    class="absolute right-3 top-3 z-10 hidden items-center justify-center p-1.5 text-gray-400 hover:text-red-400 group-hover:inline-flex"
    aria-label="Видалити файл"
  >
    <Trash2Icon size={16} />
  </button>
  <div
    class="flex h-[160px] items-center justify-center overflow-hidden rounded-lg bg-gray-100"
  >
    {#if type.startsWith('image')}
      <img
        {src}
        alt="Файл для завантаження"
        class="max-h-full w-full object-cover"
      />
    {:else if type.startsWith('video')}
      <FileVideo2Icon class="h-12 w-12 text-amber-400 lg:h-16 lg:w-16" />
    {:else}
      <FileTextIcon class="h-12 w-12 text-blue-400 lg:h-16  lg:w-16" />
    {/if}
  </div>
  <div class="w-full">
    <div class="mb-2">
      <label for={`asset-name-${index}`} class="relative w-full text-sm">
        <span class="font-semibold">Назва</span>
        <span class="text-red-400">&ast;</span>
      </label>
    </div>
    <div class="flex items-center">
      <input
        id={`asset-name-${index}`}
        type="text"
        value={fileName}
        on:input={change}
        class="w-full rounded-bl-md rounded-tl-md border px-4 py-3 text-sm outline-none hover:border-sky-400"
      />
      <span
        class="rounded-br-md rounded-tr-md border border-l-0 bg-white px-4 py-3 text-sm text-gray-400"
      >
        {extension}
      </span>
    </div>
    <div class="mt-4 hidden w-full items-center justify-end">
      <button
        class="rounded-md border border-gray-700/20 bg-white px-4 py-3 text-sm leading-none outline-none transition-colors hover:bg-gray-200 focus:ring focus:ring-gray-300"
      >
        Додаткові опції
      </button>
    </div>
  </div>
</li>
