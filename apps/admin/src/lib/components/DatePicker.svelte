<script lang="ts">
  import { createDatePicker, melt } from '@melt-ui/svelte'
  import { jsDateToCalendarDate } from '$lib/format-date'
  import {
    ChevronLeftIcon,
    ChevronRightIcon,
    CalendarIcon
  } from 'lucide-svelte'

  export let datetime: string | undefined

  let date = datetime ? new Date(datetime) : new Date()

  const {
    elements: {
      calendar,
      cell,
      content,
      field,
      heading,
      grid,
      label,
      nextButton,
      prevButton,
      segment,
      trigger
    },
    states: { months, headingValue, weekdays, segmentContents, value },
    helpers: { isDateDisabled, isDateUnavailable },
    options: { locale }
  } = createDatePicker({
    defaultValue: jsDateToCalendarDate(date),
    locale: 'uk-UA'
  })

  $: datetime = $value?.toString()
</script>

<div>
  <span use:melt={$label} class="block text-gray-500">Дата</span>
  <div
    use:melt={$field}
    class="mt-0.5 flex min-w-[220px] max-w-[220px] items-center rounded border bg-white p-1.5 text-gray-800 hover:border-sky-400"
  >
    {#key $locale}
      {#each $segmentContents as seg}
        <span
          use:melt={$segment(seg.part)}
          class="rounded focus:outline-none focus:ring-2 focus:ring-sky-300"
        >
          {seg.value}
        </span>
      {/each}
    {/key}
    <div>
      <button
        type="button"
        use:melt={$trigger}
        aria-label="Open calendar"
        class="rounded-md bg-indigo-50 p-1 text-indigo-700 transition-colors hover:bg-indigo-100 hover:text-indigo-800 focus:outline-none focus:ring-2 focus:ring-indigo-300"
      >
        <CalendarIcon size={16} />
      </button>
    </div>
  </div>
</div>

<div
  use:melt={$content}
  class="shadow-sm; z-10 min-w-[320px] rounded-lg bg-white"
>
  <div
    use:melt={$calendar}
    class="shadow-md; w-full rounded-lg border bg-white p-3 text-gray-700"
  >
    <header class="flex items-center justify-between pb-2">
      <button
        type="button"
        use:melt={$prevButton}
        class="rounded-lg p-1 transition-colors hover:bg-indigo-100 hover:text-indigo-800 data-[disabled]:pointer-events-none data-[disabled]:opacity-40"
      >
        <ChevronLeftIcon size={24} />
      </button>
      <div use:melt={$heading} class="gap-6; flex items-center font-semibold">
        {$headingValue}
      </div>
      <button
        type="button"
        use:melt={$nextButton}
        class="rounded-lg p-1 transition-colors hover:bg-indigo-100 hover:text-indigo-800 data-[disabled]:pointer-events-none data-[disabled]:opacity-40"
      >
        <ChevronRightIcon size={24} />
      </button>
    </header>
    <div>
      {#each $months as month}
        <table use:melt={$grid} class="w-full">
          <thead aria-hidden="true">
            <tr>
              {#each $weekdays as day}
                <th class="text-sm font-semibold">
                  <div
                    class="flex h-6 w-6 select-none items-center justify-center p-4 text-gray-500"
                  >
                    {day}
                  </div>
                </th>
              {/each}
            </tr>
          </thead>
          <tbody>
            {#each month.weeks as weekDates}
              <tr>
                {#each weekDates as date}
                  <td
                    role="gridcell"
                    class="p-1"
                    aria-disabled={$isDateDisabled(date) ||
                      $isDateUnavailable(date)}
                  >
                    <div use:melt={$cell(date, month.value)} class="cell">
                      {date.day}
                    </div>
                  </td>
                {/each}
              </tr>
            {/each}
          </tbody>
        </table>
      {/each}
    </div>
  </div>
</div>

<style lang="postcss">
  .cell {
    @apply flex h-6 w-6 cursor-pointer select-none items-center justify-center rounded-lg p-4;
    @apply hover:bg-indigo-100 focus:outline-none focus:ring focus:ring-indigo-400;
  }

  .cell[data-selected] {
    @apply bg-indigo-100 text-indigo-800;
  }

  .cell[data-disabled] {
    @apply pointer-events-none opacity-40;
  }

  .cell[data-unavailable] {
    @apply pointer-events-none text-red-400 line-through;
  }

  .cell[data-outside-visible-months] {
    @apply pointer-events-none cursor-default opacity-40 hover:bg-transparent;
  }

  .cell[data-outside-month] {
    @apply pointer-events-none cursor-default opacity-0 hover:bg-transparent;
  }

  [data-melt-datefield-field] div:last-of-type {
    @apply ml-4 flex w-full items-center justify-end;
  }

  [data-melt-datefield-label][data-invalid] {
    @apply text-red-500;
  }

  [data-melt-datefield-field][data-invalid] {
    @apply border-red-400;
  }

  [data-melt-datefield-segment][data-invalid] {
    @apply text-red-500;
  }

  [data-melt-datefield-segment]:not([data-segment='literal']) {
    @apply px-0.5;
  }

  [data-melt-datefield-validation] {
    @apply self-start text-red-500;
  }
</style>
