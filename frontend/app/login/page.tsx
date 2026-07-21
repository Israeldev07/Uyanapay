'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { FormEvent, useState } from 'react';
import { LogoMark, LogoText } from '@/components/Logo';
import { login, setToken } from '@/lib/api';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const res = await login(email, password);
      setToken(res.accessToken);
      router.push('/dashboard');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'No se pudo iniciar sesión');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
      <div
        style={{
          width: '100%',
          maxWidth: 420,
          background: '#fff',
          borderRadius: 22,
          boxShadow: '0 30px 80px rgba(14,21,38,.14)',
          padding: 34,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24 }}>
          <LogoMark />
          <div style={{ lineHeight: 1.05 }}>
            <LogoText />
            <div style={{ fontSize: 10.5, color: '#8b93a3', fontWeight: 500 }}>Conexión universitaria a tu servicio</div>
          </div>
        </div>
        <h1 style={{ fontFamily: 'var(--font-grotesk)', fontWeight: 700, fontSize: 26, margin: '0 0 20px', letterSpacing: '-.02em' }}>
          Iniciar sesión
        </h1>
        <form onSubmit={onSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <div className="field">
            <label>Correo</label>
            <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="tucorreo@universidad.edu" />
          </div>
          <div className="field">
            <label>Contraseña</label>
            <input type="password" required value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" />
          </div>
          {error && <div style={{ color: '#E53935', fontSize: 13, fontWeight: 600 }}>{error}</div>}
          <button className="btn-primary" type="submit" disabled={loading}>
            {loading ? 'Ingresando…' : 'Ingresar'}
          </button>
        </form>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 16, fontSize: 13, fontWeight: 600 }}>
          <Link href="/registro">Crear cuenta</Link>
          <a href="#">Recuperar contraseña</a>
        </div>
      </div>
    </div>
  );
}
