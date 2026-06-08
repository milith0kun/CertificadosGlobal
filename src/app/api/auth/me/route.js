import { getCurrentUser } from '@/lib/auth';
import { removeAuthCookie } from '@/lib/auth';

export async function GET() {
  const user = await getCurrentUser();
  if (!user) {
    return Response.json({ error: 'No autenticado' }, { status: 401 });
  }
  return Response.json({ user });
}

export async function DELETE() {
  await removeAuthCookie();
  return Response.json({ success: true });
}
