'use client';

import { useCallback, useEffect, useState } from 'react';
import { Icon, IconName } from '@/components/Icon';
import { api } from '@/lib/api';

const grotesk = { fontFamily: 'var(--font-grotesk)' } as const;

interface AvailableFavor {
  id: string;
  code: string;
  title: string;
  description: string;
  status: string;
  total: string;
  budget: string;
  urgency: string;
  originLabel: string;
  destLabel: string;
  createdAt: string;
  category: { name: string; icon: string };
  client: { firstName: string; lastName: string; career?: string | null };
}

const URGENCY_STYLE: Record<string, { bg: string; fg: string; label: string }> = {
  BAJA: { bg: '#E9F9F0', fg: '#2ECC71', label: 'Baja' },
  MEDIA: { bg: '#EAF0FF', fg: '#1E5EFF', label: 'Media' },
  ALTA: { bg: '#FDECEC', fg: '#E53935', label: 'Alta' },
};

export default function DisponiblesPage() {
  const [favors, setFavors] = useState<AvailableFavor[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [ok, setOk] = useState<string | null>(null);

  const load = useCallback(() => {
    api<AvailableFavor[]>('/favores/disponibles')
      .then(setFavors)
      .catch((err) =>
        setError(
          err instanceof Error && err.message.includes('403')
            ? 'Debes iniciar sesión como Yanapayer verificado para ver las solicitudes disponibles.'
            : 'No hay conexión con la API. Inicia el backend e inicia sesión como Yanapayer.',
        ),
      );
  }, []);

  useEffect(load, [load]);

  async function accept(id: string, code: string) {
    setBusyId(id);
    setError(null);
    setOk(null);
    try {
      await api(`/favores/${id}/aceptar`, { method: 'POST' });
      setOk(`Aceptaste el favor ${code}. Aparecerá en "Mis solicitudes".`);
      setFavors((prev) => prev.filter((f) => f.id !== id));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'No se pudo aceptar el favor.');
    } finally {
      setBusyId(null);
    }
  }

  return (
    <div style={{ flex: 1, overflowY: 'auto', padding: '30px 34px' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 14, marginBottom: 6, flexWrap: 'wrap' }}>
        <h1 style={{ ...grotesk, fontWeight: 700, fontSize: 28, letterSpacing: '-.02em', margin: 0 }}>
          Solicitudes disponibles
        </h1>
        <button
          onClick={load}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 8,
            background: '#EAF0FF',
            color: '#1E5EFF',
            border: 0,
            padding: '10px 16px',
            borderRadius: 11,
            fontWeight: 700,
            fontSize: 13,
            cursor: 'pointer',
          }}
        >
          <Icon name="pulse" size={16} color="#1E5EFF" />
          Actualizar
        </button>
      </div>
      <p style={{ color: '#626B7A', fontSize: 14, margin: '0 0 24px' }}>
        Favores publicados por clientes de tu comunidad. Acepta el que quieras realizar.
      </p>

      {error && (
        <div style={{ background: '#FFF7E8', border: '1px solid #F4B400', color: '#8a6d00', borderRadius: 12, padding: '10px 16px', fontSize: 13, fontWeight: 600, marginBottom: 18 }}>
          {error}
        </div>
      )}
      {ok && (
        <div style={{ background: '#E9F9F0', border: '1px solid #2ECC71', color: '#1b7a44', borderRadius: 12, padding: '10px 16px', fontSize: 13, fontWeight: 700, marginBottom: 18 }}>
          {ok}
        </div>
      )}

      {favors.length === 0 && !error && (
        <div style={{ color: '#626B7A', fontSize: 14 }}>No hay solicitudes disponibles en este momento.</div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(360px, 1fr))', gap: 16 }}>
        {favors.map((f) => {
          const urg = URGENCY_STYLE[f.urgency] ?? URGENCY_STYLE.MEDIA;
          return (
            <div key={f.id} style={{ background: '#fff', border: '1px solid #EAEDF4', borderRadius: 20, padding: 22 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 14 }}>
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
                  <div style={{ fontSize: 15, fontWeight: 700 }}>{f.title}</div>
                  <div style={{ fontSize: 12, color: '#9aa3b6' }}>
                    {f.category.name} · {f.code}
                  </div>
                </div>
                <span style={{ background: urg.bg, color: urg.fg, fontWeight: 700, fontSize: 11.5, padding: '5px 11px', borderRadius: 999 }}>
                  {urg.label}
                </span>
              </div>

              <p style={{ fontSize: 13.5, lineHeight: 1.55, color: '#626B7A', margin: '0 0 14px' }}>{f.description}</p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginBottom: 14 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 12.5, color: '#4c5567' }}>
                  <Icon name="pin" size={15} color="#1E5EFF" />
                  <b style={{ fontWeight: 700 }}>Origen:</b> {f.originLabel}
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 12.5, color: '#4c5567' }}>
                  <Icon name="pin" size={15} color="#FF8A00" />
                  <b style={{ fontWeight: 700 }}>Destino:</b> {f.destLabel}
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: 14, borderTop: '1px solid #F0F2F7' }}>
                <div>
                  <div style={{ fontSize: 11, color: '#9aa3b6', fontWeight: 600 }}>Pago</div>
                  <div style={{ ...grotesk, fontSize: 22, fontWeight: 700, color: '#1E5EFF' }}>
                    ${Number(f.total).toFixed(2)}
                  </div>
                </div>
                <div style={{ fontSize: 12, color: '#9aa3b6', textAlign: 'right' }}>
                  Solicitado por
                  <div style={{ color: '#0E1526', fontWeight: 700, fontSize: 13 }}>
                    {f.client.firstName} {f.client.lastName}
                  </div>
                </div>
              </div>

              <button
                onClick={() => accept(f.id, f.code)}
                disabled={busyId === f.id}
                className="btn-primary"
                style={{ width: '100%', marginTop: 16, padding: '13px', fontSize: 14 }}
              >
                <Icon name="check" size={17} color="#fff" />
                {busyId === f.id ? 'Aceptando…' : 'Aceptar favor'}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
