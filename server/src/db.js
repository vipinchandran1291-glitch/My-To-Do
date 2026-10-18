import { DatabaseSync } from 'node:sqlite';
import { mkdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const dbPath = process.env.DB_PATH || join(__dirname, '..', 'data', 'todos.db');

mkdirSync(dirname(dbPath), { recursive: true });

const db = new DatabaseSync(dbPath);

db.exec(`
  CREATE TABLE IF NOT EXISTS todos (
    id         INTEGER PRIMARY KEY AUTOINCREMENT,
    text       TEXT    NOT NULL,
    completed  INTEGER NOT NULL DEFAULT 0,
    created_at TEXT    NOT NULL DEFAULT (datetime('now')),
    updated_at TEXT    NOT NULL DEFAULT (datetime('now'))
  )
`);

// SQLite stores booleans as 0/1; convert rows to the shape the client expects.
function toTodo(row) {
  return {
    id: row.id,
    text: row.text,
    completed: Boolean(row.completed),
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

const statements = {
  all: db.prepare('SELECT * FROM todos ORDER BY id DESC'),
  get: db.prepare('SELECT * FROM todos WHERE id = ?'),
  insert: db.prepare('INSERT INTO todos (text) VALUES (?)'),
  update: db.prepare(`
    UPDATE todos
    SET text = ?, completed = ?, updated_at = datetime('now')
    WHERE id = ?
  `),
  remove: db.prepare('DELETE FROM todos WHERE id = ?'),
  removeCompleted: db.prepare('DELETE FROM todos WHERE completed = 1'),
};

export function listTodos() {
  return statements.all.all().map(toTodo);
}

export function getTodo(id) {
  const row = statements.get.get(id);
  return row ? toTodo(row) : null;
}

export function createTodo(text) {
  const { lastInsertRowid } = statements.insert.run(text);
  return getTodo(lastInsertRowid);
}

export function updateTodo(id, changes) {
  const existing = getTodo(id);
  if (!existing) return null;
  const text = changes.text ?? existing.text;
  const completed = changes.completed ?? existing.completed;
  statements.update.run(text, completed ? 1 : 0, id);
  return getTodo(id);
}

export function deleteTodo(id) {
  return statements.remove.run(id).changes > 0;
}

export function deleteCompletedTodos() {
  return statements.removeCompleted.run().changes;
}
