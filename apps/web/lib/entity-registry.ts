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

export function getEntityRegistry(): string[] {
  const db = readDB();
  return Object.keys(db.schemas || {});
}

export function addEntity(name: string) {
  const db = readDB();
  if (!db.schemas[name]) {
    // 기본 스키마 생성
    const defaultSchema = [
      { name: 'id', label: 'ID', type: 'text', required: true },
      { name: 'name', label: 'Name', type: 'text', required: true },
      { name: 'description', label: 'Description', type: 'text' },
      { name: 'createdAt', label: 'Created At', type: 'datetime' },
    ];
    db.schemas[name] = defaultSchema;
    writeDB(db);
  }
}

export function removeEntity(name: string) {
  const db = readDB();
  delete db.schemas[name];
  delete db.records[name];
  writeDB(db);
}
