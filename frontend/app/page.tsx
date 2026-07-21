'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { Icon, Stars } from '@/components/Icon';
import { LogoMark, LogoText } from '@/components/Logo';
import {
  CATEGORIES,
  MENU,
  PLACEHOLDERS,
  SERVICES,
  STATS,
  STEPS,
  WHY,
} from '@/lib/data';

const grotesk = { fontFamily: 'var(--font-grotesk)' } as const;

export default function LandingPage() {
  const [ph, setPh] = useState(0);

  useEffect(() => {
    const t = setInterval(() => setPh((p) => (p + 1) % PLACEHOLDERS.length), 2200);
    return () => clearInterval(t);
  }, []);

  return (
    <div style={{ minHeight: '100vh', display: 'flex', justifyContent: 'center', padding: '24px 12px 80px' }}>
      <div
        style={{
          width: '100%',
          maxWidth: 1440,
          background: '#fff',
          boxShadow: '0 30px 80px rgba(14,21,38,.14)',
          borderRadius: 18,
          overflow: 'hidden',
        }}
      >
        {/* ===== Header ===== */}
        <header
          style={{
            height: 90,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 18,
            padding: '0 32px',
            borderBottom: '1px solid #EEF1F7',
            position: 'sticky',
            top: 0,
            background: 'rgba(255,255,255,.92)',
            backdropFilter: 'blur(8px)',
            zIndex: 20,
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <LogoMark />
            <div style={{ lineHeight: 1.05 }}>
              <LogoText />
              <div style={{ fontSize: 10.5, color: '#8b93a3', fontWeight: 500, marginTop: 1 }}>
                Conexión universitaria a tu servicio
              </div>
            </div>
          </div>
          <nav className="nav-desktop">
            {MENU.map((label, i) => (
              <a
                key={label}
                href="#"
                style={{
                  fontSize: 13,
                  fontWeight: 600,
                  whiteSpace: 'nowrap',
                  color: i === 0 ? '#1E5EFF' : i === 3 ? '#FF8A00' : '#4c5567',
                }}
              >
                {label}
              </a>
            ))}
          </nav>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexShrink: 0 }}>
            <button
              aria-label="Buscar"
              style={{
                width: 36,
                height: 36,
                borderRadius: 10,
                border: '1px solid #E7EAF0',
                background: '#fff',
                color: '#626B7A',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
              }}
            >
              <Icon name="search" size={19} />
            </button>
            <Link href="/login" style={{ fontSize: 13, fontWeight: 700, whiteSpace: 'nowrap', color: '#0E1526' }}>
              Iniciar sesión
            </Link>
            <Link href="/dashboard/nuevo-favor">
              <button className="btn-orange" style={{ padding: '11px 17px', fontSize: 13 }}>
                <Icon name="bolt" size={17} color="#fff" />
                Solicitar un favor
              </button>
            </Link>
          </div>
        </header>

        {/* ===== Hero ===== */}
        <section
          className="hero-grid"
          style={{
            padding: '64px 40px 60px',
            background: 'radial-gradient(1200px 500px at 78% 10%,#EAF0FF 0%,rgba(234,240,255,0) 60%)',
          }}
        >
          <div style={{ alignSelf: 'center' }}>
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 8,
                background: '#EAF0FF',
                color: '#1E5EFF',
                fontWeight: 700,
                fontSize: 12,
                padding: '7px 13px',
                borderRadius: 999,
                marginBottom: 22,
              }}
            >
              <Icon name="shield" size={15} color="#1E5EFF" /> Comunidad universitaria verificada
            </div>
            <h1
              style={{
                ...grotesk,
                fontWeight: 700,
                fontSize: 'clamp(42px, 5vw, 66px)',
                lineHeight: 1.02,
                letterSpacing: '-.03em',
                margin: '0 0 20px',
              }}
            >
              Tu tiempo
              <br />
              vale <span style={{ color: '#1E5EFF' }}>más.</span>
            </h1>
            <p style={{ fontSize: 17, lineHeight: 1.6, color: '#4c5567', maxWidth: 520, margin: '0 0 30px' }}>
              UYanapay conecta estudiantes, docentes y personal universitario con personas dispuestas a
              ayudarte en compras, trámites, entregas y servicios profesionales dentro de la comunidad
              universitaria.
            </p>
            <div style={{ display: 'flex', gap: 14, marginBottom: 30, flexWrap: 'wrap' }}>
              <Link href="/dashboard/nuevo-favor">
                <button className="btn-primary" style={{ padding: '16px 26px' }}>
                  <Icon name="bolt" size={17} color="#fff" />
                  Solicitar un favor
                </button>
              </Link>
              <Link href="/registro?tipo=yanapayer">
                <button className="btn-ghost" style={{ padding: '16px 26px' }}>
                  <Icon name="wallet" size={18} color="#0E1526" />
                  Quiero ganar dinero
                </button>
              </Link>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <Stars />
              <span style={{ fontSize: 14, fontWeight: 600, color: '#4c5567' }}>
                Más de <b style={{ color: '#0E1526' }}>500 estudiantes</b> conectados
              </span>
            </div>
          </div>

          {/* Ilustración (composición de tarjetas flotantes) */}
          <div style={{ position: 'relative', minHeight: 460, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <div
              style={{
                position: 'absolute',
                width: 360,
                height: 360,
                borderRadius: '50%',
                background: 'linear-gradient(135deg,#1E5EFF,#5b86ff)',
                filter: 'blur(4px)',
                opacity: 0.14,
              }}
            />
            <div style={{ position: 'relative', width: 420, height: 440, maxWidth: '100%' }}>
              {/* campus card */}
              <div
                style={{
                  position: 'absolute',
                  left: 70,
                  top: 34,
                  width: 280,
                  height: 170,
                  borderRadius: 22,
                  background: 'linear-gradient(160deg,#1E5EFF,#3f74ff)',
                  boxShadow: '0 30px 50px rgba(30,94,255,.32)',
                  padding: 20,
                  color: '#fff',
                  animation: 'floaty 6s ease-in-out infinite',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontWeight: 700, fontSize: 13, opacity: 0.9 }}>
                  <Icon name="cap" size={16} color="#fff" /> Universidad
                </div>
                <div style={{ marginTop: 14, display: 'flex', gap: 6, alignItems: 'flex-end', height: 70 }}>
                  <div style={{ width: 26, height: 44, background: 'rgba(255,255,255,.28)', borderRadius: '5px 5px 0 0' }} />
                  <div style={{ width: 26, height: 64, background: 'rgba(255,255,255,.4)', borderRadius: '5px 5px 0 0' }} />
                  <div style={{ width: 26, height: 54, background: 'rgba(255,255,255,.28)', borderRadius: '5px 5px 0 0' }} />
                  <div style={{ flex: 1 }} />
                  <div
                    style={{
                      width: 38,
                      height: 38,
                      borderRadius: 10,
                      background: '#FF8A00',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: '#fff',
                    }}
                  >
                    <Icon name="map" size={18} color="#fff" />
                  </div>
                </div>
              </div>
              {/* map chip */}
              <div
                style={{
                  position: 'absolute',
                  left: 0,
                  top: 150,
                  width: 170,
                  height: 130,
                  borderRadius: 20,
                  background: '#fff',
                  boxShadow: '0 20px 44px rgba(14,21,38,.14)',
                  padding: 14,
                  animation: 'floaty2 7s ease-in-out infinite',
                }}
              >
                <div style={{ fontSize: 11, fontWeight: 700, color: '#8b93a3', display: 'flex', alignItems: 'center', gap: 6 }}>
                  <Icon name="map" size={13} color="#8b93a3" /> En camino
                </div>
                <div style={{ position: 'relative', height: 66, marginTop: 8 }}>
                  <div style={{ position: 'absolute', left: 8, top: 8, width: 10, height: 10, borderRadius: '50%', background: '#1E5EFF' }} />
                  <div style={{ position: 'absolute', right: 8, bottom: 6, width: 12, height: 12, borderRadius: '50%', background: '#FF8A00' }} />
                  <div
                    style={{
                      position: 'absolute',
                      left: 14,
                      top: 14,
                      width: 120,
                      height: 44,
                      borderBottom: '2.5px dashed #c9d3ef',
                      borderRight: '2.5px dashed #c9d3ef',
                      borderRadius: '0 0 18px 0',
                    }}
                  />
                </div>
              </div>
              {/* moto */}
              <div
                style={{
                  position: 'absolute',
                  right: 0,
                  top: 200,
                  width: 130,
                  height: 96,
                  borderRadius: 20,
                  background: 'linear-gradient(160deg,#FF8A00,#ffab44)',
                  boxShadow: '0 22px 40px rgba(255,138,0,.34)',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 6,
                  color: '#fff',
                  animation: 'floaty 5.5s ease-in-out infinite',
                }}
              >
                <span style={{ transform: 'scale(1.4)', display: 'inline-flex' }}>
                  <Icon name="moto" size={22} color="#fff" />
                </span>
                <span style={{ fontSize: 11, fontWeight: 700 }}>Entrega ágil</span>
              </div>
              {/* chat */}
              <div
                style={{
                  position: 'absolute',
                  right: 16,
                  top: 26,
                  width: 150,
                  borderRadius: 16,
                  background: '#fff',
                  boxShadow: '0 18px 40px rgba(14,21,38,.14)',
                  padding: 12,
                  animation: 'floaty2 6.5s ease-in-out infinite',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                  <div
                    style={{
                      width: 26,
                      height: 26,
                      borderRadius: '50%',
                      background: '#EAF0FF',
                      color: '#1E5EFF',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <Icon name="user" size={15} color="#1E5EFF" />
                  </div>
                  <div style={{ fontSize: 11, fontWeight: 700 }}>Yanapayer</div>
                </div>
                <div
                  style={{
                    background: '#F1F4FA',
                    borderRadius: '10px 10px 10px 3px',
                    padding: '7px 10px',
                    fontSize: 11,
                    color: '#4c5567',
                  }}
                >
                  ¡Voy en camino! 🛵
                </div>
              </div>
              {/* notif */}
              <div
                style={{
                  position: 'absolute',
                  left: 210,
                  bottom: 0,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 10,
                  background: '#0E1526',
                  color: '#fff',
                  borderRadius: 14,
                  padding: '11px 14px',
                  boxShadow: '0 18px 34px rgba(14,21,38,.3)',
                  animation: 'floaty 6s ease-in-out infinite',
                }}
              >
                <div
                  style={{
                    width: 30,
                    height: 30,
                    borderRadius: 9,
                    background: '#1E5EFF',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <Icon name="bell" size={19} color="#fff" />
                </div>
                <div style={{ lineHeight: 1.2 }}>
                  <div style={{ fontSize: 12, fontWeight: 700 }}>Favor aceptado</div>
                  <div style={{ fontSize: 10.5, color: '#9aa3b6' }}>hace 1 min</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ===== Buscador inteligente ===== */}
        <section style={{ padding: '16px 40px 60px' }}>
          <div
            style={{
              background: 'linear-gradient(135deg,#111a2e,#1E2A4A)',
              borderRadius: 26,
              padding: '44px 44px 40px',
              color: '#fff',
              position: 'relative',
              overflow: 'hidden',
            }}
          >
            <div
              style={{
                position: 'absolute',
                right: -60,
                top: -60,
                width: 260,
                height: 260,
                borderRadius: '50%',
                background: 'radial-gradient(circle,#1E5EFF 0%,rgba(30,94,255,0) 70%)',
                opacity: 0.5,
              }}
            />
            <h2 style={{ ...grotesk, fontWeight: 700, fontSize: 34, letterSpacing: '-.02em', margin: '0 0 22px', position: 'relative' }}>
              ¿Qué necesitas hoy?
            </h2>
            <div
              style={{
                display: 'flex',
                gap: 12,
                background: '#fff',
                borderRadius: 16,
                padding: '9px 9px 9px 20px',
                maxWidth: 760,
                position: 'relative',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', color: '#9aa3b6' }}>
                <Icon name="search" size={20} color="#9aa3b6" />
              </div>
              <div style={{ flex: 1, display: 'flex', alignItems: 'center', fontSize: 16, color: '#8b93a3', fontWeight: 500 }}>
                {PLACEHOLDERS[ph]}
                <span style={{ width: 2, height: 20, background: '#1E5EFF', marginLeft: 2, animation: 'blink 1s steps(1) infinite' }} />
              </div>
              <button
                style={{
                  background: '#FF8A00',
                  color: '#fff',
                  border: 0,
                  padding: '0 26px',
                  borderRadius: 12,
                  fontWeight: 700,
                  fontSize: 15,
                  cursor: 'pointer',
                }}
              >
                Buscar
              </button>
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, marginTop: 22, position: 'relative' }}>
              {CATEGORIES.map((c) => (
                <div
                  key={c.slug}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 8,
                    background: 'rgba(255,255,255,.08)',
                    border: '1px solid rgba(255,255,255,.14)',
                    color: '#e7ecf6',
                    padding: '9px 15px',
                    borderRadius: 999,
                    fontSize: 13,
                    fontWeight: 600,
                    cursor: 'pointer',
                  }}
                >
                  <span style={{ color: '#8fb0ff', display: 'inline-flex' }}>
                    <Icon name={c.icon} size={18} />
                  </span>
                  {c.label}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ===== Servicios ===== */}
        <section id="servicios" style={{ padding: '0 40px 70px' }}>
          <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: 28, gap: 14, flexWrap: 'wrap' }}>
            <div>
              <div style={{ color: '#FF8A00', fontWeight: 800, fontSize: 13, letterSpacing: '.04em', textTransform: 'uppercase', marginBottom: 8 }}>
                Servicios
              </div>
              <h2 style={{ ...grotesk, fontWeight: 700, fontSize: 36, letterSpacing: '-.02em', margin: 0 }}>
                Todo lo que puedes resolver
              </h2>
            </div>
            <a href="#" style={{ fontWeight: 700, fontSize: 14, display: 'flex', alignItems: 'center', gap: 6 }}>
              Ver todos <Icon name="arrow" size={16} />
            </a>
          </div>
          <div className="services-grid">
            {SERVICES.map((s, i) => {
              const color = i % 2 ? '#FF8A00' : '#1E5EFF';
              return (
                <div key={s.slug} className="svc-card">
                  <div
                    style={{
                      height: 130,
                      background: i % 2 ? 'linear-gradient(135deg,#FF8A00,#ffab44)' : 'linear-gradient(135deg,#1E5EFF,#4f7bff)',
                      position: 'relative',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <div
                      style={{
                        position: 'absolute',
                        inset: 0,
                        backgroundImage: 'repeating-linear-gradient(45deg,rgba(255,255,255,.14) 0 10px,transparent 10px 20px)',
                      }}
                    />
                    <div
                      style={{
                        width: 58,
                        height: 58,
                        borderRadius: 16,
                        background: '#fff',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color,
                        boxShadow: '0 10px 24px rgba(14,21,38,.14)',
                        position: 'relative',
                      }}
                    >
                      <Icon name={s.icon} size={28} color={color} />
                    </div>
                  </div>
                  <div style={{ padding: 20 }}>
                    <h3 style={{ ...grotesk, fontWeight: 600, fontSize: 19, margin: '0 0 7px' }}>{s.title}</h3>
                    <p style={{ fontSize: 13.5, lineHeight: 1.55, color: '#626B7A', margin: '0 0 16px', minHeight: 42 }}>{s.desc}</p>
                    <div style={{ display: 'flex', gap: 18, marginBottom: 16, paddingTop: 14, borderTop: '1px solid #F0F2F7' }}>
                      <div>
                        <div style={{ fontSize: 11, color: '#9aa3b6', fontWeight: 600, marginBottom: 2 }}>Tiempo prom.</div>
                        <div style={{ fontSize: 14, fontWeight: 700, display: 'flex', alignItems: 'center', gap: 5 }}>
                          <Icon name="clock" size={14} color="#0E1526" />
                          {s.time}
                        </div>
                      </div>
                      <div>
                        <div style={{ fontSize: 11, color: '#9aa3b6', fontWeight: 600, marginBottom: 2 }}>Precio desde</div>
                        <div style={{ fontSize: 14, fontWeight: 700, color: '#1E5EFF' }}>{s.price}</div>
                      </div>
                    </div>
                    <Link href={`/dashboard/nuevo-favor?categoria=${s.slug}`}>
                      <button className="svc-btn">Solicitar</button>
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* ===== ¿Cómo funciona? ===== */}
        <section id="como-funciona" style={{ padding: '0 40px 70px' }}>
          <div style={{ textAlign: 'center', marginBottom: 32 }}>
            <div style={{ color: '#FF8A00', fontWeight: 800, fontSize: 13, letterSpacing: '.04em', textTransform: 'uppercase', marginBottom: 8 }}>
              Proceso
            </div>
            <h2 style={{ ...grotesk, fontWeight: 700, fontSize: 36, letterSpacing: '-.02em', margin: 0 }}>¿Cómo funciona?</h2>
          </div>
          <div className="steps-grid">
            {STEPS.map((step, i) => (
              <div
                key={step.n}
                style={{
                  border: '1px solid #EAEDF4',
                  borderRadius: 20,
                  padding: 26,
                  background: '#fff',
                  textAlign: 'center',
                }}
              >
                <div
                  style={{
                    width: 54,
                    height: 54,
                    margin: '0 auto 16px',
                    borderRadius: 16,
                    background: i % 2 ? '#FFF2E3' : '#EAF0FF',
                    color: i % 2 ? '#FF8A00' : '#1E5EFF',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: 24,
                    fontWeight: 700,
                    fontFamily: 'var(--font-grotesk)',
                  }}
                >
                  {i + 1}
                </div>
                <h3 style={{ ...grotesk, fontWeight: 600, fontSize: 18, margin: '0 0 8px' }}>{step.title}</h3>
                <p style={{ fontSize: 13.5, lineHeight: 1.55, color: '#626B7A', margin: 0 }}>{step.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ===== ¿Por qué UYanapay? ===== */}
        <section style={{ padding: '0 40px 70px' }}>
          <div style={{ textAlign: 'center', marginBottom: 32 }}>
            <h2 style={{ ...grotesk, fontWeight: 700, fontSize: 36, letterSpacing: '-.02em', margin: 0 }}>
              ¿Por qué <span style={{ color: '#1E5EFF' }}>UYanapay</span>?
            </h2>
          </div>
          <div className="why-grid">
            {WHY.map((w) => (
              <div
                key={w.label}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 12,
                  background: '#F7F8FB',
                  border: '1px solid #EAEDF4',
                  borderRadius: 14,
                  padding: '14px 16px',
                  fontWeight: 700,
                  fontSize: 14,
                }}
              >
                <span style={{ color: '#2ECC71', display: 'inline-flex' }}>
                  <Icon name={w.icon} size={18} color="#2ECC71" />
                </span>
                {w.label}
              </div>
            ))}
          </div>
        </section>

        {/* ===== Estadísticas ===== */}
        <section style={{ padding: '0 40px 70px' }}>
          <div className="stats-grid">
            {STATS.map((s, i) => (
              <div
                key={s.label}
                style={{
                  background: i % 2 ? '#FFF7EE' : '#EAF0FF',
                  borderRadius: 20,
                  padding: '30px 24px',
                  textAlign: 'center',
                }}
              >
                <div style={{ ...grotesk, fontWeight: 700, fontSize: 42, letterSpacing: '-.02em', color: i % 2 ? '#FF8A00' : '#1E5EFF' }}>
                  {s.value}
                </div>
                <div style={{ fontSize: 14, fontWeight: 700, color: '#4c5567', marginTop: 4 }}>{s.label}</div>
              </div>
            ))}
          </div>
        </section>

        {/* ===== Convocatoria ===== */}
        <section style={{ padding: '0 40px 70px' }}>
          <div
            style={{
              background: 'linear-gradient(135deg,#1E5EFF,#3f74ff)',
              borderRadius: 26,
              padding: '44px 40px',
              color: '#fff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: 20,
              flexWrap: 'wrap',
              position: 'relative',
              overflow: 'hidden',
            }}
          >
            <div
              style={{
                position: 'absolute',
                right: -40,
                bottom: -60,
                width: 220,
                height: 220,
                borderRadius: '50%',
                background: 'rgba(255,255,255,.1)',
              }}
            />
            <h2 style={{ ...grotesk, fontWeight: 700, fontSize: 32, letterSpacing: '-.02em', margin: 0, position: 'relative' }}>
              ¿Quieres ganar dinero entre clases?
            </h2>
            <Link href="/registro?tipo=yanapayer" style={{ position: 'relative' }}>
              <button className="btn-orange" style={{ padding: '16px 30px', fontSize: 16 }}>
                Ser Yanapayer
              </button>
            </Link>
          </div>
        </section>

        {/* ===== Footer ===== */}
        <footer
          style={{
            background: '#0E1526',
            color: '#9aa3b6',
            padding: '36px 40px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            fontSize: 13,
            gap: 16,
            flexWrap: 'wrap',
          }}
        >
          <LogoText dark size={16} />
          <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
            <a href="#" style={{ color: '#9aa3b6' }}>Facebook</a>
            <a href="#" style={{ color: '#9aa3b6' }}>Instagram</a>
            <a href="#" style={{ color: '#9aa3b6' }}>TikTok</a>
            <a href="#" style={{ color: '#9aa3b6' }}>LinkedIn</a>
          </div>
          <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
            <a href="#" style={{ color: '#9aa3b6' }}>Privacidad</a>
            <a href="#" style={{ color: '#9aa3b6' }}>Cookies</a>
            <a href="#" style={{ color: '#9aa3b6' }}>Términos</a>
          </div>
          <div>© 2026 UYanapay · Conexión universitaria a tu servicio</div>
        </footer>
      </div>
    </div>
  );
}
