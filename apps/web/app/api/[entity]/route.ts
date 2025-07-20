import { NextRequest, NextResponse } from 'next/server';
import { getRecords, setRecord } from '@/lib/mock-db-file';

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ entity: string }> }
) {
  const { entity } = await params;
  const records = getRecords(entity);
  return NextResponse.json(records);
}

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ entity: string }> }
) {
  const { entity } = await params;
  const body = await req.json();

  const records = getRecords(entity);
  const newId = String(records.length + 1);
  const newRecord = { id: newId, ...body };
  setRecord(entity, newId, newRecord);

  return NextResponse.json(newRecord, { status: 201 });
}
