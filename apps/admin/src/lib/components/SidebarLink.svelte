<script lang="ts">
  import { page } from '$app/stores'
  import { sidebarOpen } from '$lib/stores'

  export let href: string

  $: active = $page.url.pathname.includes(href)
</script>

<li class="my-0.5">
  <a
    {href}
    class="group flex items-center gap-4 rounded p-3 text-sm font-medium text-gray-700 outline-none hover:bg-gray-50 hover:text-indigo-700 focus-visible:ring-2 focus-visible:ring-gray-400 [&_svg]:text-gray-400 [&_svg]:hover:text-indigo-700"
    class:active
    data-active={active}
    on:click={() => ($sidebarOpen = false)}
  >
    <div class="flex max-w-full items-center gap-3">
      <slot />
    </div>
  </a>
</li>

<style lang="postcss">
  .active {
    @apply bg-gray-50 text-indigo-700;
  }
</style>
