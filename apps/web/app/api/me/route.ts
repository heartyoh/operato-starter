import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  // TODO: 실제 사용자 인증 로직 구현
  const mockUser = {
    id: 1,
    name: 'John Doe',
    email: 'john@example.com',
  };

  return NextResponse.json(mockUser);
}
