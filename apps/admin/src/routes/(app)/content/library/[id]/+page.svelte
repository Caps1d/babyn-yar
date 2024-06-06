<script lang="ts">
  import { page } from '$app/stores'
  import {
    Input,
    LangSelect,
    CoverSelect,
    RichTextEditor,
    DocumentsSelect,
    Button,
    PageHeader,
    Container,
    NotFound,
    DatePicker
  } from '$components'
  import type { Book } from '$lib/types'
  import type { ResponseError } from '$lib/response-error'
  import { fetchBook, updateBook } from '$lib/books'
  import { onMount } from 'svelte'
  import { addToast } from '$components/Toaster.svelte'
  import { SaveIcon } from 'lucide-svelte'
  import { updateRecordSuccessMsg } from '$lib/toast-messages'

  let isSubmitting = false
  let book: Book
  let error: ResponseError | undefined

  onMount(async function () {
    const res = await fetchBook($page.params.id)
    if (res.ok) {
      book = res.book
    } else {
      error = res.error
    }
  })

  async function submit() {
    isSubmitting = true
    const body = JSON.stringify({
      occuredOn: new Date(book.occuredOn).toISOString(),
      title: book.title,
      description: book.description,
      lang: book.lang,
      cover: book.cover,
      documents: book.documents,
      content: JSON.stringify(book.content)
    })
    const response = await updateBook($page.params.id, body)
    if (!response.ok) {
      error = response.error
      isSubmitting = false
      return
    }
    addToast(updateRecordSuccessMsg)
    isSubmitting = false
    error = undefined
  }
</script>

{#if !error?.isNotFoundError()}
  <PageHeader>
    <svelte:fragment slot="heading">Редагувати запис</svelte:fragment>
    <Button slot="right-items" isLoading={isSubmitting} form="edit-record">
      <SaveIcon size={16} slot="icon" />
      Зберегти зміни
    </Button>
  </PageHeader>

  <Container title="Редагувати запис">
    {#if book}
      <form
        on:submit|preventDefault={submit}
        id="edit-record"
        class="space-y-5"
      >
        <LangSelect
          bind:lang={book.lang}
          error={error?.isFormError() ? error.error.lang : undefined}
        />
        <DatePicker bind:datetime={book.occuredOn} />
        <CoverSelect
          bind:cover={book.cover}
          error={error?.isFormError() ? error.error.cover : undefined}
        />
        <Input
          bind:value={book.title}
          name="title"
          label="Назва"
          error={error?.isFormError() ? error.error.title : undefined}
          required
        />
        <Input
          bind:value={book.description}
          name="description"
          label="Опис"
          error={error?.isFormError() ? error.error.description : undefined}
          required
        />
        <DocumentsSelect bind:documents={book.documents} />
        <div>
          <p class="mb-1.5 text-gray-500">Контент</p>
          {#if error?.isFormError() && error?.error.content}
            <p class="text-red-500">{error.error.content}</p>
          {/if}
          <RichTextEditor bind:content={book.content} />
        </div>
      </form>
    {/if}
  </Container>
{:else if error?.isNotFoundError()}
  <NotFound />
{/if}
