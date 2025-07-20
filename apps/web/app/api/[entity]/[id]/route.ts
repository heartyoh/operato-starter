import { NextRequest, NextResponse } from 'next/server';
import {
  getRecords,
  setRecord,
  getRecord,
  deleteRecord,
} from '@/lib/mock-db-file';

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ entity: string; id: string }> }
) {
  const { entity, id } = await params;
  const record = getRecord(entity, id);

  if (!record) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }

  return NextResponse.json(record);
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ entity: string; id: string }> }
) {
  const { entity, id } = await params;
  const body = await req.json();

  const record = getRecord(entity, id);
  if (!record)
    return NextResponse.json({ error: 'Not found' }, { status: 404 });

  const updated = { ...record, ...body };
  setRecord(entity, id, updated);

  return NextResponse.json(updated);
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ entity: string; id: string }> }
) {
  const { entity, id } = await params;

  const record = getRecord(entity, id);
  if (!record)
    return NextResponse.json({ error: 'Not found' }, { status: 404 });

  deleteRecord(entity, id);

  return NextResponse.json({ success: true });
}
