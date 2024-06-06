<script lang="ts">
  import { cn } from '$lib/cn'

  let className: string = ''
  export { className as class }
</script>

<td
  class={cn(
    'whitespace-nowrap px-3.5 py-2.5 text-left first:pl-8 last:pr-8',
    className
  )}
>
  <slot />
</td>
