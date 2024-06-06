<script lang="ts">
  import { ArrowUpLeft, PlusCircle } from 'lucide-svelte'
  export let href: string

  $: createHref = href + '/create'
</script>

<div class="divide-y rounded-md border bg-white shadow-md">
  <div class="p-6">
    <h3 class="font-semibold">
      <slot name="title" />
    </h3>
    <p class="mt-1.5 text-sm text-gray-500">
      <slot name="description">
        Перегляньте існуючі записи або створіть новий
      </slot>
    </p>
  </div>
  <div class="flex justify-between divide-x">
    <div class="flex-1">
      <a
        {href}
        class="flex items-center justify-center gap-1.5 rounded-bl-md py-4 text-sm font-semibold hover:bg-gray-50"
      >
        <ArrowUpLeft class="h-5 w-5 text-gray-400" />
        <span>Переглянути</span>
      </a>
    </div>
    <div class="flex-1">
      <a
        href={createHref}
        class="flex items-center justify-center gap-1.5 rounded-br-md py-4 text-sm font-semibold hover:bg-gray-50"
      >
        <PlusCircle class="h-5 w-5 text-gray-400" />
        <span>Створити</span>
      </a>
    </div>
  </div>
</div>
