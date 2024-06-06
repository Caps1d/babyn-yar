<script lang="ts">
  import {
    SortDropdown,
    SortDropdownMenu,
    SortDropdownItem,
    SortDropdownTrigger
  } from '$components'
  import { ArrowDownIcon, ArrowUpIcon } from 'lucide-svelte'
  import { createEventDispatcher } from 'svelte'

  const defaultSort = '-created_at'

  const menuItems = [
    {
      sortValue: 'default',
      name: 'За замовчуванням'
    },
    {
      sortValue: 'created_at',
      name: 'Дата створення',
      icon: ArrowUpIcon
    },
    {
      sortValue: '-created_at',
      name: 'Дата створення',
      icon: ArrowDownIcon
    },
    {
      sortValue: 'file_name',
      name: 'Назва файлу',
      icon: ArrowUpIcon
    },
    {
      sortValue: '-file_name',
      name: 'Назва файлу',
      icon: ArrowDownIcon
    }
  ]

  type EventDispatcher = {
    select: string
  }

  let selected = menuItems[0]

  function select(item: (typeof menuItems)[number]) {
    if (selected.sortValue === item.sortValue) return

    const sortsortValue =
      item.sortValue === 'default' ? defaultSort : item.sortValue
    dispatch('select', sortsortValue)
    selected = item
  }

  const dispatch = createEventDispatcher<EventDispatcher>()
</script>

<SortDropdown>
  <SortDropdownTrigger icon={selected.icon}>
    {selected.name}
  </SortDropdownTrigger>
  <SortDropdownMenu>
    {#each menuItems as item}
      <SortDropdownItem
        icon={item.icon}
        on:select={() => select(item)}
        active={item.sortValue === selected.sortValue}
      >
        {item.name}
      </SortDropdownItem>
    {/each}
  </SortDropdownMenu>
</SortDropdown>
