import Database from 'better-sqlite3'
import cryptoRandomString from 'crypto-random-string'
import bcrypt from 'bcrypt'

export const db = new Database('database.sqlite')

export const changeUserEmail = (newEmail: string, userId: string) => {
  try {
    const emailChange = db.prepare('UPDATE users SET email=? WHERE id=?').run(newEmail, userId)
    return emailChange.changes === 1
  } catch {
    return false
  }
}

export const changeUserLocale = (newLocale: string, userId: string) => {
  try {
    const localeChange = db.prepare('UPDATE users SET locale=? WHERE id=?').run(newLocale, userId)
    return localeChange.changes === 1
  } catch {
    return false
  }
}
export const changeUserNotification = (newStatus: number, userId: string) => {
  try {
    const updateChange = db
      .prepare('UPDATE users SET wants_updates=? WHERE id=?')
      .run(newStatus, userId)
    return updateChange.changes === 1
  } catch {
    return false
  }
}

export const changeUserPassword = async (newPassword: string, userId: string) => {
  const passwordHash = await bcrypt.hash(newPassword, 10)
  try {
    const passwordChanges = db
      .prepare('UPDATE users SET password=? WHERE id=?')
      .run(passwordHash, userId)
    return passwordChanges.changes === 1
  } catch {
    return false
  }
}

export const createSession = (email: string) => {
  const sessionToken = cryptoRandomString({ length: 21, type: 'base64' })
  const csrfToken = cryptoRandomString({ length: 21, type: 'base64' })
  const user = db
    .prepare<
      string,
      {
        id: string
        role: 'admin' | 'project' | 'user'
        verified_email: number
        wants_updates: number
        locale: 'de' | 'en'
      }
    >('SELECT id, role, verified_email, wants_updates, locale FROM users WHERE email=?')
    .get(email)
  if (user) {
    const info = db
      .prepare('UPDATE users SET sessionToken=?, csrfToken=? WHERE id=?')
      .run(sessionToken, csrfToken, user.id)
    if (info.changes === 1) {
      return {
        sessionToken,
        userId: user.id,
        role: user.role,
        verifiedEmail: user.verified_email !== 0,
        wantsUpdates: user.wants_updates !== 0,
        locale: user.locale || 'en'
      }
    }
  }
}

export const createUser = async (email: string, password: string, wantsUpdates: boolean) => {
  const passwordHash = await bcrypt.hash(password, 10)
  try {
    const info = db
      .prepare(
        'INSERT INTO users (email, password, role, wants_updates, sessionToken, csrfToken) VALUES (?, ?, ?, ?, NULL, NULL)'
      )
      .run(email, passwordHash, 'user', wantsUpdates ? 1 : 0)
    return info.changes === 1
  } catch {
    return false
  }
}

export const deleteSession = (userId: string) => {
  db.prepare('UPDATE users SET sessionToken=NULL, csrfToken=NULL WHERE id=?').run(userId)
}

export const verifyPassword = async (email: string, password: string) => {
  const result = db
    .prepare<[string], { password: string }>('SELECT password FROM users WHERE email=?')
    .get(email)
  if (result !== undefined) {
    return await bcrypt.compare(password, result.password)
  }
  return false
}

export const verifyUserByEmail = async (email: string) => {
  const result = db
    .prepare<[string], { id: string }>('SELECT id FROM users WHERE email=?')
    .get(email)
  if (result !== undefined) {
    return result.id
  }
  return false
}

export const verifyUserById = async (userId: string) => {
  const result = db.prepare<[string], { id: number }>('SELECT id FROM users WHERE id=?').get(userId)
  if (result !== undefined) {
    return result.id
  }
  return false
}

export const verifyUserEmailAddress = async (userId: number) => {
  const info = db.prepare('UPDATE users SET verified_email=1 WHERE id=?').run(userId)
  return info.changes === 1
}

export const verifySession = (userId: string, sessionToken: string) => {
  const result = db
    .prepare<[string, string], { id: string }>('SELECT id FROM users WHERE id=? AND sessionToken=?')
    .get(userId, sessionToken)
  return result !== undefined && result.id === userId
}

export const getCsrfToken = (userId: string) => {
  const result = db
    .prepare<[string], { csrfToken: string }>(`SELECT csrfToken FROM users WHERE id=?`)
    .get(userId)
  return result?.csrfToken
}

export const verifyCsrfToken = (userId: string, token: string) => {
  const result = db
    .prepare<[string], { csrfToken: string }>(`SELECT csrfToken FROM users WHERE id=?`)
    .get(userId)
  return result !== undefined ? result.csrfToken === token : false
}
