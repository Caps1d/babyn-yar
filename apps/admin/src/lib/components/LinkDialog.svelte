<script lang="ts">
  import { createEventDispatcher } from 'svelte'
  import { LinkOptionsMenu, Button } from '$components'
  import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogTitle
  } from '$components'

  export function open() {
    dialog.show()
  }

  export function close() {
    dialog.dissmis()
  }

  export let value = ''

  let type = ''
  let dialog: Dialog

  const dispatch = createEventDispatcher()

  function done() {
    dispatch('done', { value, type })
    value = ''
  }

  function selectType(e: CustomEvent<string>) {
    type = e.detail
  }
</script>

<Dialog bind:this={dialog} size="md">
  <DialogContent>
    <DialogTitle slot="title">Посилання</DialogTitle>
    <DialogDescription slot="description"
      >Додати будь-яке посилання</DialogDescription
    >
    <div class="mt-7 min-h-[30px]">
      <div class="pb-5">
        <div class="relative h-full">
          <div
            class="flex h-10 w-full items-center overflow-hidden rounded border px-4 hover:border-sky-400"
          >
            <div
              class="inline-flex items-center border-r border-gray-700/20 pr-2"
            >
              <LinkOptionsMenu on:select={selectType} />
            </div>
            <input
              type="text"
              name="link-variant"
              bind:value
              class="h-full w-full border-none pl-4 outline-none"
              autocomplete="off"
            />
          </div>
        </div>
      </div>
    </div>
    <div
      class="-mb-9 -ml-5 -mr-5 flex min-h-[80px] items-center justify-end gap-2.5 rounded-bl-lg rounded-br-lg bg-gray-100 px-9 lg:-ml-9 lg:-mr-9"
    >
      <button
        on:click={() => dialog.dissmis()}
        class="rounded-md border bg-white px-4 py-3 text-sm font-semibold leading-none outline-none focus:ring focus:ring-gray-300 disabled:opacity-60"
      >
        Відмінити
      </button>
      <Button isDisabled={value.length === 0} on:click={done}>Готово</Button>
    </div>
  </DialogContent>
</Dialog>
