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
  import type { VictimTestimony } from '$lib/types'
  import type { ResponseError } from '$lib/response-error'
  import { fetchTestimony, updateTestimony } from '$lib/testimonies'
  import { onMount } from 'svelte'
  import { addToast } from '$components/Toaster.svelte'
  import { SaveIcon } from 'lucide-svelte'
  import { updateRecordSuccessMsg } from '$lib/toast-messages'

  let isSubmitting = false
  let testimony: VictimTestimony
  let error: ResponseError | undefined

  onMount(async function () {
    const res = await fetchTestimony($page.params.id)
    if (res.ok) {
      testimony = res.testimony
    } else {
      error = res.error
    }
  })

  async function submit() {
    isSubmitting = true
    const body = JSON.stringify({
      title: testimony.title,
      description: testimony.description,
      lang: testimony.lang,
      cover: testimony.cover,
      documents: testimony.documents,
      content: JSON.stringify(testimony.content),
      occuredOn: new Date(testimony.occuredOn).toISOString()
    })
    const response = await updateTestimony($page.params.id, body)
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
    <svelte:fragment slot="heading">Редагування запису</svelte:fragment>
    <Button
      slot="right-items"
      isLoading={isSubmitting}
      loadingText="Збереження..."
      form="edit-record"
    >
      <SaveIcon size={16} slot="icon" />
      Зберегти зміни
    </Button>
  </PageHeader>

  <Container title="Редагування запису">
    {#if testimony}
      <form
        on:submit|preventDefault={submit}
        id="edit-record"
        class="space-y-5"
      >
        <LangSelect
          bind:lang={testimony.lang}
          error={error?.isFormError() ? error.error.lang : undefined}
        />
        <DatePicker bind:datetime={testimony.occuredOn} />
        <CoverSelect
          bind:cover={testimony.cover}
          error={error?.isFormError() ? error.error.cover : undefined}
        />
        <Input
          bind:value={testimony.title}
          name="title"
          label="Назва"
          error={error?.isFormError() ? error.error.title : undefined}
          required
        />
        <Input
          bind:value={testimony.description}
          name="description"
          label="Опис"
          error={error?.isFormError() ? error.error.description : undefined}
          required
        />
        <DocumentsSelect bind:documents={testimony.documents} />
        <div>
          <p class="mb-1.5 text-gray-500">Контент</p>
          {#if error?.isFormError() && error?.error.content}
            <p class="text-red-500">{error.error.content}</p>
          {/if}
          <RichTextEditor bind:content={testimony.content} />
        </div>
      </form>
    {/if}
  </Container>
{:else if error.isNotFoundError()}
  <NotFound />
{/if}
