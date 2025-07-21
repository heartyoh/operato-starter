import { NextRequest, NextResponse } from 'next/server';
import { removeEntity } from '@/lib/entity-registry';

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ name: string }> }
) {
  const { name } = await params;

  try {
    removeEntity(name);
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to delete entity' },
      { status: 500 }
    );
  }
}
