import { NextRequest, NextResponse } from 'next/server';
import { getSchema } from '@/lib/mock-db-file';

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ entity: string }> }
) {
  const { entity } = await params;
  const schema = getSchema(entity);

  if (!schema) {
    return NextResponse.json({ error: 'Schema not found' }, { status: 404 });
  }

  return NextResponse.json({ schema });
}
