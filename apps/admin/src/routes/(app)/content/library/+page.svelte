<script lang="ts">
  import {
    DeleteAlertDialog,
    Table,
    TableData,
    TableHeader,
    TableRow,
    PageHeader,
    Container,
    LinkButton,
    RecordActionBar,
    TableSkeleton,
    Pagination,
    SearchBar,
    ContentSortMenu,
    EmptySearchMessage
  } from '$components'
  import { File, Plus, History, User } from 'lucide-svelte'
  import { formatDate } from '$lib/format-date'
  import { trimText } from '$lib/trim-text'
  import type { Metadata, VictimTestimony } from '$lib/types'
  import { onMount } from 'svelte'
  import { fetchBooksWrapper, deleteBooks, type Filters } from '$lib/books'
  import { addToast } from '$components/Toaster.svelte'
  import {
    deleteErrorMsg,
    deleteSuccessMsg,
    fetchErrorMsg
  } from '$lib/toast-messages'
  import { calculateNewPage } from '$lib/pagination'

  let books: VictimTestimony[] = []
  let metadata: Metadata
  let selected: number[] = []
  let alertDialog: DeleteAlertDialog
  let isLoading = false

  const fetchBooks = fetchBooksWrapper()

  onMount(async () => {
    isLoading = true
    await load()
    isLoading = false
  })

  async function load(pageNum = 1, filters: Filters | undefined = undefined) {
    const response = await fetchBooks(pageNum, filters)
    if (!response.ok) {
      addToast(fetchErrorMsg)
      return
    }
    books = response.data.books
    metadata = response.data.metadata
  }

  function toggleSelect(id: number) {
    if (selected.includes(id)) {
      selected = selected.filter(t => t !== id)
    } else {
      selected = [...selected, id]
    }
  }

  function toggleSelectAll() {
    if (selected.length === books.length) {
      selected = []
    } else {
      selected = books.map(t => t.id)
    }
  }

  async function deleteSelected() {
    const { ok } = await deleteBooks(selected)
    if (!ok) {
      addToast(deleteErrorMsg)
      return
    }

    selected = []
    alertDialog.dismiss()
    addToast(deleteSuccessMsg)

    await load()
  }

  async function search(e: CustomEvent<{ search: string }>) {
    await load(1, { title: e.detail.search })
  }

  async function sort(e: CustomEvent<{ sortValue: string }>) {
    await load(1, { sort: e.detail.sortValue })
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
  <svelte:fragment slot="heading">Бібліотека</svelte:fragment>
  <LinkButton slot="right-items" href="/content/library/create">
    <Plus slot="icon" size={16} />
    Cтворити
  </LinkButton>
</PageHeader>

<Container title="Бібліотека">
  <div class="mb-5">
    <SearchBar on:search={search}>
      <ContentSortMenu slot="filters" on:select={sort} />
    </SearchBar>
  </div>
  <RecordActionBar bind:selected on:delete={() => alertDialog.show()} />
  {#if isLoading}
    <TableSkeleton />
  {:else if !isLoading && books.length === 0}
    <EmptySearchMessage />
  {:else}
    <Table>
      <thead>
        <tr>
          <TableHeader>
            <input
              type="checkbox"
              checked={selected.length === books.length && selected.length > 0}
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
        {#each books as book}
          <TableRow>
            <TableData>
              <input
                type="checkbox"
                on:input={() => toggleSelect(book.id)}
                checked={selected.includes(book.id)}
              />
            </TableData>
            <TableData class="w-full">
              <a href={`/content/library/${book.id}`}>{trimText(book.title)}</a>
            </TableData>
            <TableData>{formatDate(book.updatedAt)}</TableData>
            <TableData>{book.user.fullName}</TableData>
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
