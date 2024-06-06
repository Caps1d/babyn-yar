<script>
  import { sidebarOpen } from '$lib/stores'
  import { Menu } from 'lucide-svelte'
</script>

<div
  class="fixed inset-x-0 top-0 z-20 block h-14 w-full border-b bg-white md:hidden"
>
  <div class="flex h-full items-center px-3">
    <button on:click|stopPropagation={() => ($sidebarOpen = true)}>
      <Menu size={20} />
    </button>
  </div>
</div>
