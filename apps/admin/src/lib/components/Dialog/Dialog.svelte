<script context="module" lang="ts">
  export type Size = 'sm' | 'md' | 'lg'
</script>

<script lang="ts">
  import { createDialog } from '@melt-ui/svelte'
  import { setContext } from 'svelte'

  export function show() {
    $open = true
  }

  export function dissmis() {
    $open = false
  }

  export let size: Size = 'md'
  export let role: 'dialog' | 'alertdialog' | undefined = 'dialog'

  const ctx = createDialog({
    forceVisible: true,
    closeOnOutsideClick: true,
    role
  })
  setContext('dialog', ctx)
  setContext('size', size)

  const {
    states: { open }
  } = ctx
</script>

<slot />
