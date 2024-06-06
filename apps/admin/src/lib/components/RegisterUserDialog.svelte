<script lang="ts">
  import {
    Input,
    Button,
    Select,
    SelectTrigger,
    SelectMenu,
    SelectItem,
    Dialog,
    DialogTrigger,
    DialogClose,
    DialogTitle,
    DialogDescription,
    DialogContent
  } from '$components'
  import type { ResponseError } from '$lib/response-error'
  import { PlusIcon } from 'lucide-svelte'
  import { createEventDispatcher } from 'svelte'
  import { register } from '$lib/user'
  import { permissionOptions } from '$lib/select-options'
  import { addToast } from './Toaster.svelte'

  export function open() {
    dialog.show()
  }

  export function close() {
    dialog.dissmis()
  }

  let fullName: string
  let email: string
  let password: string
  let permission: string
  let isSubmitting = false
  let dialog: Dialog
  let error: ResponseError | undefined

  const dispatch = createEventDispatcher()

  async function submit() {
    isSubmitting = true
    const body = JSON.stringify({ fullName, email, password, permission })
    const response = await register(body)
    isSubmitting = false
    if (!response.ok) {
      error = response.error
      addToast({
        data: {
          title: 'Щось пішло не так',
          description: 'Спробуйте ще раз',
          variant: 'error'
        }
      })
      return
    }
    dispatch('register', { user: response.user })
    reset()
    dialog.dissmis()
  }

  function reset() {
    fullName = ''
    password = ''
    email = ''
  }
</script>

<Dialog bind:this={dialog}>
  <DialogTrigger>
    <svelte:fragment slot="text">Додати</svelte:fragment>
    <PlusIcon slot="icon" size={16} />
  </DialogTrigger>
  <DialogContent>
    <DialogTitle slot="title">Додати нового користувача</DialogTitle>
    <DialogDescription slot="description">
      Зареєструйте нового користувача, вказавши ім'я, адресу електронної пошти,
      пароль та роль. Користувач зможе потім змінити пароль у налаштуваннях.
    </DialogDescription>
    <form on:submit|preventDefault={submit} class="space-y-3">
      <Input
        label="Повне ім'я"
        name="fullName"
        bind:value={fullName}
        required
      />
      <Input
        type="email"
        label="Email"
        name="email"
        bind:value={email}
        error={error?.isFormError() ? error.error.email : undefined}
        required
      />
      <Input
        type="password"
        label="Пароль"
        name="password"
        bind:value={password}
        required
      />
      <div>
        <label for="select-role" class="mb-1.5 block text-gray-400">
          Роль
        </label>
        <Select
          bind:selected={permission}
          defaultSelected={permissionOptions[0]}
        >
          <SelectTrigger id="select-role">Обрати роль</SelectTrigger>
          <SelectMenu>
            {#each permissionOptions as { value, label }}
              <SelectItem {value} {label} />
            {/each}
          </SelectMenu>
        </Select>
        <div class="flex justify-end pt-2">
          <Button isLoading={isSubmitting}>Додати</Button>
        </div>
      </div>
    </form>
    <DialogClose isDisabled={isSubmitting} />
  </DialogContent>
</Dialog>
