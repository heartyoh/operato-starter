import fs from 'fs';
import path from 'path';

const dbPath = path.join(process.cwd(), '.data/mock-db.json');

function ensureDBFile() {
  if (!fs.existsSync(path.dirname(dbPath))) {
    fs.mkdirSync(path.dirname(dbPath), { recursive: true });
  }
  if (!fs.existsSync(dbPath)) {
    fs.writeFileSync(
      dbPath,
      JSON.stringify({ schemas: {}, records: {} }, null, 2)
    );
  }
}

function readDB() {
  ensureDBFile();
  const content = fs.readFileSync(dbPath, 'utf-8');
  return JSON.parse(content);
}

function writeDB(data: any) {
  ensureDBFile();
  fs.writeFileSync(dbPath, JSON.stringify(data, null, 2));
}

export function setSchema(entity: string, schema: any) {
  const db = readDB();
  db.schemas[entity] = schema;
  writeDB(db);
}

export function getSchema(entity: string) {
  const db = readDB();
  return db.schemas[entity] || null;
}

export function setRecord(entity: string, id: string, record: any) {
  const db = readDB();
  if (!db.records[entity]) db.records[entity] = {};
  db.records[entity][id] = record;
  writeDB(db);
}

export function getRecord(entity: string, id: string) {
  const db = readDB();
  return db.records[entity]?.[id] || null;
}

export function getRecords(entity: string) {
  const db = readDB();
  return Object.values(db.records[entity] || {});
}

export function deleteRecord(entity: string, id: string) {
  const db = readDB();
  if (db.records[entity]) {
    delete db.records[entity][id];
    writeDB(db);
  }
}
