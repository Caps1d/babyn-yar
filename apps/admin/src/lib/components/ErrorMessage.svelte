<script>
  import { AlertOctagon } from 'lucide-svelte'
</script>

<div class="my-4">
  <div
    class="flex gap-3 rounded border border-red-700/10 bg-red-100 px-4 py-2.5 text-red-800"
  >
    <AlertOctagon />
    <span>
      <slot />
    </span>
  </div>
</div>
