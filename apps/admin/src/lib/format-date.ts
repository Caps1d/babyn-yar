import { CalendarDate } from '@internationalized/date'

export function formatDate(dateString: string) {
  const date = new Date(dateString)

  const dateOpts = {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  } as const

  return new Intl.DateTimeFormat('uk-UA', dateOpts).format(date)
}

export function jsDateToCalendarDate(jsDate: Date) {
  return new CalendarDate(
    jsDate.getFullYear(),
    jsDate.getMonth() + 1,
    jsDate.getDate()
  )
}
