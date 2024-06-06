<script lang="ts">
  import {
    Table,
    TableHeader,
    TableRow,
    TableData,
    DeleteAlertDialog,
    RegisterUserDialog,
    PageHeader,
    Container,
    RecordActionBar,
    TableSkeleton,
    Pagination
  } from '$components'
  import { UserIcon, AtSignIcon, CalendarIcon, KeyIcon } from 'lucide-svelte'
  import type { Metadata, User } from '$lib/types'
  import { admin } from '$lib/stores'
  import { onMount } from 'svelte'
  import { deleteUsers, fetchUsersWrapper } from '$lib/user'
  import { formatDate } from '$lib/format-date'
  import { addToast } from '$components/Toaster.svelte'

  let users: User[] = []
  let metadata: Metadata
  let selectedUsers: number[] = []
  let alertDialog: DeleteAlertDialog
  let isLoading = false

  const fetchUsers = fetchUsersWrapper()

  onMount(async () => {
    if ($admin) {
      isLoading = true
      const res = await fetchUsers()
      if (res.ok) {
        users = res.data.users
        metadata = res.data.metadata
      }
      isLoading = false
    }
  })

  function addUser(e: CustomEvent<{ user: User }>) {
    const { user } = e.detail
    users = [user, ...users]
  }

  function toggleSelect(id: number) {
    if (selectedUsers.includes(id)) {
      selectedUsers = selectedUsers.filter(e => e !== id)
    } else {
      selectedUsers = [...selectedUsers, id]
    }
  }

  function toggleSelectAll() {
    if (selectedUsers.length === users.length) {
      selectedUsers = []
    } else {
      selectedUsers = users.map(e => e.id)
    }
  }

  async function deleteSelected() {
    const ok = await deleteUsers(selectedUsers)
    if (!ok) {
      addToast({
        data: {
          title: 'Щось пішло не так',
          description: 'Спробуйте ще раз',
          variant: 'error'
        }
      })
      return
    }
    selectedUsers = []
    alertDialog.dismiss()
    addToast({
      data: {
        title: 'Операція успішна',
        description: 'Елементи було видалено',
        variant: 'success'
      }
    })
    const res = await fetchUsers()
    if (res.ok) {
      users = res.data.users
      metadata = res.data.metadata
    }
  }

  async function selectPage(e: CustomEvent<{ page: number }>) {
    const { page } = e.detail
    const response = await fetchUsers(page)
    if (response.ok) {
      users = response.data.users
      metadata = response.data.metadata
    }
  }
</script>

{#if $admin}
  <PageHeader>
    <svelte:fragment slot="heading">Користувачі</svelte:fragment>
    <RegisterUserDialog slot="right-items" on:register={addUser} />
  </PageHeader>

  <Container title="Управління користувачами">
    <RecordActionBar
      bind:selected={selectedUsers}
      on:delete={() => alertDialog.show()}
    />

    {#if isLoading}
      <TableSkeleton />
    {:else}
      <Table>
        <thead>
          <tr>
            <TableHeader>
              <input
                type="checkbox"
                checked={selectedUsers.length > 0 &&
                  selectedUsers.length === users.length}
                on:input={toggleSelectAll}
              />
            </TableHeader>
            <TableHeader>
              <div class="inline-flex items-center gap-2">
                <UserIcon size={16} />
                <span>Користувач</span>
              </div>
            </TableHeader>
            <TableHeader>
              <div class="inline-flex items-center gap-2">
                <AtSignIcon size={16} />
                <span>Email</span>
              </div>
            </TableHeader>
            <TableHeader>
              <div class="inline-flex items-center gap-2">
                <CalendarIcon size={16} />
                <span>Дата реєстрації</span>
              </div>
            </TableHeader>
            <TableHeader>
              <div class="inline-flex items-center gap-2">
                <KeyIcon size={16} />
                <span>Дозволи</span>
              </div>
            </TableHeader>
          </tr>
        </thead>
        <tbody>
          {#each users as user}
            <TableRow>
              <TableData>
                <input
                  type="checkbox"
                  on:input={() => toggleSelect(user.id)}
                  checked={selectedUsers.includes(user.id)}
                />
              </TableData>
              <TableData>{user.fullName}</TableData>
              <TableData>{user.email}</TableData>
              <TableData>{formatDate(user.createdAt)}</TableData>
              <TableData>{user.permissions.join(', ')}</TableData>
            </TableRow>
          {/each}
        </tbody>
        <svelte:fragment slot="pagination">
          {#if metadata}
            <Pagination
              currentPage={metadata.currentPage}
              lastPage={metadata.lastPage}
              on:select={selectPage}
            />
          {/if}
        </svelte:fragment>
      </Table>
    {/if}
  </Container>

  <DeleteAlertDialog bind:this={alertDialog} on:confirm={deleteSelected} />
{:else}
  <div class="flex h-full flex-col items-center justify-center text-center">
    <h1 class="text-xl font-semibold">У вас не має доступа до цієї сторінки</h1>
    <p class="mt-2 text-gray-400">
      Для доступа до цієї сторіни потрібно мати права адміністратора
    </p>
  </div>
{/if}
