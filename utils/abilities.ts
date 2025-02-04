import type { User } from '#auth-utils'
import { defineAbility } from 'nuxt-authorization/utils'

export const readClosed = defineAbility((user: User) => {
  return ['project', 'admin'].includes(user.role)
}) // Only project members and admins can read closed texts

export const editTranslations = defineAbility((user: User) => {
  return user.role === 'admin' || ['oesterreich@saw-leipzig.de'].includes(user.email)
})

// We don't need this ability right now since access to the reading page is handled directly by the auth middleware
// export const readOpen = defineAbility(() => true) // Only authenticated users can read texts
