<script lang="ts">
  import { UserCircle2 } from 'lucide-svelte'
  import { user, sidebarOpen } from '$lib/stores'
  import { clickOutside } from '$lib/actions'
</script>

<div
  class="absolute inset-0 z-40 hidden bg-black/20"
  class:background={$sidebarOpen}
/>
<aside
  class="absolute inset-y-0 left-0 z-40 hidden min-h-full w-[280px] max-w-[80px] border-r bg-white transition-[max-width] md:relative md:block lg:max-w-[280px]"
  class:active={$sidebarOpen}
  use:clickOutside={{ cb: () => ($sidebarOpen = false) }}
>
  <div class="flex min-h-full flex-col px-4">
    <ul class="pt-5 lg:w-full">
      <slot />
    </ul>
    {#if $user}
      <div class="relative mb-4 mt-auto w-full">
        <a
          href="/settings"
          class="group inline-flex w-full items-center justify-center gap-3 text-sm text-gray-700 hover:text-indigo-700"
          on:click={() => ($sidebarOpen = false)}
        >
          <UserCircle2
            size={20}
            class="text-gray-400 group-hover:text-indigo-700"
          />
          <span
            class="overflow-hidden overflow-ellipsis whitespace-nowrap font-semibold md:hidden lg:inline"
          >
            {$user.fullName}
          </span>
        </a>
      </div>
    {/if}
  </div>
</aside>

<style lang="postcss">
  .active {
    @apply block w-[280px] max-w-[280px];
  }

  .background {
    @apply block;
  }
</style>
