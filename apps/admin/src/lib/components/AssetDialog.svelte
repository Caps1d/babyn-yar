<script lang="ts">
  import {
    Dialog,
    DialogTitle,
    DialogDescription,
    DialogContent,
    DialogClose,
    SearchBar,
    AssetGrid,
    AssetSortMenu,
    AssetItem,
    Button
  } from '$components'
  import { fetchAssetsWrapper, type Filters } from '$lib/assets'
  import type { Asset, Metadata } from '$lib/types'
  import { createEventDispatcher } from 'svelte'
  import { RefreshCcw } from 'lucide-svelte'
  import { addToast } from './Toaster.svelte'
  import { fetchErrorMsg } from '$lib/toast-messages'

  export async function open(type: string) {
    isLoading = true
    assets = []
    dialog.show()
    await load(1, { contentType: type })
    contentType = type
    isLoading = false
  }

  export function close() {
    dialog.dissmis()
  }

  let assets: Asset[] = []
  let metadata: Metadata
  let contentType: string
  let dialog: Dialog
  let isLoading = false
  let isLoadingMore = false

  const fetchAssets = fetchAssetsWrapper()

  const dispatch = createEventDispatcher<{
    select: { url: string; type: string; fileName: string }
  }>()

  async function load(pageNum = 1, filters: Filters | undefined = undefined) {
    const response = await fetchAssets(pageNum, filters)
    if (!response.ok) {
      addToast(fetchErrorMsg)
      return
    }
    assets = response.data.assets
    metadata = response.data?.metadata
  }

  async function sort(e: CustomEvent<string>) {
    await load(1, { sort: e.detail })
  }

  async function search(e: CustomEvent<{ search: string }>) {
    await load(1, { contentType, filename: e.detail.search })
  }

  function selectAsset(url: string, contentType: string, fileName: string) {
    let type = ''
    if (contentType.startsWith('image')) {
      type = 'image'
    } else if (contentType.startsWith('video')) {
      type = 'video'
    }
    dispatch('select', { url, type, fileName })
  }

  async function loadMore() {
    isLoadingMore = true
    const res = await fetchAssets(metadata.currentPage + 1)
    isLoadingMore = false
    if (!res.ok) {
      addToast(fetchErrorMsg)
      return
    }
    assets = [...assets, ...res.data.assets]
    metadata = res.data.metadata
  }
</script>

<Dialog bind:this={dialog} size="lg">
  <DialogContent>
    <DialogTitle slot="title">Медіа файли</DialogTitle>
    <DialogDescription slot="description">
      Оберіть потрібний файл
    </DialogDescription>
    <div class="mb-5">
      <SearchBar on:search={search}>
        <AssetSortMenu slot="filters" on:select={sort} />
      </SearchBar>
    </div>
    <div class="h-[85%] overflow-y-auto pb-20 pr-3">
      <AssetGrid>
        {#each assets as asset}
          <li class="p-2.5">
            <button
              class="group relative w-full"
              on:click={() =>
                selectAsset(asset.url, asset.contentType, asset.fileName)}
            >
              <AssetItem
                src={asset.url}
                fileName={asset.fileName}
                contentType={asset.contentType}
              />
            </button>
          </li>
        {:else}
          {#if !isLoading}
            <div
              class="flex flex-col justify-center items-center h-full col-span-full w-full"
            >
              <p class="text-gray-500 font-medium text-center text-lg">
                Вибачте, ми не змогли знайти жодного файлу за вашими критеріями
              </p>
            </div>
          {/if}
        {/each}
      </AssetGrid>
      {#if metadata && metadata.currentPage !== metadata.lastPage}
        <div class="pt-8">
          <div class="flex min-w-full items-center justify-center">
            <Button
              on:click={loadMore}
              isLoading={isLoadingMore}
              variant="soft"
            >
              <RefreshCcw slot="icon" class="h-4 w-4" />
              Показати ще
            </Button>
          </div>
        </div>
      {/if}
    </div>
    <DialogClose />
  </DialogContent>
</Dialog>
