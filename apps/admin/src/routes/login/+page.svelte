<script lang="ts">
  import { login } from '$lib/user'
  import { user } from '$lib/stores'
  import { goto } from '$app/navigation'
  import { Button, Input } from '$components'
  import { addToast } from '$components/Toaster.svelte'

  let email: string
  let password: string
  let isSubmitting = false

  $: $user && goto('/content')

  async function submit() {
    isSubmitting = true
    const res = await login(email, password)
    if (res.ok) {
      $user = res.user
      goto('/')
      return
    }
    if (res.error.isUnauthorized()) {
      addToast({
        data: {
          title: 'Непавильно ввдені дані',
          description: 'Email або пароль введено неправильно',
          variant: 'error'
        }
      })
    } else if (res.error.isServerError()) {
      addToast({
        data: {
          title: 'Помилка',
          description: 'Сталася помикла. Cпробуйте, будь-ласка, ще раз',
          variant: 'error'
        }
      })
    }
    isSubmitting = false
  }
</script>

<div class="flex min-h-screen flex-col bg-gray-50 text-gray-900">
  <div class="flex flex-1 flex-col justify-center">
    <div class="mx-auto w-full max-w-[28rem]">
      <h2 class="text-center text-2xl font-bold tracking-tight">
        Увійдіть у свій обліковий запис
      </h2>
    </div>
    <div class="mx-auto mt-10 w-full max-w-md">
      <div class="rounded-lg border bg-white p-6 shadow md:p-12">
        <form
          on:submit|preventDefault={submit}
          class="mx-auto max-w-md space-y-6"
        >
          <Input
            name="email"
            type="email"
            label="Email"
            bind:value={email}
            required
          />
          <Input
            name="password"
            type="password"
            label="Пароль"
            bind:value={password}
            required
          />
          <Button isLoading={isSubmitting} class="w-full justify-center">
            Продовжити
          </Button>
        </form>
      </div>
    </div>
  </div>
</div>
