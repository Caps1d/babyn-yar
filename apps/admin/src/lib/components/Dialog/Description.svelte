<script lang="ts">
  import { type Dialog, melt } from '@melt-ui/svelte'
  import { getContext } from 'svelte'

  const {
    elements: { description }
  } = getContext<Dialog>('dialog')
</script>

<p use:melt={$description} class="text-gray-500">
  <slot />
</p>
