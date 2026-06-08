import { getCurrentUser } from './auth.js';

export async function requireAuth() {
  const user = await getCurrentUser();
  if (!user) {
    return { error: Response.json({ error: 'No autorizado' }, { status: 401 }), user: null };
  }
  return { error: null, user };
}

export async function requireRole(...roles) {
  const { error, user } = await requireAuth();
  if (error) return { error, user: null };
  if (!roles.includes(user.rol)) {
    return { error: Response.json({ error: 'Acceso denegado' }, { status: 403 }), user: null };
  }
  return { error: null, user };
}
