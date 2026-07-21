'use client';

import { useEffect, useState } from 'react';
import { Icon, IconName } from '@/components/Icon';
import { api } from '@/lib/api';

const grotesk = { fontFamily: 'var(--font-grotesk)' } as const;

interface Favor {
  id: string;
  code: string;
  title: string;
  status: string;
  total: string;
  urgency: string;
  createdAt: string;
  category: { name: string; icon: string };
  yanapayer?: { firstName: string; lastName: string } | null;
}

const STATUS_STYLE: Record<string, { bg: string; fg: string; label: string }> = {
  PUBLICADO: { bg: '#EAF0FF', fg: '#1E5EFF', label: 'Publicado' },
  ACEPTADO: { bg: '#FFF2E3', fg: '#FF8A00', label: 'Aceptado' },
  EN_CAMINO: { bg: '#FFF2E3', fg: '#FF8A00', label: 'En camino' },
  ENTREGADO: { bg: '#E9F9F0', fg: '#2ECC71', label: 'Entregado' },
  FINALIZADO: { bg: '#E9F9F0', fg: '#2ECC71', label: 'Finalizado' },
  CANCELADO: { bg: '#FDECEC', fg: '#E53935', label: 'Cancelado' },
};

export default function SolicitudesPage() {
  const [favors, setFavors] = useState<Favor[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    api<Favor[]>('/favores/mios')
      .then(setFavors)
      .catch(() => setError('No hay conexión con la API. Inicia el backend e inicia sesión.'));
  }, []);

  return (
    <div style={{ flex: 1, overflowY: 'auto', padding: '30px 34px' }}>
      <h1 style={{ ...grotesk, fontWeight: 700, fontSize: 28, letterSpacing: '-.02em', margin: '0 0 24px' }}>
        Mis solicitudes
      </h1>
      {error && (
        <div style={{ background: '#FFF7E8', border: '1px solid #F4B400', color: '#8a6d00', borderRadius: 12, padding: '10px 16px', fontSize: 13, fontWeight: 600, marginBottom: 18 }}>
          {error}
        </div>
      )}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12, maxWidth: 900 }}>
        {favors.length === 0 && !error && (
          <div style={{ color: '#626B7A', fontSize: 14 }}>Aún no tienes solicitudes. ¡Publica tu primer favor!</div>
        )}
        {favors.map((f) => {
          const st = STATUS_STYLE[f.status] ?? STATUS_STYLE.PUBLICADO;
          return (
            <div
              key={f.id}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 14,
                background: '#fff',
                border: '1px solid #EAEDF4',
                borderRadius: 16,
                padding: 16,
              }}
            >
              <div
                style={{
                  width: 44,
                  height: 44,
                  borderRadius: 13,
                  background: '#EAF0FF',
                  color: '#1E5EFF',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                }}
              >
                <Icon name={(f.category.icon || 'bag') as IconName} size={20} color="#1E5EFF" />
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 14.5, fontWeight: 700 }}>
                  {f.title} <span style={{ color: '#9aa3b6', fontWeight: 600, fontSize: 12 }}>· {f.code}</span>
                </div>
                <div style={{ fontSize: 12.5, color: '#9aa3b6' }}>
                  {f.category.name} · {new Date(f.createdAt).toLocaleString('es')}
                  {f.yanapayer && ` · Yanapayer: ${f.yanapayer.firstName} ${f.yanapayer.lastName}`}
                </div>
              </div>
              <span
                style={{
                  background: st.bg,
                  color: st.fg,
                  fontWeight: 700,
                  fontSize: 12,
                  padding: '6px 12px',
                  borderRadius: 999,
                  whiteSpace: 'nowrap',
                }}
              >
                {st.label}
              </span>
              <div style={{ fontSize: 15, fontWeight: 800, color: '#1E5EFF', width: 70, textAlign: 'right' }}>
                ${Number(f.total).toFixed(2)}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
