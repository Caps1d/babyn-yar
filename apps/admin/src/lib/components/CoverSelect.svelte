<script lang="ts">
  import { AssetDialog } from '$components'
  import { ImageIcon, PlusIcon } from 'lucide-svelte'

  export let cover: string
  export let error: string | undefined = undefined

  let dialog: AssetDialog

  function select(e: CustomEvent<{ url: string }>) {
    cover = e.detail.url
    dialog.close()
  }
</script>

<div>
  <label for="select-cover" class="mb-1.5 block text-gray-500">
    Обкладинка
  </label>
  {#if error}
    <p class="-mt-1.5 mb-1.5 text-red-500">{error}</p>
  {/if}
  <button
    on:click={() => dialog.open('image')}
    id="select-cover"
    type="button"
    class="flex w-full items-center gap-5 rounded border bg-white px-3 py-2 outline-none hover:border-sky-400 focus:border-sky-400 focus:ring focus:ring-sky-100"
  >
    <div
      class="flex h-20 w-[120px] items-center justify-center overflow-hidden rounded-lg bg-gray-100"
    >
      {#if cover}
        <img
          src={cover}
          alt="Event cover"
          class="h-full max-w-full object-contain"
        />
      {:else}
        <ImageIcon class="h-6 w-6" />
      {/if}
    </div>
    <div class="flex items-center gap-1">
      {#if cover}
        <button
          on:click|stopPropagation={() => dialog.open('image')}
          type="button"
          class="text-sm"
        >
          Змінити
        </button>
      {:else}
        <PlusIcon class="h-4 w-4" />
        <p class="text-sm">Додати обкладинку</p>
      {/if}
    </div>
  </button>
</div>

<AssetDialog bind:this={dialog} on:select={select} />
