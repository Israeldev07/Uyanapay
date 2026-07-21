import { Icon, IconName } from '@/components/Icon';

export function ComingSoon({ title, icon }: { title: string; icon: IconName }) {
  return (
    <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 40 }}>
      <div style={{ textAlign: 'center' }}>
        <div
          style={{
            width: 72,
            height: 72,
            margin: '0 auto 18px',
            borderRadius: 22,
            background: '#EAF0FF',
            color: '#1E5EFF',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Icon name={icon} size={32} color="#1E5EFF" />
        </div>
        <h1 style={{ fontFamily: 'var(--font-grotesk)', fontWeight: 700, fontSize: 26, margin: '0 0 8px', letterSpacing: '-.02em' }}>
          {title}
        </h1>
        <p style={{ color: '#626B7A', fontSize: 14, margin: 0 }}>Esta sección estará disponible muy pronto.</p>
      </div>
    </div>
  );
}
