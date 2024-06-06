<script lang="ts">
  export let title: string
</script>

<svelte:head>
  <title>{title}</title>
</svelte:head>

<slot name="header" />

<div class="mt-[calc(3.5rem+5rem)] px-3 md:mt-20 md:px-6 lg:px-10">
  <div class="pb-8 pt-5">
    <slot />
  </div>
</div>
