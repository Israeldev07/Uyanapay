'use client';

import { useCallback, useEffect, useState } from 'react';
import { api } from '@/lib/api';

const grotesk = { fontFamily: 'var(--font-grotesk)' } as const;

interface Wallet {
  balance: string;
  pendingBalance: string;
  transactions: {
    id: string;
    type: string;
    amount: string;
    reference?: string | null;
    createdAt: string;
    favor?: { code: string; title: string } | null;
  }[];
}

const TYPE_LABEL: Record<string, string> = {
  RECARGA: 'Recarga',
  PAGO_FAVOR: 'Pago de favor',
  GANANCIA: 'Ganancia',
  RETIRO: 'Retiro',
  PROPINA: 'Propina',
  COMISION: 'Comisión',
  REEMBOLSO: 'Reembolso',
};

export default function PagosPage() {
  const [wallet, setWallet] = useState<Wallet | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const load = useCallback(() => {
    api<Wallet>('/billetera')
      .then(setWallet)
      .catch(() => setError('No hay conexión con la API. Inicia el backend e inicia sesión.'));
  }, []);

  useEffect(load, [load]);

  async function topUp() {
    setBusy(true);
    try {
      await api('/billetera/recargar', { method: 'POST', body: JSON.stringify({ amount: 10 }) });
      load();
    } catch {
      setError('No se pudo recargar');
    } finally {
      setBusy(false);
    }
  }

  return (
    <div style={{ flex: 1, overflowY: 'auto', padding: '30px 34px' }}>
      <h1 style={{ ...grotesk, fontWeight: 700, fontSize: 28, letterSpacing: '-.02em', margin: '0 0 24px' }}>Billetera</h1>
      {error && (
        <div style={{ background: '#FFF7E8', border: '1px solid #F4B400', color: '#8a6d00', borderRadius: 12, padding: '10px 16px', fontSize: 13, fontWeight: 600, marginBottom: 18 }}>
          {error}
        </div>
      )}

      <div style={{ display: 'flex', gap: 18, flexWrap: 'wrap', marginBottom: 26 }}>
        <div style={{ background: 'linear-gradient(135deg,#1E5EFF,#3f74ff)', color: '#fff', borderRadius: 22, padding: 26, minWidth: 260 }}>
          <div style={{ fontSize: 13, fontWeight: 700, opacity: 0.85, marginBottom: 8 }}>Saldo disponible</div>
          <div style={{ ...grotesk, fontWeight: 700, fontSize: 36, letterSpacing: '-.02em' }}>
            ${wallet ? Number(wallet.balance).toFixed(2) : '—'}
          </div>
          <div style={{ display: 'flex', gap: 10, marginTop: 18 }}>
            <button
              onClick={topUp}
              disabled={busy}
              style={{ background: '#FF8A00', color: '#fff', border: 0, padding: '10px 18px', borderRadius: 10, fontWeight: 700, fontSize: 13, cursor: 'pointer' }}
            >
              Recargar $10
            </button>
          </div>
        </div>
        <div style={{ background: '#fff', border: '1px solid #EAEDF4', borderRadius: 22, padding: 26, minWidth: 220 }}>
          <div style={{ fontSize: 13, fontWeight: 700, color: '#626B7A', marginBottom: 8 }}>Saldo pendiente</div>
          <div style={{ ...grotesk, fontWeight: 700, fontSize: 36, letterSpacing: '-.02em' }}>
            ${wallet ? Number(wallet.pendingBalance).toFixed(2) : '—'}
          </div>
          <div style={{ fontSize: 12, color: '#9aa3b6', marginTop: 8 }}>Retiros en proceso de transferencia</div>
        </div>
      </div>

      <h2 style={{ ...grotesk, fontWeight: 600, fontSize: 18, margin: '0 0 14px' }}>Historial</h2>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10, maxWidth: 720 }}>
        {wallet?.transactions.length === 0 && <div style={{ color: '#626B7A', fontSize: 14 }}>Sin movimientos todavía.</div>}
        {wallet?.transactions.map((t) => {
          const amount = Number(t.amount);
          return (
            <div key={t.id} style={{ display: 'flex', alignItems: 'center', gap: 12, background: '#fff', border: '1px solid #EAEDF4', borderRadius: 14, padding: '13px 16px' }}>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 13.5, fontWeight: 700 }}>
                  {TYPE_LABEL[t.type] ?? t.type}
                  {t.favor && <span style={{ color: '#9aa3b6', fontWeight: 600 }}> · {t.favor.code}</span>}
                </div>
                <div style={{ fontSize: 12, color: '#9aa3b6' }}>{new Date(t.createdAt).toLocaleString('es')}</div>
              </div>
              <div style={{ fontWeight: 800, fontSize: 14.5, color: amount >= 0 ? '#2ECC71' : '#E53935' }}>
                {amount >= 0 ? '+' : ''}
                {amount.toFixed(2)}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
