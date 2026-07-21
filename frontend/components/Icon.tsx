// Set de iconos de trazo del diseño UYanapay (mismo path-set del mockup HTML)
const PATHS: Record<string, string> = {
  search: 'M11 4a7 7 0 1 0 0 14 7 7 0 0 0 0-14zM20 20l-4-4',
  bolt: 'M13 3L5 14h6l-1 7 9-11h-6l1-7z',
  shield: 'M12 3l7 3v6c0 4-3 7-7 9-4-2-7-5-7-9V6l7-3z',
  wallet: 'M3 8h15a2 2 0 0 1 2 2v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8zM3 8V7a2 2 0 0 1 2-2h11M16 13h2',
  cap: 'M2 9l10-4 10 4-10 4L2 9zM6 11v4c0 1 3 2 6 2s6-1 6-2v-4',
  map: 'M9 4L3 6v14l6-2 6 2 6-2V4l-6 2-6-2zM9 4v14M15 6v14',
  moto: 'M5 17a2.4 2.4 0 1 0 0-4.8 2.4 2.4 0 0 0 0 4.8zM17 17a2.4 2.4 0 1 0 0-4.8 2.4 2.4 0 0 0 0 4.8zM7 15h6l3-5h3M6 10h4l3 5M13 10l1-3h3',
  bell: 'M6 9a6 6 0 0 1 12 0c0 5 2 6 2 6H4s2-1 2-6zM10 20h4',
  user: 'M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM4 20c0-3.3 3.6-5 8-5s8 1.7 8 5',
  bag: 'M6 8h12l1 12H5L6 8zM9 8V6a3 3 0 0 1 6 0v2',
  book: 'M5 4h11a2 2 0 0 1 2 2v14H7a2 2 0 0 1-2-2V4zM18 20H7',
  doc: 'M7 3h7l4 4v14H7V3zM14 3v4h4M9 12h6M9 16h5',
  printer: 'M7 9V3h10v6M7 18H5a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v3a2 2 0 0 1-2 2h-2M7 14h10v6H7z',
  box: 'M3 8l9-4 9 4v8l-9 4-9-4V8zM3 8l9 4 9-4M12 12v8',
  chip: 'M8 8h8v8H8zM9 3v3M15 3v3M9 18v3M15 18v3M3 9h3M3 15h3M18 9h3M18 15h3',
  pen: 'M4 20l4-1L18 9l-3-3L5 16l-1 4zM14 6l3 3',
  grid: 'M4 4h6v6H4zM14 4h6v6h-6zM4 14h6v6H4zM14 14h6v6h-6z',
  home: 'M3 11l9-8 9 8M5 10v10h5v-6h4v6h5V10',
  plus: 'M12 5v14M5 12h14',
  list: 'M8 6h13M8 12h13M8 18h13M3.5 6h.01M3.5 12h.01M3.5 18h.01',
  heart: 'M12 21C12 21 4 13.5 4 8.5A4 4 0 0 1 12 6A4 4 0 0 1 20 8.5C20 13.5 12 21 12 21Z',
  chat: 'M4 5h16v11H8l-4 4V5z',
  settings:
    'M12 8.5a3.5 3.5 0 1 0 0 7 3.5 3.5 0 0 0 0-7zM12 2v2.5M12 19.5V22M4.2 4.2l1.8 1.8M18 18l1.8 1.8M2 12h2.5M19.5 12H22M4.2 19.8L6 18M18 6l1.8-1.8',
  clock: 'M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18zM12 7v5l3 2',
  check: 'M4 12l5 5L20 6',
  pulse: 'M3 12h4l2-6 4 12 2-6h6',
  compass: 'M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18zM15 9l-2 4-4 2 2-4 4-2z',
  arrow: 'M5 12h14M13 6l6 6-6 6',
  folder: 'M3 6h6l2 2h10v11H3V6z',
  phone: 'M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2z',
  camera: 'M4 8h3l2-3h6l2 3h3v12H4V8zM12 17a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7z',
  pin: 'M12 21s-7-6.4-7-11a7 7 0 0 1 14 0c0 4.6-7 11-7 11zM12 12a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5z',
  logout: 'M9 4H5a1 1 0 0 0-1 1v14a1 1 0 0 0 1 1h4M16 8l4 4-4 4M20 12H10',
};

export type IconName = keyof typeof PATHS | 'star';

interface IconProps {
  name: IconName;
  size?: number;
  color?: string;
}

export function Icon({ name, size = 22, color = 'currentColor' }: IconProps) {
  if (name === 'star') {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill={color} stroke="none">
        <path d="M12 3l2.6 6.3 6.8.5-5.2 4.4 1.7 6.6L12 17.6 6.3 21.3 8 14.7 2.8 10.3l6.8-.5L12 3z" />
      </svg>
    );
  }
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      strokeWidth={1.9}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d={PATHS[name]} />
    </svg>
  );
}

export function Stars({ count = 5, size = 17 }: { count?: number; size?: number }) {
  return (
    <span style={{ display: 'flex', gap: 2, color: '#FF8A00' }}>
      {Array.from({ length: count }, (_, i) => (
        <Icon key={i} name="star" size={size} color="#FF8A00" />
      ))}
    </span>
  );
}
