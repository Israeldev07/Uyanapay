'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { Icon, IconName } from '@/components/Icon';
import { api } from '@/lib/api';

const grotesk = { fontFamily: 'var(--font-grotesk)' } as const;

interface Profile {
  firstName: string;
  lastName: string;
  role: string;
  wallet?: { balance: string; pendingBalance: string } | null;
}

interface Favor {
  id: string;
  code: string;
  title: string;
  status: string;
  total: string;
  createdAt: string;
  category: { name: string; icon: string };
}

const CHART = [
  { h: 40, d: 'L' },
  { h: 70, d: 'M' },
  { h: 55, d: 'X' },
  { h: 90, d: 'J' },
  { h: 60, d: 'V' },
  { h: 100, d: 'S' },
  { h: 45, d: 'D' },
];

const ACTIVE_STATES = ['PUBLICADO', 'ACEPTADO', 'EN_CAMINO'];

export default function DashboardPage() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [favors, setFavors] = useState<Favor[]>([]);
  const [offline, setOffline] = useState(false);

  useEffect(() => {
    Promise.all([api<Profile>('/users/me'), api<Favor[]>('/favores/mios')])
      .then(([p, f]) => {
        setProfile(p);
        setFavors(f);
      })
      .catch(() => setOffline(true));
  }, []);

  const firstName = profile?.firstName ?? 'Cristian';
  const balance = profile?.wallet ? Number(profile.wallet.balance).toFixed(2) : '24.50';

  const widgets: { label: string; value: string; icon: IconName; tint: string; color: string }[] = [
    {
      label: 'Solicitudes activas',
      value: String(favors.filter((f) => ACTIVE_STATES.includes(f.status)).length || 3),
      icon: 'pulse',
      tint: '#EAF0FF',
      color: '#1E5EFF',
    },
    {
      label: 'Finalizadas',
      value: String(favors.filter((f) => f.status === 'FINALIZADO').length || 128),
      icon: 'check',
      tint: '#EAF0FF',
      color: '#1E5EFF',
    },
    {
      label: 'Pendientes',
      value: String(favors.filter((f) => f.status === 'PUBLICADO').length || 2),
      icon: 'clock',
      tint: '#FFF2E3',
      color: '#FF8A00',
    },
    { label: 'Este mes', value: '$62', icon: 'wallet', tint: '#FFF2E3', color: '#FF8A00' },
  ];

  const history = favors.slice(0, 3);

  return (
    <>
      {/* Topbar */}
      <div
        style={{
          height: 74,
          background: '#fff',
          borderBottom: '1px solid #EEF1F7',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0 34px',
          flexShrink: 0,
          gap: 16,
        }}
      >
        <div style={{ position: 'relative', width: 340, maxWidth: '50vw' }}>
          <div style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: '#9aa3b6', display: 'flex' }}>
            <Icon name="search" size={18} />
          </div>
          <input
            placeholder="Buscar un servicio o Yanapayer..."
            style={{
              width: '100%',
              border: '1px solid #E7EAF0',
              background: '#F7F8FB',
              borderRadius: 11,
              padding: '11px 14px 11px 40px',
              fontSize: 13.5,
              outline: 'none',
            }}
          />
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 18 }}>
          <button
            aria-label="Notificaciones"
            style={{
              width: 40,
              height: 40,
              borderRadius: 11,
              border: '1px solid #E7EAF0',
              background: '#fff',
              color: '#626B7A',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              position: 'relative',
              cursor: 'pointer',
            }}
          >
            <Icon name="bell" size={19} />
            <span
              style={{
                position: 'absolute',
                top: 9,
                right: 10,
                width: 7,
                height: 7,
                background: '#FF8A00',
                borderRadius: '50%',
                border: '2px solid #fff',
              }}
            />
          </button>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div
              style={{
                width: 40,
                height: 40,
                borderRadius: '50%',
                background: '#EAF0FF',
                color: '#1E5EFF',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 800,
              }}
            >
              {firstName.charAt(0)}
            </div>
            <div style={{ lineHeight: 1.2 }}>
              <div style={{ fontSize: 13.5, fontWeight: 700 }}>
                {firstName} {profile?.lastName ?? 'R.'}
              </div>
              <div style={{ fontSize: 11.5, color: '#9aa3b6' }}>Estudiante</div>
            </div>
          </div>
        </div>
      </div>

      <div style={{ flex: 1, overflowY: 'auto', padding: '30px 34px' }}>
        {offline && (
          <div
            style={{
              background: '#FFF7E8',
              border: '1px solid #F4B400',
              color: '#8a6d00',
              borderRadius: 12,
              padding: '10px 16px',
              fontSize: 13,
              fontWeight: 600,
              marginBottom: 18,
            }}
          >
            No hay conexión con la API (modo demostración). Inicia el backend en el puerto 4000.
          </div>
        )}

        {/* Saludo + saldo */}
        <div className="dash-main-grid" style={{ marginBottom: 24 }}>
          <div
            style={{
              background: 'linear-gradient(135deg,#1E5EFF,#3f74ff)',
              borderRadius: 22,
              padding: '30px 32px',
              color: '#fff',
              position: 'relative',
              overflow: 'hidden',
            }}
          >
            <div
              style={{
                position: 'absolute',
                right: -40,
                bottom: -50,
                width: 200,
                height: 200,
                borderRadius: '50%',
                background: 'rgba(255,255,255,.1)',
              }}
            />
            <div style={{ fontSize: 14, fontWeight: 600, opacity: 0.85, marginBottom: 6 }}>Buenos días, {firstName} 👋</div>
            <h1 style={{ ...grotesk, fontWeight: 700, fontSize: 32, margin: '0 0 20px', letterSpacing: '-.02em' }}>
              ¿Qué necesitas hoy?
            </h1>
            <Link href="/dashboard/nuevo-favor">
              <button
                className="btn-orange"
                style={{ padding: '15px 28px', fontWeight: 800, fontSize: 16, boxShadow: '0 12px 26px rgba(255,138,0,.36)' }}
              >
                <Icon name="plus" size={20} color="#fff" />
                Solicitar Favor
              </button>
            </Link>
          </div>
          <div style={{ background: '#fff', border: '1px solid #EAEDF4', borderRadius: 22, padding: 24 }}>
            <div style={{ fontSize: 13, fontWeight: 700, color: '#626B7A', marginBottom: 14 }}>Tu saldo</div>
            <div style={{ ...grotesk, fontWeight: 700, fontSize: 34, letterSpacing: '-.02em' }}>${balance}</div>
            <div style={{ display: 'flex', gap: 10, marginTop: 16 }}>
              <button
                style={{
                  flex: 1,
                  background: '#EAF0FF',
                  color: '#1E5EFF',
                  border: 0,
                  padding: 11,
                  borderRadius: 11,
                  fontWeight: 700,
                  fontSize: 13,
                  cursor: 'pointer',
                }}
              >
                Recargar
              </button>
              <Link href="/dashboard/pagos" style={{ flex: 1 }}>
                <button
                  style={{
                    width: '100%',
                    background: '#F4F6FB',
                    color: '#0E1526',
                    border: 0,
                    padding: 11,
                    borderRadius: 11,
                    fontWeight: 700,
                    fontSize: 13,
                    cursor: 'pointer',
                  }}
                >
                  Historial
                </button>
              </Link>
            </div>
          </div>
        </div>

        {/* Widgets */}
        <div className="widgets-grid" style={{ marginBottom: 24 }}>
          {widgets.map((w) => (
            <div key={w.label} style={{ background: '#fff', border: '1px solid #EAEDF4', borderRadius: 18, padding: 20 }}>
              <div
                style={{
                  width: 42,
                  height: 42,
                  borderRadius: 12,
                  background: w.tint,
                  color: w.color,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: 14,
                }}
              >
                <Icon name={w.icon} size={20} color={w.color} />
              </div>
              <div style={{ ...grotesk, fontWeight: 700, fontSize: 28, letterSpacing: '-.02em' }}>{w.value}</div>
              <div style={{ fontSize: 13, color: '#626B7A', fontWeight: 600, marginTop: 2 }}>{w.label}</div>
            </div>
          ))}
        </div>

        {/* Actividad + historial */}
        <div className="dash-bottom-grid">
          <div style={{ background: '#fff', border: '1px solid #EAEDF4', borderRadius: 22, padding: 24 }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 18 }}>
              <div style={{ ...grotesk, fontWeight: 600, fontSize: 18 }}>Actividad</div>
              <a href="#" style={{ fontSize: 13, fontWeight: 700 }}>
                Esta semana
              </a>
            </div>
            <div style={{ display: 'flex', alignItems: 'flex-end', gap: 14, height: 150, paddingTop: 10 }}>
              {CHART.map((b, i) => (
                <div
                  key={b.d}
                  style={{
                    flex: 1,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: 8,
                    height: '100%',
                    justifyContent: 'flex-end',
                  }}
                >
                  <div
                    style={{
                      width: '100%',
                      height: `${b.h}%`,
                      background: i === 5 ? '#FF8A00' : '#1E5EFF',
                      borderRadius: '8px 8px 4px 4px',
                    }}
                  />
                  <div style={{ fontSize: 11, color: '#9aa3b6', fontWeight: 600 }}>{b.d}</div>
                </div>
              ))}
            </div>
          </div>
          <div style={{ background: '#fff', border: '1px solid #EAEDF4', borderRadius: 22, padding: 24 }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
              <div style={{ ...grotesk, fontWeight: 600, fontSize: 18 }}>Historial</div>
              <Link href="/dashboard/solicitudes" style={{ fontSize: 13, fontWeight: 700 }}>
                Ver todo
              </Link>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {(history.length
                ? history.map((f, i) => ({
                    key: f.id,
                    icon: (f.category.icon || 'bag') as IconName,
                    tint: i % 2 ? '#FFF2E3' : '#EAF0FF',
                    color: i % 2 ? '#FF8A00' : '#1E5EFF',
                    title: f.title,
                    time: new Date(f.createdAt).toLocaleDateString('es', { weekday: 'long', hour: '2-digit', minute: '2-digit' }),
                    amount: `$${Number(f.total).toFixed(2)}`,
                  }))
                : [
                    { key: '1', icon: 'printer' as IconName, tint: '#EAF0FF', color: '#1E5EFF', title: 'Impresión de tesis', time: 'Ayer · 14:20', amount: '$0.80' },
                    { key: '2', icon: 'bag' as IconName, tint: '#FFF2E3', color: '#FF8A00', title: 'Almuerzo cafetería', time: 'Ayer · 12:05', amount: '$3.20' },
                    { key: '3', icon: 'box' as IconName, tint: '#EAF0FF', color: '#1E5EFF', title: 'Entrega de paquete', time: 'Lunes · 09:40', amount: '$2.00' },
                  ]
              ).map((h) => (
                <div
                  key={h.key}
                  style={{ display: 'flex', alignItems: 'center', gap: 12, padding: 11, borderRadius: 13, background: '#F7F8FB' }}
                >
                  <div
                    style={{
                      width: 38,
                      height: 38,
                      borderRadius: 11,
                      background: h.tint,
                      color: h.color,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                    }}
                  >
                    <Icon name={h.icon} size={18} color={h.color} />
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 13.5, fontWeight: 700 }}>{h.title}</div>
                    <div style={{ fontSize: 12, color: '#9aa3b6' }}>{h.time}</div>
                  </div>
                  <div style={{ fontSize: 13.5, fontWeight: 700, color: '#1E5EFF' }}>{h.amount}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
