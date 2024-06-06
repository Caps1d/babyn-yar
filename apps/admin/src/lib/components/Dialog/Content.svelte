<script lang="ts">
  import { type Dialog, melt } from '@melt-ui/svelte'
  import { getContext } from 'svelte'
  import type { Size } from './Dialog.svelte'

  const {
    elements: { portalled, content, overlay },
    states: { open }
  } = getContext<Dialog>('dialog')

  const size = getContext<Size>('size')
</script>

<div use:melt={$portalled}>
  {#if $open}
    <div
      use:melt={$overlay}
      class="fixed inset-0 z-50 bg-black/10 backdrop-blur-sm"
    />
    <div
      class="fixed inset-0 z-50 flex w-full min-w-full shrink-0 items-center justify-center overflow-y-auto overflow-x-hidden p-2 md:p-6"
    >
      <div
        use:melt={$content}
        class="relative overflow-hidden rounded-lg bg-white p-5 shadow-[0_16px_20px_hsla(0,0%,0%,20%)]"
        class:md={size === 'md'}
        class:lg={size === 'lg'}
        class:sm={size === 'sm'}
      >
        <div class="mb-5">
          <div class="mb-2">
            <slot name="title" />
          </div>
          <slot name="description" />
        </div>
        <slot />
      </div>
    </div>
  {/if}
</div>

<style lang="postcss">
  .sm {
    @apply w-[90vw] max-w-md p-3 md:p-6;
  }

  .md {
    @apply w-full p-5 lg:min-w-[720px] lg:max-w-[800px] lg:p-9;
  }

  .lg {
    @apply h-full w-full p-5 md:p-9;
  }
</style>
