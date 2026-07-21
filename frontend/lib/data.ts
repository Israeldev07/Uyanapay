import type { IconName } from '@/components/Icon';

export interface CategoryItem {
  slug: string;
  label: string;
  icon: IconName;
}

export const CATEGORIES: CategoryItem[] = [
  { slug: 'comida', label: 'Comida', icon: 'bag' },
  { slug: 'materiales', label: 'Materiales', icon: 'book' },
  { slug: 'tramites', label: 'Trámites', icon: 'doc' },
  { slug: 'impresiones', label: 'Impresiones', icon: 'printer' },
  { slug: 'entregas', label: 'Entregas', icon: 'box' },
  { slug: 'tecnologia', label: 'Tecnología', icon: 'chip' },
  { slug: 'diseno', label: 'Diseño', icon: 'pen' },
  { slug: 'administracion', label: 'Administración', icon: 'grid' },
];

export interface ServiceItem {
  slug: string;
  icon: IconName;
  title: string;
  desc: string;
  time: string;
  price: string;
}

export const SERVICES: ServiceItem[] = [
  {
    slug: 'comida',
    icon: 'bag',
    title: 'Comida',
    desc: 'Compra y entrega de almuerzos, snacks y bebidas dentro del campus.',
    time: '20-30 min',
    price: '$1.50',
  },
  {
    slug: 'materiales',
    icon: 'book',
    title: 'Materiales',
    desc: 'Marcadores, cuadernos, copias y todo lo que necesites para tu clase.',
    time: '15 min',
    price: '$1.00',
  },
  {
    slug: 'tramites',
    icon: 'doc',
    title: 'Trámites',
    desc: 'Pagos, filas, entrega de documentos y gestiones administrativas.',
    time: '45 min',
    price: '$3.00',
  },
  {
    slug: 'impresiones',
    icon: 'printer',
    title: 'Impresiones',
    desc: 'Imprime, escanea y anilla tus trabajos sin salir del aula.',
    time: '10 min',
    price: '$0.80',
  },
  {
    slug: 'entregas',
    icon: 'box',
    title: 'Entregas',
    desc: 'Envía y recibe paquetes entre facultades de forma rápida.',
    time: '25 min',
    price: '$2.00',
  },
  {
    slug: 'tecnologia',
    icon: 'chip',
    title: 'Tecnología',
    desc: 'Soporte, instalación y reparación de tus dispositivos.',
    time: '60 min',
    price: '$5.00',
  },
];

export const PLACEHOLDERS = [
  'Comprar un marcador...',
  'Imprimir un documento...',
  'Comprar almuerzo...',
  'Llevar un paquete...',
];

export const STEPS = [
  { n: '①', title: 'Publica tu solicitud', desc: 'Describe lo que necesitas, dónde y cuánto ofreces.' },
  { n: '②', title: 'Un estudiante acepta', desc: 'Un Yanapayer verificado toma tu favor en segundos.' },
  { n: '③', title: 'Realiza el servicio', desc: 'Sigue el avance en tiempo real con GPS y chat integrado.' },
  { n: '④', title: 'Califica la experiencia', desc: 'Paga seguro, deja tu calificación y una propina si quieres.' },
];

export const WHY: { icon: IconName; label: string }[] = [
  { icon: 'check', label: 'Estudiantes verificados' },
  { icon: 'map', label: 'Seguimiento GPS' },
  { icon: 'shield', label: 'Pagos seguros' },
  { icon: 'chat', label: 'Chat integrado' },
  { icon: 'bolt', label: 'Atención rápida' },
  { icon: 'star', label: 'Calificaciones reales' },
  { icon: 'bell', label: 'Soporte 24/7' },
  { icon: 'cap', label: 'Comunidad universitaria' },
];

export const STATS = [
  { value: '1000+', label: 'Usuarios' },
  { value: '300+', label: 'Estudiantes prestadores' },
  { value: '5000+', label: 'Servicios realizados' },
  { value: '98%', label: 'Satisfacción' },
];

export const MENU = [
  'Inicio',
  'Servicios',
  'Cómo funciona',
  'Conviértete en Yanapayer',
  'Empresas',
  'Nosotros',
  'Blog',
  'Ayuda',
];
