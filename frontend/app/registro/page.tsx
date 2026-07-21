'use client';

import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { FormEvent, Suspense, useState } from 'react';
import { Icon } from '@/components/Icon';
import { LogoMark, LogoText } from '@/components/Logo';
import { registerClient, registerYanapayer, setToken } from '@/lib/api';

type Tipo = 'cliente' | 'yanapayer' | null;

function RegistroContent() {
  const router = useRouter();
  const params = useSearchParams();
  const initial = params.get('tipo') === 'yanapayer' ? 'yanapayer' : null;
  const [tipo, setTipo] = useState<Tipo>(initial);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    const fd = new FormData(e.currentTarget);
    const data = Object.fromEntries(fd.entries()) as Record<string, unknown>;

    if (data.password !== data.confirm) {
      setError('Las contraseñas no coinciden');
      return;
    }
    delete data.confirm;
    data.acceptedTos = fd.get('acceptedTos') === 'on';
    if (tipo === 'yanapayer' && data.semester) data.semester = Number(data.semester);

    setLoading(true);
    try {
      const res =
        tipo === 'yanapayer'
          ? await registerYanapayer(data)
          : await registerClient(data);
      setToken(res.accessToken);
      router.push('/dashboard');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'No se pudo completar el registro');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
      <div
        style={{
          width: '100%',
          maxWidth: tipo ? 560 : 760,
          background: '#fff',
          borderRadius: 22,
          boxShadow: '0 30px 80px rgba(14,21,38,.14)',
          padding: 34,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24 }}>
          <LogoMark />
          <LogoText />
        </div>

        {!tipo && (
          <>
            <h1 style={{ fontFamily: 'var(--font-grotesk)', fontWeight: 700, fontSize: 26, margin: '0 0 6px', letterSpacing: '-.02em' }}>
              Crea tu cuenta
            </h1>
            <p style={{ color: '#626B7A', fontSize: 14, margin: '0 0 24px' }}>¿Cómo quieres usar UYanapay?</p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 18 }}>
              <button
                onClick={() => setTipo('cliente')}
                style={{
                  border: '1.5px solid #E1E5EE',
                  background: '#F7F8FB',
                  borderRadius: 20,
                  padding: '34px 24px',
                  cursor: 'pointer',
                  textAlign: 'center',
                }}
              >
                <div
                  style={{
                    width: 60,
                    height: 60,
                    borderRadius: 18,
                    background: '#EAF0FF',
                    color: '#1E5EFF',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    margin: '0 auto 14px',
                  }}
                >
                  <Icon name="user" size={26} color="#1E5EFF" />
                </div>
                <div style={{ fontFamily: 'var(--font-grotesk)', fontWeight: 700, fontSize: 20 }}>Soy cliente</div>
                <div style={{ color: '#626B7A', fontSize: 13.5, marginTop: 6 }}>Necesito ayuda</div>
              </button>
              <button
                onClick={() => setTipo('yanapayer')}
                style={{
                  border: '1.5px solid #E1E5EE',
                  background: '#F7F8FB',
                  borderRadius: 20,
                  padding: '34px 24px',
                  cursor: 'pointer',
                  textAlign: 'center',
                }}
              >
                <div
                  style={{
                    width: 60,
                    height: 60,
                    borderRadius: 18,
                    background: '#FFF2E3',
                    color: '#FF8A00',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    margin: '0 auto 14px',
                  }}
                >
                  <Icon name="wallet" size={26} color="#FF8A00" />
                </div>
                <div style={{ fontFamily: 'var(--font-grotesk)', fontWeight: 700, fontSize: 20 }}>Soy Yanapayer</div>
                <div style={{ color: '#626B7A', fontSize: 13.5, marginTop: 6 }}>Quiero generar ingresos</div>
              </button>
            </div>
          </>
        )}

        {tipo && (
          <>
            <h1 style={{ fontFamily: 'var(--font-grotesk)', fontWeight: 700, fontSize: 26, margin: '0 0 20px', letterSpacing: '-.02em' }}>
              Registro {tipo === 'cliente' ? 'de cliente' : 'de Yanapayer'}
            </h1>
            <form onSubmit={onSubmit} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
              <div className="field">
                <label>Nombre</label>
                <input name="firstName" required />
              </div>
              <div className="field">
                <label>Apellido</label>
                <input name="lastName" required />
              </div>
              <div className="field" style={{ gridColumn: '1 / -1' }}>
                <label>Correo</label>
                <input name="email" type="email" required placeholder="tucorreo@universidad.edu" />
              </div>
              <div className="field">
                <label>Celular</label>
                <input name="phone" required />
              </div>
              <div className="field">
                <label>Universidad</label>
                <input name="university" required />
              </div>
              <div className="field" style={{ gridColumn: '1 / -1' }}>
                <label>Carrera (opcional)</label>
                <input name="career" />
              </div>
              {tipo === 'yanapayer' && (
                <>
                  <div className="field">
                    <label>Cédula</label>
                    <input name="cedula" required />
                  </div>
                  <div className="field">
                    <label>Semestre</label>
                    <input name="semester" type="number" min={1} max={12} />
                  </div>
                  <div className="field">
                    <label>Cuenta bancaria</label>
                    <input name="bankAccount" />
                  </div>
                  <div className="field">
                    <label>Medio de transporte</label>
                    <select name="transport" defaultValue="CAMINANDO" required>
                      <option value="MOTO">Moto</option>
                      <option value="BICICLETA">Bicicleta</option>
                      <option value="CAMINANDO">Caminando</option>
                    </select>
                  </div>
                </>
              )}
              <div className="field">
                <label>Contraseña</label>
                <input name="password" type="password" minLength={8} required />
              </div>
              <div className="field">
                <label>Confirmar</label>
                <input name="confirm" type="password" minLength={8} required />
              </div>
              <label
                style={{
                  gridColumn: '1 / -1',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 10,
                  fontSize: 13.5,
                  fontWeight: 600,
                  color: '#4c5567',
                }}
              >
                <input type="checkbox" name="acceptedTos" required /> Acepto los términos y condiciones
              </label>
              {error && (
                <div style={{ gridColumn: '1 / -1', color: '#E53935', fontSize: 13, fontWeight: 600 }}>{error}</div>
              )}
              <div style={{ gridColumn: '1 / -1', display: 'flex', gap: 12 }}>
                <button type="button" className="btn-ghost" onClick={() => setTipo(null)}>
                  Volver
                </button>
                <button className="btn-primary" type="submit" disabled={loading} style={{ flex: 1 }}>
                  {loading ? 'Creando cuenta…' : 'Crear cuenta'}
                </button>
              </div>
            </form>
          </>
        )}

        <div style={{ marginTop: 18, fontSize: 13, fontWeight: 600, textAlign: 'center' }}>
          ¿Ya tienes cuenta? <Link href="/login">Inicia sesión</Link>
        </div>
      </div>
    </div>
  );
}

export default function RegistroPage() {
  return (
    <Suspense>
      <RegistroContent />
    </Suspense>
  );
}
