import { derived, writable } from 'svelte/store'
import type { User } from './types'

export const user = writable<User | null>(null)

export const admin = derived(user, $user =>
  $user ? $user.permissions.includes('admin') : false
)

export const sidebarOpen = writable(false)
