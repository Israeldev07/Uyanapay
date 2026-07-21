'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { FormEvent, Suspense, useState } from 'react';
import { Icon } from '@/components/Icon';
import { CATEGORIES } from '@/lib/data';
import { api } from '@/lib/api';

const grotesk = { fontFamily: 'var(--font-grotesk)' } as const;

function NuevoFavorContent() {
  const router = useRouter();
  const params = useSearchParams();
  const [category, setCategory] = useState(params.get('categoria') ?? 'comida');
  const [error, setError] = useState<string | null>(null);
  const [ok, setOk] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setOk(null);
    const fd = new FormData(e.currentTarget);

    const budget = Number(fd.get('budget'));
    if (!(budget > 3)) {
      setError('agrega un valor mayor a 3.00');
      return;
    }

    const scheduledDate = fd.get('fecha') as string;
    const scheduledTime = fd.get('hora') as string;

    const payload = {
      categorySlug: category,
      title: fd.get('title'),
      description: fd.get('description'),
      originLabel: fd.get('originLabel'),
      destLabel: fd.get('destLabel'),
      scheduledAt:
        scheduledDate && scheduledTime
          ? new Date(`${scheduledDate}T${scheduledTime}`).toISOString()
          : undefined,
      urgency: fd.get('urgency'),
      budget,
      paymentMethod: fd.get('paymentMethod'),
      notes: (fd.get('notes') as string) || undefined,
      couponCode: (fd.get('couponCode') as string) || undefined,
    };

    setLoading(true);
    try {
      const favor = await api<{ code: string }>('/favores', {
        method: 'POST',
        body: JSON.stringify(payload),
      });
      setOk(`¡Favor ${favor.code} publicado! Un Yanapayer lo aceptará en breve.`);
      setTimeout(() => router.push('/dashboard'), 1600);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'No se pudo publicar el favor. ¿Iniciaste sesión?');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{ flex: 1, overflowY: 'auto', padding: '30px 34px' }}>
      <h1 style={{ ...grotesk, fontWeight: 700, fontSize: 28, letterSpacing: '-.02em', margin: '0 0 6px' }}>
        Nuevo favor
      </h1>
      <p style={{ color: '#626B7A', fontSize: 14, margin: '0 0 24px' }}>
        Cuéntanos qué necesitas y un Yanapayer verificado lo resolverá por ti.
      </p>

      <form
        onSubmit={onSubmit}
        style={{
          background: '#fff',
          border: '1px solid #EAEDF4',
          borderRadius: 22,
          padding: 28,
          maxWidth: 860,
          display: 'flex',
          flexDirection: 'column',
          gap: 20,
        }}
      >
        {/* Categoría */}
        <div>
          <div style={{ fontSize: 12.5, fontWeight: 700, color: '#626B7A', marginBottom: 10 }}>Categoría</div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
            {CATEGORIES.map((c) => {
              const active = category === c.slug;
              return (
                <button
                  key={c.slug}
                  type="button"
                  onClick={() => setCategory(c.slug)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 8,
                    padding: '10px 16px',
                    borderRadius: 999,
                    border: active ? '1.5px solid #1E5EFF' : '1.5px solid #E7EAF0',
                    background: active ? '#EAF0FF' : '#fff',
                    color: active ? '#1E5EFF' : '#4c5567',
                    fontWeight: 700,
                    fontSize: 13,
                    cursor: 'pointer',
                  }}
                >
                  <Icon name={c.icon} size={16} />
                  {c.label}
                </button>
              );
            })}
          </div>
        </div>

        <div className="field">
          <label>Título</label>
          <input name="title" required placeholder="Ej. Comprar una cartulina antes de clases" />
        </div>
        <div className="field">
          <label>Descripción</label>
          <textarea name="description" required rows={3} placeholder="Describe exactamente qué necesitas…" />
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
          <div className="field">
            <label>Ubicación (origen)</label>
            <input name="originLabel" required placeholder="Ej. Papelería del bloque B" />
          </div>
          <div className="field">
            <label>Destino (entrega)</label>
            <input name="destLabel" required placeholder="Ej. Aula 304, Facultad de Ingeniería" />
          </div>
          <div className="field">
            <label>Fecha</label>
            <input name="fecha" type="date" />
          </div>
          <div className="field">
            <label>Hora</label>
            <input name="hora" type="time" />
          </div>
          <div className="field">
            <label>Urgencia</label>
            <select name="urgency" defaultValue="MEDIA">
              <option value="BAJA">Baja</option>
              <option value="MEDIA">Media</option>
              <option value="ALTA">Alta</option>
            </select>
          </div>
          <div className="field">
            <label>Presupuesto (USD)</label>
            <input name="budget" type="number" step="0.25" min="0" required placeholder="3.50" />
          </div>
          <div className="field">
            <label>Método de pago</label>
            <select name="paymentMethod" defaultValue="SALDO">
              <option value="SALDO">Saldo UYanapay</option>
              <option value="EFECTIVO">Efectivo</option>
              <option value="TRANSFERENCIA">Transferencia</option>
            </select>
          </div>
          <div className="field">
            <label>Cupón (opcional)</label>
            <input name="couponCode" placeholder="UYANA50" />
          </div>
        </div>

        <div className="field">
          <label>Observaciones (opcional)</label>
          <textarea name="notes" rows={2} placeholder="Indicaciones adicionales para el Yanapayer…" />
        </div>

        {error && <div style={{ color: '#E53935', fontSize: 13, fontWeight: 600 }}>{error}</div>}
        {ok && <div style={{ color: '#2ECC71', fontSize: 13, fontWeight: 700 }}>{ok}</div>}

        <button className="btn-orange" type="submit" disabled={loading} style={{ alignSelf: 'flex-start', padding: '15px 30px', fontSize: 16, fontWeight: 800 }}>
          <Icon name="bolt" size={18} color="#fff" />
          {loading ? 'Publicando…' : 'Publicar favor'}
        </button>
      </form>
    </div>
  );
}

export default function NuevoFavorPage() {
  return (
    <Suspense>
      <NuevoFavorContent />
    </Suspense>
  );
}
