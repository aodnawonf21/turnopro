'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { signIn } from '@/app/actions/auth';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (!email || !password) {
        setError('Por favor completa todos los campos');
        return;
      }
      if (!email.includes('@')) {
        setError('Por favor ingresa un email válido');
        return;
      }

      const result = await signIn(email, password);
      if (result?.error) {
        setError(result.error);
      }
    } catch (err) {
      setError('Ocurrió un error. Por favor intenta de nuevo.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="mb-8">
          <Link href="/" className="text-3xl font-bold text-black hover:text-gray-700 transition-colors">
            TurnoPro
          </Link>
        </div>

        <div className="mb-8">
          <h1 className="text-3xl font-bold text-black mb-2">Inicia sesión</h1>
          <p className="text-gray-600">Accede a tu cuenta de TurnoPro</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-black mb-2">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="tu@email.com"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-black mb-2">Contraseña</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent"
            />
          </div>

          {error && <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">{error}</div>}

          <Button
            type="submit"
            disabled={loading}
            className="w-full bg-accent hover:bg-amber-600 text-white py-3"
          >
            {loading ? 'Iniciando...' : 'Inicia sesión'}
          </Button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-gray-600 text-sm">
            ¿No tienes cuenta?{' '}
            <Link href="/registro" className="text-accent hover:text-amber-600 font-semibold transition-colors">
              Regístrate
            </Link>
          </p>
        </div>

        <div className="mt-6 pt-6 border-t border-gray-200">
          <Link href="#" className="block text-center text-accent hover:text-amber-600 font-medium text-sm transition-colors mb-3">
            ¿Olvidaste tu contraseña?
          </Link>
          <p className="text-gray-500 text-xs text-center">
            Protegido por encriptación de nivel empresarial
          </p>
        </div>
      </div>
    </div>
  );
}
