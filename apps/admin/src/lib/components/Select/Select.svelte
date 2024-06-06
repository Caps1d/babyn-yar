<script lang="ts">
  import { createSelect } from '@melt-ui/svelte'
  import { setContext } from 'svelte'

  let selectedValue: string
  export { selectedValue as selected }
  export let defaultSelected: { value: string; label: string } | undefined =
    undefined

  const ctx = createSelect({
    forceVisible: true,
    defaultSelected,
    positioning: {
      placement: 'bottom',
      fitViewport: true,
      sameWidth: true
    }
  })
  setContext('select', ctx)

  const {
    states: { selected }
  } = ctx

  $: selectedValue = $selected?.value || ''
</script>

<slot />
