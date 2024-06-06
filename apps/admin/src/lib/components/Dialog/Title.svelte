<script lang="ts">
  import { type Dialog, melt } from '@melt-ui/svelte'
  import { getContext } from 'svelte'

  const {
    elements: { title }
  } = getContext<Dialog>('dialog')
</script>

<h2 use:melt={$title} class="text-xl font-semibold text-gray-700">
  <slot />
</h2>
