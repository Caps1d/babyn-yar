<script lang="ts">
  import { page } from '$app/stores'
  import {
    Input,
    LangSelect,
    CoverSelect,
    RichTextEditor,
    PageHeader,
    Button,
    Container,
    NotFound,
    EditorSkeleton,
    DatePicker
  } from '$components'
  import type { Event } from '$lib/types'
  import type { ResponseError } from '$lib/response-error'
  import { fetchEvent, updateEvent } from '$lib/events'
  import { onMount } from 'svelte'
  import { addToast } from '$components/Toaster.svelte'
  import { SaveIcon } from 'lucide-svelte'

  let isSubmitting = false
  let isLoading = false
  let event: Event
  let error: ResponseError | undefined

  onMount(async function () {
    isLoading = true
    const response = await fetchEvent($page.params.slug)
    if (response.ok) {
      event = response.event
      isLoading = false
      return
    }
    error = response.error
    isLoading = false
  })

  async function submit() {
    isSubmitting = true
    const body = JSON.stringify({
      title: event.title,
      description: event.description,
      lang: event.lang,
      cover: event.cover,
      content: JSON.stringify(event.content),
      occuredOn: new Date(event.occuredOn).toISOString()
    })
    const response = await updateEvent($page.params.slug, body)
    isSubmitting = false
    if (!response.ok) {
      error = response.error
      return
    }
    addToast({
      data: {
        title: 'Чудово!',
        description: 'Ваші зміни було збережено',
        variant: 'success'
      }
    })
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
  <Container title="Редагувати запис">
    {#if !event || isLoading}
      <EditorSkeleton />
    {:else}
      <form
        on:submit|preventDefault={submit}
        id="edit-record"
        class="space-y-5"
      >
        <LangSelect
          bind:lang={event.lang}
          error={error?.isFormError() ? error.error.lang : undefined}
        />
        <DatePicker bind:datetime={event.occuredOn} />
        <CoverSelect
          bind:cover={event.cover}
          error={error?.isFormError() ? error.error.cover : undefined}
        />
        <Input
          bind:value={event.title}
          name="title"
          label="Назва"
          error={error?.isFormError() ? error.error.title : undefined}
        />
        <Input
          bind:value={event.description}
          name="description"
          label="Опис"
          error={error?.isFormError() ? error.error.description : undefined}
        />
        <div>
          <p class="mb-1.5 text-gray-500">Контент</p>
          {#if error?.isFormError() && error?.error.content}
            <p class="text-red-500">{error.error.content}</p>
          {/if}
          <RichTextEditor bind:content={event.content} />
        </div>
      </form>
    {/if}
  </Container>
{:else if error?.isNotFoundError()}
  <NotFound />
{/if}
