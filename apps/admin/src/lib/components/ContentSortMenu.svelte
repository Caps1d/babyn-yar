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
      sortValue: 'occured_on',
      name: 'Дата проведення',
      icon: ArrowUpIcon
    },
    {
      sortValue: '-occured_on',
      name: 'Дата проведення',
      icon: ArrowDownIcon
    }
  ]

  const dispatch = createEventDispatcher()

  let selected = menuItems[0]

  function select(item: (typeof menuItems)[number]) {
    if (selected.sortValue === item.sortValue) return

    const sortValue =
      item.sortValue === 'default' ? defaultSort : item.sortValue
    dispatch('select', { sortValue })
    selected = item
  }
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
