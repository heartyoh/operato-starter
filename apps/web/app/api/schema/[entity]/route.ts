import { NextRequest, NextResponse } from 'next/server';
import { getSchema } from '@/lib/mock-db-file';

const entitiesSchema = [
  { name: 'name', label: 'Entity Name', type: 'text' },
  { name: 'description', label: 'Description', type: 'text' },
];

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ entity: string }> }
) {
  const { entity } = await params;
  console.log('Schema API called for entity:', entity);

  const schema = getSchema(entity);
  console.log('Found schema:', schema);

  if (!schema)
    return NextResponse.json({ error: 'Not Found' }, { status: 404 });

  return NextResponse.json({ schema });
}
