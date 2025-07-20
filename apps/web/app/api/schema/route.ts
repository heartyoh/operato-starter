import { NextRequest, NextResponse } from 'next/server';
import { setSchema } from '@/lib/mock-db-file';

export async function POST(req: NextRequest) {
  const body = await req.json();

  const { entity, schema } = body;

  if (!entity || !schema) {
    return NextResponse.json(
      { error: 'Entity name and schema are required' },
      { status: 400 }
    );
  }

  setSchema(entity, schema);

  return NextResponse.json({ success: true, entity, schema });
}
