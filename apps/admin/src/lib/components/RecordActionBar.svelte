<script lang="ts">
  import { Trash } from 'lucide-svelte'
  import { createEventDispatcher } from 'svelte'

  export let selected: number[]

  const dispatch = createEventDispatcher()

  function deleteSelected() {
    dispatch('delete')
  }

  function clear() {
    selected = []
  }
</script>

{#if selected.length > 0}
  <div class="mb-5">
    <div
      class="w-full rounded-md bg-gray-100 text-sm font-normal text-gray-700"
    >
      <div class="px-3 py-2">
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-4">
            <p>Обрано {selected.length}</p>
            <button
              on:click={clear}
              class="rounded-md px-3 py-2 hover:bg-gray-200"
            >
              Очистити
            </button>
          </div>
          <div class="flex items-center justify-center gap-4">
            <button
              on:click={deleteSelected}
              class="inline-flex items-center justify-center rounded-md p-2 hover:bg-gray-200"
            >
              <Trash size={16} />
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
{/if}
