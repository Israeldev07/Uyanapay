'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Icon, IconName } from '@/components/Icon';
import { LogoMark, LogoText } from '@/components/Logo';
import { clearToken } from '@/lib/api';

const NAV: { href: string; label: string; icon: IconName }[] = [
  { href: '/dashboard', label: 'Inicio', icon: 'home' },
  { href: '/dashboard/nuevo-favor', label: 'Nuevo Favor', icon: 'plus' },
  { href: '/dashboard/disponibles', label: 'Solicitudes disponibles', icon: 'compass' },
  { href: '/dashboard/solicitudes', label: 'Mis solicitudes', icon: 'list' },
  { href: '/dashboard/favoritos', label: 'Favoritos', icon: 'heart' },
  { href: '/dashboard/pagos', label: 'Pagos', icon: 'wallet' },
  { href: '/dashboard/mensajes', label: 'Mensajes', icon: 'chat' },
  { href: '/dashboard/perfil', label: 'Perfil', icon: 'user' },
  { href: '/dashboard/configuracion', label: 'Configuración', icon: 'settings' },
];

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();

  return (
    <div style={{ minHeight: '100vh', display: 'flex', background: '#F5F7FB' }}>
      {/* Sidebar */}
      <aside
        style={{
          width: 250,
          background: '#0E1526',
          color: '#fff',
          padding: '26px 18px',
          display: 'flex',
          flexDirection: 'column',
          flexShrink: 0,
          position: 'sticky',
          top: 0,
          height: '100vh',
        }}
      >
        <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: 11, padding: '0 8px 26px' }}>
          <LogoMark size={38} />
          <LogoText dark size={18} />
        </Link>
        <nav style={{ display: 'flex', flexDirection: 'column', gap: 3, flex: 1 }}>
          {NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`sidebar-link${pathname === item.href ? ' active' : ''}`}
            >
              <span style={{ opacity: 0.95, display: 'inline-flex' }}>
                <Icon name={item.icon} size={19} color="currentColor" />
              </span>
              {item.label}
            </Link>
          ))}
          <button
            onClick={() => {
              clearToken();
              router.push('/login');
            }}
            className="sidebar-link"
            style={{ background: 'transparent', border: 0, cursor: 'pointer', textAlign: 'left', width: '100%' }}
          >
            <span style={{ display: 'inline-flex' }}>
              <Icon name="logout" size={19} color="currentColor" />
            </span>
            Cerrar sesión
          </button>
        </nav>
        <div style={{ marginTop: 16, background: 'rgba(255,255,255,.06)', borderRadius: 14, padding: 16 }}>
          <div style={{ fontSize: 13, fontWeight: 700, marginBottom: 4 }}>¿Necesitas ayuda?</div>
          <div style={{ fontSize: 12, color: '#9aa3b6', lineHeight: 1.5, marginBottom: 12 }}>
            Soporte disponible 24/7 para tus favores.
          </div>
          <button
            style={{
              width: '100%',
              background: '#1E5EFF',
              color: '#fff',
              border: 0,
              padding: 10,
              borderRadius: 10,
              fontWeight: 700,
              fontSize: 13,
              cursor: 'pointer',
            }}
          >
            Contactar
          </button>
        </div>
      </aside>

      {/* Contenido */}
      <main style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>{children}</main>
    </div>
  );
}
