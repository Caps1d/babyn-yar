<script lang="ts">
  import {
    Input,
    RichTextEditor,
    LangSelect,
    CoverSelect,
    DocumentsSelect,
    Button,
    PageHeader,
    Container,
    DatePicker
  } from '$components'
  import type { ResponseError } from '$lib/response-error'
  import type { JSONContent } from '@tiptap/core'
  import { createBook } from '$lib/books'
  import { PlusIcon } from 'lucide-svelte'
  import { addToast } from '$components/Toaster.svelte'
  import { goto } from '$app/navigation'
  import { createRecordSuccessMsg } from '$lib/toast-messages'

  let isSubmitting = false
  let content: JSONContent
  let title = ''
  let description = ''
  let lang = ''
  let cover = ''
  let documents: string[] = []
  let occuredOn = ''
  let error: ResponseError | undefined

  async function submit() {
    isSubmitting = true
    const body = JSON.stringify({
      title,
      description,
      lang,
      cover,
      documents,
      occuredOn: new Date(occuredOn).toISOString(),
      content: JSON.stringify(content)
    })
    const response = await createBook(body)
    if (!response.ok) {
      error = response.error
      isSubmitting = false
      return
    }
    addToast(createRecordSuccessMsg)
    isSubmitting = false
    error = undefined
    goto('/content/library')
  }
</script>

<svelte:head>
  <title>Створити новий запис</title>
</svelte:head>

<PageHeader>
  <svelte:fragment slot="heading">Новий запис</svelte:fragment>
  <Button
    slot="right-items"
    isLoading={isSubmitting}
    loadingText="Створення..."
    form="create-record"
  >
    <PlusIcon size={16} slot="icon" />
    Створити
  </Button>
</PageHeader>

<Container title="Створити новий запис">
  <form id="create-record" on:submit|preventDefault={submit} class="space-y-5">
    <LangSelect
      bind:lang
      error={error?.isFormError() ? error.error.lang : undefined}
    />
    <DatePicker bind:datetime={occuredOn} />
    <CoverSelect
      bind:cover
      error={error?.isFormError() ? error.error.cover : undefined}
    />
    <Input
      name="title"
      label="Назва"
      error={error?.isFormError() ? error.error.title : undefined}
      bind:value={title}
      required
    />
    <Input
      name="description"
      label="Опис"
      error={error?.isFormError() ? error.error.description : undefined}
      bind:value={description}
      required
    />
    <DocumentsSelect bind:documents />
    <div>
      <p class="mb-1.5 text-gray-500">Контент</p>
      {#if error?.isFormError() && error?.error.content}
        <p class="text-red-500">{error.error.content}</p>
      {/if}
      <RichTextEditor bind:content />
    </div>
  </form>
</Container>
