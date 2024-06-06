<script lang="ts">
  import {
    Table,
    TableData,
    TableHeader,
    TableRow,
    DeleteAlertDialog,
    Container,
    PageHeader,
    LinkButton,
    RecordActionBar,
    TableSkeleton,
    SearchBar,
    Pagination,
    ContentSortMenu,
    EmptySearchMessage
  } from '$components'
  import { File, Plus, History, User } from 'lucide-svelte'
  import { formatDate } from '$lib/format-date'
  import { trimText } from '$lib/trim-text'
  import type { Event, Metadata } from '$lib/types'
  import { onMount } from 'svelte'
  import { deleteEvents, fetchEventsWrapper, type Filters } from '$lib/events'
  import { addToast } from '$components/Toaster.svelte'
  import {
    deleteSuccessMsg,
    deleteErrorMsg,
    fetchErrorMsg
  } from '$lib/toast-messages'
  import { calculateNewPage } from '$lib/pagination'

  let isLoading = false
  let events: Event[] = []
  let metadata: Metadata
  let selected: number[] = []
  let alertDialog: DeleteAlertDialog

  const fetchEvents = fetchEventsWrapper()

  onMount(async () => {
    isLoading = true
    await load()
    isLoading = false
  })

  async function load(pageNum = 1, filters: Filters | undefined = undefined) {
    const res = await fetchEvents(pageNum, filters)
    if (!res.ok) {
      addToast(fetchErrorMsg)
      return
    }
    events = res.data.events
    metadata = res.data.metadata
  }

  async function search(e: CustomEvent<{ search: string }>) {
    await load(1, { title: e.detail.search })
  }

  async function sort(e: CustomEvent<{ sortValue: string }>) {
    await load(1, { sort: e.detail.sortValue })
  }

  function toggleSelect(id: number) {
    if (selected.includes(id)) {
      selected = selected.filter(e => e !== id)
    } else {
      selected = [...selected, id]
    }
  }

  function toggleSelectAll() {
    if (selected.length === events.length) {
      selected = []
    } else {
      selected = events.map(e => e.id)
    }
  }

  async function deleteSelected() {
    const ok = await deleteEvents(selected)
    if (!ok) {
      addToast(deleteErrorMsg)
      return
    }

    addToast(deleteSuccessMsg)
    selected = []
    alertDialog.dismiss()

    await load()
  }

  async function selectPage(e: CustomEvent<{ page: number }>) {
    const { page } = e.detail
    await load(page)
  }

  async function selectPageSize(e: CustomEvent<{ size: number }>) {
    const newPageSize = e.detail.size
    const { currentPage, pageSize: currentPageSize } = metadata

    if (newPageSize === currentPageSize) return

    const page = calculateNewPage(currentPage, currentPageSize, newPageSize)

    await load(page, { pageSize: newPageSize })
  }
</script>

<PageHeader>
  <svelte:fragment slot="heading">Події</svelte:fragment>
  <LinkButton slot="right-items" href="/content/events/create">
    <Plus slot="icon" size={16} />
    Cтворити
  </LinkButton>
</PageHeader>

<Container title="Події">
  <div class="mb-5">
    <SearchBar on:search={search}>
      <ContentSortMenu slot="filters" on:select={sort} />
    </SearchBar>
  </div>
  <RecordActionBar bind:selected on:delete={() => alertDialog.show()} />
  {#if events.length === 0 && isLoading}
    <TableSkeleton />
  {:else if events.length === 0 && !isLoading}
    <div class="mt-10">
      <EmptySearchMessage />
    </div>
  {:else}
    <Table>
      <thead>
        <tr>
          <TableHeader>
            <input
              type="checkbox"
              checked={selected.length === events.length && selected.length > 0}
              on:input={toggleSelectAll}
            />
          </TableHeader>
          <TableHeader>
            <div class="inline-flex items-center gap-2">
              <File size={16} />
              <span>Сторінка</span>
            </div>
          </TableHeader>
          <TableHeader>
            <div class="flex items-center gap-2">
              <History size={16} />
              <span>Остання зміна</span>
            </div>
          </TableHeader>
          <TableHeader>
            <div class="inline-flex items-center gap-2">
              <User size={16} />
              <span>Автор</span>
            </div>
          </TableHeader>
        </tr>
      </thead>
      <tbody>
        {#each events as event}
          <TableRow>
            <TableData>
              <input
                type="checkbox"
                on:input={() => toggleSelect(event.id)}
                checked={selected.includes(event.id)}
              />
            </TableData>
            <TableData class="w-full">
              <a href={`/content/events/${event.id}`} class="block w-full">
                {trimText(event.title)}
              </a>
            </TableData>
            <TableData>{formatDate(event.updatedAt)}</TableData>
            <TableData>{event.user.fullName}</TableData>
          </TableRow>
        {/each}
      </tbody>
      <svelte:fragment slot="pagination">
        {#if metadata}
          <Pagination
            currentPage={metadata.currentPage}
            lastPage={metadata.lastPage}
            on:select={selectPage}
            on:selectSize={selectPageSize}
          />
        {/if}
      </svelte:fragment>
    </Table>
  {/if}
</Container>

<DeleteAlertDialog bind:this={alertDialog} on:confirm={deleteSelected} />
