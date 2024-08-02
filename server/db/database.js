import { open } from 'sqlite'
import sqlite3 from 'sqlite3'

export const initDb = async () => {
  try {
    const db = await open({
      filename: './database.sqlite',
      driver: sqlite3.Database
    })

    await db.exec(`
      CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        email TEXT UNIQUE,
        password TEXT,
        role TEXT,
        verified_email INT DEFAULT 0,
        wants_updates INT DEFAULT 0
        CHECK (role in ('admin', 'project', 'user'))
      )
    `)

    console.log('Database initialized successfully')
    return db
  } catch (error) {
    console.error('Failed to initialize database:', error)
    throw error
  }
}
