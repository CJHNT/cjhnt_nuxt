import Database from 'better-sqlite3'

export const initDb = async () => {
  try {
    const db = new Database('./database.sqlite')

    db.prepare(
      `
      CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        email TEXT UNIQUE,
        password TEXT,
        role TEXT,
        sessionToken TEXT,
        csrfToken TEXT,
        verified_email INT DEFAULT 0,
        wants_updates INT DEFAULT 0
        CHECK (role in ('admin', 'project', 'user'))
      )
    `
    ).run()

    console.log('Database initialized successfully')
    return db
  } catch (error) {
    console.error('Failed to initialize database:', error)
    throw error
  }
}
