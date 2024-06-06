<script lang="ts">
  import { createDropdownMenu } from '@melt-ui/svelte'
  import { setContext } from 'svelte'

  export function show() {
    $open = true
  }

  export function dismiss() {
    $open = false
  }

  const ctx = createDropdownMenu({ forceVisible: true })
  setContext('dropdown', ctx)

  const {
    states: { open }
  } = ctx
</script>

<slot />
