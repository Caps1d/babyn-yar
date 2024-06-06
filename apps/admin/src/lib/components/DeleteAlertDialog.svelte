<script lang="ts">
  import { createEventDispatcher } from 'svelte'
  import {
    Dialog,
    DialogContent,
    DialogTitle,
    DialogDescription
  } from '$components'

  export function show() {
    dialog.show()
  }

  export function dismiss() {
    dialog.dissmis()
  }

  let dialog: Dialog

  const dispatch = createEventDispatcher()

  function confirm() {
    dispatch('confirm')
  }
</script>

<Dialog bind:this={dialog} size="sm" role="alertdialog">
  <DialogContent>
    <DialogTitle slot="title">Ви впевнені, що хочете це видалити?</DialogTitle>
    <DialogDescription slot="description">
      Цю дію не можна скасувати. Це остаточно видалить обрані елементи.
    </DialogDescription>
    <div class="mt-6 flex justify-between gap-4 md:justify-end">
      <button
        on:click={() => dialog.dissmis()}
        class="inline-flex h-8 items-center justify-center rounded-[4px] bg-gray-50 px-4 font-medium leading-none text-gray-600 hover:bg-gray-100"
      >
        Відмінити
      </button>
      <button
        on:click={confirm}
        class="inline-flex h-8 items-center justify-center rounded bg-red-50 px-4 font-medium leading-none text-red-600 hover:bg-red-100"
      >
        Видалити
      </button>
    </div>
  </DialogContent>
</Dialog>
