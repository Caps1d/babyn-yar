<script lang="ts">
  import type { HTMLInputTypeAttribute } from 'svelte/elements'
  import { Eye, EyeOff } from 'lucide-svelte'

  export let value: string = ''
  export let name: string
  export let label: string
  export let required: boolean = false
  export let error: string | undefined = undefined
  export let type: HTMLInputTypeAttribute = 'text'

  let isPasswordVisible = false

  function change(
    e: Event & {
      currentTarget: EventTarget & HTMLInputElement
    }
  ) {
    value = e.currentTarget.value
  }

  function togglePasswordVisibility() {
    isPasswordVisible = !isPasswordVisible
  }
</script>

<label class="block text-gray-500">
  {label}
  {#if error}
    <p class="-mb-1.5 text-red-500">{error}</p>
  {/if}
  <div class="relative w-full">
    <input
      {name}
      {required}
      {value}
      type={isPasswordVisible && type === 'password' ? 'text' : type}
      autocomplete="off"
      on:input={change}
      class="mt-1.5 block h-10 w-full rounded border px-2 text-base text-gray-900 outline-none transition-all hover:border-sky-400 focus:border-sky-400 focus:ring focus:ring-sky-100"
    />
    {#if type === 'password'}
      <button
        type="button"
        on:click={togglePasswordVisibility}
        class="absolute right-4 top-1/2 -translate-y-1/2"
      >
        {#if isPasswordVisible}
          <EyeOff size={20} class="text-gray-400 hover:text-indigo-400" />
        {:else}
          <Eye size={20} class="text-gray-400 hover:text-indigo-400" />
        {/if}
      </button>
    {/if}
  </div>
</label>
