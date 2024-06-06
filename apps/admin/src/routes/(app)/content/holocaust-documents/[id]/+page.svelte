<script lang="ts">
  import { page } from '$app/stores'
  import {
    Input,
    LangSelect,
    CoverSelect,
    RichTextEditor,
    Button,
    PageHeader,
    Container,
    NotFound,
    DatePicker
  } from '$components'
  import type { HolocaustDocument } from '$lib/types'
  import type { ResponseError } from '$lib/response-error'
  import {
    fetchHolocaustDocument,
    updateHolocaustDocument
  } from '$lib/holocaust-documents'
  import { onMount } from 'svelte'
  import { addToast } from '$components/Toaster.svelte'
  import { SaveIcon } from 'lucide-svelte'
  import { updateRecordSuccessMsg } from '$lib/toast-messages'

  let isSubmitting = false
  let doc: HolocaustDocument
  let error: ResponseError | undefined

  onMount(async function () {
    const response = await fetchHolocaustDocument($page.params.id)
    if (response.ok) {
      doc = response.document
    } else {
      error = response.error
    }
  })

  async function submit() {
    isSubmitting = true
    const body = JSON.stringify({
      title: doc.title,
      occuredOn: new Date(doc.occuredOn).toISOString(),
      description: doc.description,
      lang: doc.lang,
      cover: doc.cover,
      content: JSON.stringify(doc.content)
    })
    const response = await updateHolocaustDocument($page.params.id, body)
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
    {#if doc}
      <form
        on:submit|preventDefault={submit}
        id="edit-record"
        class="space-y-5"
      >
        <LangSelect
          bind:lang={doc.lang}
          error={error?.isFormError() ? error.error.lang : undefined}
        />
        <DatePicker bind:datetime={doc.occuredOn} />
        <CoverSelect
          bind:cover={doc.cover}
          error={error?.isFormError() ? error.error.cover : undefined}
        />
        <Input
          bind:value={doc.title}
          name="title"
          label="Назва"
          error={error?.isFormError() ? error.error.title : undefined}
          required
        />
        <Input
          bind:value={doc.description}
          name="description"
          label="Опис"
          error={error?.isFormError() ? error.error.description : undefined}
          required
        />
        <div>
          <p class="mb-1.5 text-gray-500">Контент</p>
          {#if error?.isFormError() && error?.error.content}
            <p class="text-red-500">{error.error.content}</p>
          {/if}
          <RichTextEditor bind:content={doc.content} />
        </div>
      </form>
    {/if}
  </Container>
{:else if error?.isNotFoundError()}
  <NotFound />
{/if}
