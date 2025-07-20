import Database from 'better-sqlite3';
import path from 'path';
import fs from 'fs';

const dbPath = path.join(process.cwd(), '.data/mock.db');

// Ensure .data directory exists
const dataDir = path.dirname(dbPath);
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

const db = new Database(dbPath);

// Ensure tables exist
db.exec(`
  CREATE TABLE IF NOT EXISTS schemas (
    entity TEXT PRIMARY KEY,
    schema TEXT
  );

  CREATE TABLE IF NOT EXISTS records (
    entity TEXT,
    id TEXT,
    data TEXT,
    PRIMARY KEY (entity, id)
  );
`);

export function setSchema(entity: string, schema: any) {
  const stmt = db.prepare(
    `INSERT OR REPLACE INTO schemas (entity, schema) VALUES (?, ?)`
  );
  stmt.run(entity, JSON.stringify(schema));
}

export function getSchema(entity: string) {
  const stmt = db.prepare(`SELECT schema FROM schemas WHERE entity = ?`);
  const row = stmt.get(entity) as { schema: string } | undefined;
  return row ? JSON.parse(row.schema) : null;
}

export function setRecord(entity: string, id: string, data: any) {
  const stmt = db.prepare(
    `INSERT OR REPLACE INTO records (entity, id, data) VALUES (?, ?, ?)`
  );
  stmt.run(entity, id, JSON.stringify(data));
}

export function getRecord(entity: string, id: string) {
  const stmt = db.prepare(
    `SELECT data FROM records WHERE entity = ? AND id = ?`
  );
  const row = stmt.get(entity, id) as { data: string } | undefined;
  return row ? JSON.parse(row.data) : null;
}

export function getRecords(entity: string) {
  const stmt = db.prepare(`SELECT data FROM records WHERE entity = ?`);
  const rows = stmt.all(entity) as { data: string }[];
  return rows.map((row) => JSON.parse(row.data));
}

export function deleteRecord(entity: string, id: string) {
  const stmt = db.prepare(`DELETE FROM records WHERE entity = ? AND id = ?`);
  stmt.run(entity, id);
}
