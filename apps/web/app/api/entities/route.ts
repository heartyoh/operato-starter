import { NextResponse } from 'next/server';
import { getEntityRegistry, addEntity } from '@/lib/entity-registry';

export async function GET() {
  const entities = getEntityRegistry();
  return NextResponse.json(entities);
}

export async function POST(req: Request) {
  const { name } = await req.json();
  if (typeof name !== 'string' || !name) {
    return NextResponse.json({ error: 'Invalid entity name' }, { status: 400 });
  }
  addEntity(name);
  return NextResponse.json({ success: true });
}
