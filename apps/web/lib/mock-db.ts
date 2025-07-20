const schemaStore: Record<string, any> = {};
const recordStore: Record<string, any[]> = {};

export function setSchema(entity: string, schema: any) {
  schemaStore[entity] = schema;
}

export function getSchema(entity: string) {
  return schemaStore[entity];
}

export function setRecords(entity: string, records: any[]) {
  recordStore[entity] = records;
}

export function getRecords(entity: string) {
  return recordStore[entity] || [];
}

export function getRecord(entity: string, id: string) {
  const records = getRecords(entity);
  return records.find((r) => r.id === id);
}
