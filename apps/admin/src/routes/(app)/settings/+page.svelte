<script lang="ts">
  import { Input, PageHeader, Container, Button } from '$components'
  import { addToast } from '$components/Toaster.svelte'
  import { updateUser } from '$lib/user'
  import { user } from '$lib/stores'
  import type { UserErrorResponse } from '$lib/types'

  let fullName: string = $user?.fullName as string
  let email: string = $user?.email as string
  let password: string
  let isSubmitting = false
  let errors: UserErrorResponse | undefined = undefined

  async function submit() {
    isSubmitting = true
    const res = await updateUser(fullName, email, password)
    if (res.ok) {
      $user = res.user
      isSubmitting = false
      return
    }
    if (res.status && res.status === 422) {
      errors = res.error
    } else {
      addToast({
        data: {
          title: 'Помилка!',
          description: res.error,
          variant: 'error'
        }
      })
    }
    isSubmitting = false
  }
</script>

<PageHeader>
  <svelte:fragment slot="heading">Налаштування</svelte:fragment>
</PageHeader>

<Container title="Налаштування">
  <div class="flex flex-col items-center">
    <div class="mx-auto w-full max-w-xl">
      <div class="rounded-md border bg-white p-6 shadow md:p-12">
        <form on:submit|preventDefault={submit} class="space-y-5">
          <Input
            bind:value={fullName}
            label="Повне ім'я"
            name="fullName"
            error={errors?.fullName}
          />
          <Input
            bind:value={email}
            type="email"
            label="Email"
            name="email"
            error={errors?.email}
          />
          <Input
            bind:value={password}
            type="password"
            label="Новий пароль"
            name="password"
            error={errors?.password}
          />
          <Button isLoading={isSubmitting} class="w-full justify-center">
            Зберегти зміни
          </Button>
        </form>
      </div>
    </div>
  </div>
</Container>
