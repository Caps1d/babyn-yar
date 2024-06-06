<script lang="ts">
  import {
    DeleteAlertDialog,
    Table,
    TableData,
    TableHeader,
    TableRow,
    LinkButton,
    PageHeader,
    Container,
    RecordActionBar,
    TableSkeleton,
    Pagination,
    SearchBar,
    ContentSortMenu
  } from '$components'
  import { File, Plus, History, User } from 'lucide-svelte'
  import { formatDate } from '$lib/format-date'
  import { trimText } from '$lib/trim-text'
  import type { Metadata, VictimTestimony } from '$lib/types'
  import { onMount } from 'svelte'
  import {
    fetchTestimoniesWrapper,
    deleteTestimonies,
    type Filters
  } from '$lib/testimonies'
  import { addToast } from '$components/Toaster.svelte'
  import {
    deleteSuccessMsg,
    deleteErrorMsg,
    fetchErrorMsg
  } from '$lib/toast-messages'
  import { calculateNewPage } from '$lib/pagination'

  let testimonies: VictimTestimony[] = []
  let metadata: Metadata
  let selected: number[] = []
  let alertDialog: DeleteAlertDialog
  let isLoading = false

  const fetchTestimonies = fetchTestimoniesWrapper()

  onMount(async () => {
    isLoading = true
    await load()
    isLoading = false
  })

  async function load(pageNum = 1, filters: Filters | undefined = undefined) {
    const response = await fetchTestimonies(pageNum, filters)
    if (!response.ok) {
      addToast(fetchErrorMsg)
      return
    }
    testimonies = response.data.testimonies
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
    if (selected.length === testimonies.length) {
      selected = []
    } else {
      selected = testimonies.map(t => t.id)
    }
  }

  async function deleteSelected() {
    const ok = await deleteTestimonies(selected)
    if (!ok) {
      addToast(deleteErrorMsg)
      return
    }

    addToast(deleteSuccessMsg)
    selected = []
    alertDialog.dismiss()

    await load()
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
  <svelte:fragment slot="heading">Свідчення очевидців трагедії</svelte:fragment>
  <LinkButton slot="right-items" href="/content/victim-testimonies/create">
    <Plus slot="icon" size={16} />
    Cтворити
  </LinkButton>
</PageHeader>

<Container title="Свідчення очевидців трагедії">
  <div class="mb-5">
    <SearchBar>
      <ContentSortMenu slot="filters" on:select={sort} />
    </SearchBar>
  </div>
  <RecordActionBar bind:selected on:delete={() => alertDialog.show()} />
  {#if testimonies.length === 0 || isLoading}
    <TableSkeleton />
  {:else}
    <Table>
      <thead>
        <tr>
          <TableHeader>
            <input
              type="checkbox"
              checked={selected.length === testimonies.length &&
                selected.length > 0}
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
        {#each testimonies as testimony}
          <TableRow>
            <TableData>
              <input
                type="checkbox"
                on:input={() => toggleSelect(testimony.id)}
                checked={selected.includes(testimony.id)}
              />
            </TableData>
            <TableData class="w-full">
              <a href={`/content/victim-testimonies/${testimony.id}`}>
                {trimText(testimony.title)}
              </a>
            </TableData>
            <TableData>{formatDate(testimony.updatedAt)}</TableData>
            <TableData>{testimony.user.fullName}</TableData>
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
