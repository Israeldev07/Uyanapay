import { PrismaClient, Role, Transporte, EstadoVerificacion } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  const uce = await prisma.university.upsert({
    where: { name: 'Universidad Central' },
    update: {},
    create: { name: 'Universidad Central', campus: 'Campus Principal' },
  });

  const categories = [
    { slug: 'comida', name: 'Comida', icon: 'bag', description: 'Compra y entrega de almuerzos, snacks y bebidas dentro del campus.', basePrice: 1.5, avgMinutes: 25 },
    { slug: 'materiales', name: 'Materiales', icon: 'book', description: 'Marcadores, cuadernos, copias y todo lo que necesites para tu clase.', basePrice: 1.0, avgMinutes: 15 },
    { slug: 'tramites', name: 'Trámites', icon: 'doc', description: 'Pagos, filas, entrega de documentos y gestiones administrativas.', basePrice: 3.0, avgMinutes: 45 },
    { slug: 'impresiones', name: 'Impresiones', icon: 'printer', description: 'Imprime, escanea y anilla tus trabajos sin salir del aula.', basePrice: 0.8, avgMinutes: 10 },
    { slug: 'entregas', name: 'Entregas', icon: 'box', description: 'Envía y recibe paquetes entre facultades de forma rápida.', basePrice: 2.0, avgMinutes: 25 },
    { slug: 'tecnologia', name: 'Tecnología', icon: 'chip', description: 'Soporte, instalación y reparación de tus dispositivos.', basePrice: 5.0, avgMinutes: 60 },
    { slug: 'diseno', name: 'Diseño', icon: 'pen', description: 'Diseño gráfico, presentaciones y material visual para tus proyectos.', basePrice: 4.0, avgMinutes: 90 },
    { slug: 'administracion', name: 'Administración', icon: 'grid', description: 'Asesoría administrativa, contable y de gestión de proyectos.', basePrice: 5.0, avgMinutes: 60 },
    { slug: 'tutorias', name: 'Tutorías', icon: 'cap', description: 'Refuerzo académico entre estudiantes de la comunidad.', basePrice: 4.0, avgMinutes: 60 },
  ];
  for (const c of categories) {
    await prisma.category.upsert({ where: { slug: c.slug }, update: c, create: c });
  }

  const password = await bcrypt.hash('uyanapay123', 10);

  const admin = await prisma.user.upsert({
    where: { email: 'admin@uyanapay.app' },
    update: {},
    create: {
      email: 'admin@uyanapay.app',
      passwordHash: password,
      firstName: 'Admin',
      lastName: 'UYanapay',
      phone: '0990000000',
      role: Role.ADMIN,
      acceptedTos: true,
      universityId: uce.id,
      wallet: { create: {} },
    },
  });

  const cliente = await prisma.user.upsert({
    where: { email: 'cristian@uyanapay.app' },
    update: {},
    create: {
      email: 'cristian@uyanapay.app',
      passwordHash: password,
      firstName: 'Cristian',
      lastName: 'R.',
      phone: '0991111111',
      role: Role.CLIENTE,
      career: 'Ingeniería de Software',
      acceptedTos: true,
      universityId: uce.id,
      wallet: { create: { balance: 24.5 } },
    },
  });

  const yanapayer = await prisma.user.upsert({
    where: { email: 'maria@uyanapay.app' },
    update: {},
    create: {
      email: 'maria@uyanapay.app',
      passwordHash: password,
      firstName: 'María',
      lastName: 'Q.',
      phone: '0992222222',
      role: Role.YANAPAYER,
      career: 'Administración',
      acceptedTos: true,
      universityId: uce.id,
      wallet: { create: {} },
      yanapayerProfile: {
        create: {
          cedula: '1700000000',
          semester: 6,
          transport: Transporte.BICICLETA,
          verification: EstadoVerificacion.APROBADO,
          isAvailable: true,
        },
      },
    },
  });

  await prisma.coupon.upsert({
    where: { code: 'UYANA50' },
    update: {},
    create: { code: 'UYANA50', discountPct: 50, maxUses: 1000 },
  });

  console.log('Seed listo:', { admin: admin.email, cliente: cliente.email, yanapayer: yanapayer.email });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
