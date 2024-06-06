<script>
  import { onMount } from 'svelte'
  import '../app.css'
  import { PUBLIC_API_URL } from '$env/static/public'
  import { user } from '$lib/stores'
  import { Toaster } from '$components'

  let blocked = true

  onMount(async () => {
    const url = PUBLIC_API_URL + '/users/me'
    const response = await fetch(url, { credentials: 'include' })
    if (response.ok) {
      const json = await response.json()
      $user = json.user
    }
    blocked = false
  })
</script>

<svelte:head>
  <meta name="viewport" content="width=device-width,initial-scale=1" />
</svelte:head>

{#if !blocked}
  <slot />
{/if}

<Toaster />
