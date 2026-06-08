import { connectDB } from '@/lib/mongodb';
import User from '@/models/User';
import { comparePassword, generateToken, setAuthCookie } from '@/lib/auth';

export async function POST(request) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return Response.json({ error: 'Email y contraseña son requeridos' }, { status: 400 });
    }

    await connectDB();

    const user = await User.findOne({ email: email.toLowerCase(), estado: 'activo' });
    if (!user) {
      return Response.json({ error: 'Credenciales incorrectas' }, { status: 401 });
    }

    const isValid = await comparePassword(password, user.password);
    if (!isValid) {
      return Response.json({ error: 'Credenciales incorrectas' }, { status: 401 });
    }

    const token = generateToken(user);
    await setAuthCookie(token);

    return Response.json({
      success: true,
      user: {
        id: user._id,
        email: user.email,
        nombreCompleto: user.nombreCompleto,
        rol: user.rol,
      },
    });
  } catch (err) {
    console.error('Login error:', err);
    return Response.json({ error: 'Error interno del servidor' }, { status: 500 });
  }
}
