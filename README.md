# UYanapay

**Conexión universitaria a tu servicio.**

Plataforma de delivery y favores para la comunidad universitaria: conecta estudiantes, docentes y personal con **Yanapayers** (estudiantes prestadores) para compras, trámites, entregas, impresiones y servicios profesionales dentro del campus.

## Estructura del monorepo

```
Uyanapay/
├── backend/      API REST + WebSockets — NestJS + Prisma + PostgreSQL
├── frontend/     Web — Next.js (App Router) + TypeScript, diseño UYanapay
├── docker-compose.yml   PostgreSQL (master + read replica opcional)
└── README.md
```

## Identidad visual (del manual de marca)

| Token | Valor | Uso |
|---|---|---|
| Azul institucional | `#1E5EFF` | Confianza, seguridad, tecnología |
| Naranja | `#FF8A00` | Acción, rapidez, energía |
| Éxito | `#2ECC71` | Estados positivos |
| Advertencia | `#F4B400` | Alertas |
| Error | `#E53935` | Errores |
| Fondo | `#F8FAFC` / `#EDF0F6` | Superficies |
| Títulos | Space Grotesk (bold) | Encabezados |
| Texto | Manrope | Cuerpo |

## Puesta en marcha

### 1. Base de datos

```bash
docker compose up -d db
# réplica de lectura opcional:
docker compose --profile replica up -d
```

### 2. Backend (puerto 4000)

```bash
cd backend
copy .env.example .env
npm install
npx prisma migrate dev --name init   # crea el esquema
npm run seed                         # categorías, cupón UYANA50 y usuarios demo
npm run start:dev
```

Usuarios demo (contraseña `uyanapay123`):
- `cristian@uyanapay.app` — cliente
- `maria@uyanapay.app` — Yanapayer verificada
- `admin@uyanapay.app` — administrador

### 3. Frontend (puerto 3000)

```bash
cd frontend
npm install
npm run dev
```

Abre <http://localhost:3000>. Las llamadas a `/api/v1/*` se proxean automáticamente al backend.

## Arquitectura del backend

### Módulos NestJS

| Módulo | Responsabilidad | Endpoints principales |
|---|---|---|
| `auth` | Registro cliente/Yanapayer, login, JWT | `POST /auth/register/cliente`, `POST /auth/register/yanapayer`, `POST /auth/login`, `GET /auth/me` |
| `users` | Perfil, disponibilidad y ubicación del Yanapayer | `GET/PATCH /users/me`, `PATCH /users/me/disponibilidad`, `PATCH /users/me/ubicacion` |
| `categories` | Catálogo de servicios | `GET /categorias`, `GET /categorias/:slug` |
| `favors` | Ciclo de vida del favor (máquina de estados) | `POST /favores`, `GET /favores/mios`, `GET /favores/disponibles`, `POST /favores/:id/aceptar`, `PATCH /favores/:id/estado` |
| `tracking` | Seguimiento GPS en tiempo real | WS `/tracking` (`location:update` → `location:changed`), `GET /seguimiento/:favorId` |
| `chat` | Mensajería por favor (texto, imagen, documento, ubicación, audio) | `GET /chat/favor/:favorId`, `POST /chat/:id/mensajes`, WS `/chat` |
| `wallet` | Billetera: saldo, recargas, retiros | `GET /billetera`, `POST /billetera/recargar`, `POST /billetera/retirar` |
| `ratings` | Calificaciones, comentarios y propinas | `POST /calificaciones/favor/:favorId`, `GET /calificaciones/usuario/:userId` |
| `admin` | Panel administrador: estadísticas, verificaciones, incidentes, cupones | `GET /admin/estadisticas`, `GET /admin/usuarios`, `PATCH /admin/verificaciones/:id`, `POST /admin/cupones`, … |

### Máquina de estados del favor

```
PUBLICADO → ACEPTADO → EN_CAMINO → ENTREGADO → FINALIZADO
     └──────────┴────────────┴→ CANCELADO
```

- **Aceptación atómica**: `updateMany` condicionado al estado `PUBLICADO` evita que dos Yanapayers acepten el mismo favor.
- **Liquidación ACID**: al finalizar, una transacción Prisma (`$transaction`) cobra al cliente, acredita la ganancia al Yanapayer y registra la comisión de la plataforma (`COMMISSION_RATE`, 10 % por defecto). Si el saldo es insuficiente, todo se revierte.
- **Propinas** dentro de la misma transacción de calificación.

### Base de datos (PostgreSQL, 3FN)

Entidades: `universities`, `users`, `yanapayer_profiles`, `categories`, `favor_requests`, `tracking_points`, `conversations`, `messages`, `wallets`, `transactions`, `ratings`, `coupons`, `incidents`, `notifications`.

- Índices B-Tree sobre las rutas de consulta calientes (`status+createdAt`, `clientId+status`, `walletId+createdAt`, etc.).
- Montos en `Decimal(10,2)`; coordenadas en `Decimal(9,6)`.
- Migraciones versionadas con **Prisma Migrate**; datos semilla con `npm run seed`.
- Alta disponibilidad: replicación física master-replica (ver `docker-compose.yml`); las lecturas intensivas (catálogo, historiales, estadísticas del admin) pueden apuntarse a `DATABASE_REPLICA_URL`.

### Tiempo real

Dos gateways Socket.IO:
- `/tracking` — el Yanapayer emite `location:update`; los clientes de la sala `favor:{id}` reciben `location:changed` y el punto queda persistido para reconstruir la ruta.
- `/chat` — `message:send` persiste y difunde `message:new` a la sala `conv:{id}`.

## Frontend (Next.js)

Portado 1:1 del diseño HTML de UYanapay (tarjetas flotantes del hero, buscador inteligente con placeholder rotativo, grid de servicios con hover azul, dashboard con sidebar oscuro):

| Ruta | Pantalla |
|---|---|
| `/` | Landing: header 90px, hero "Tu tiempo vale más.", buscador inteligente, categorías, servicios, cómo funciona, por qué UYanapay, estadísticas, convocatoria Yanapayer, footer |
| `/login` | Inicio de sesión |
| `/registro` | Decisión Soy cliente / Soy Yanapayer + formularios completos |
| `/dashboard` | Dashboard cliente: saludo, saldo, widgets, actividad semanal, historial |
| `/dashboard/nuevo-favor` | Formulario de nuevo favor (categoría, descripción, ubicación, destino, fecha, urgencia, presupuesto, método de pago, cupón) |
| `/dashboard/solicitudes` | Mis solicitudes con estados en vivo |
| `/dashboard/pagos` | Billetera: saldos, recarga y movimientos |

El diseño es responsivo (los grids colapsan bajo 1100px / 620px) y usa los tokens de marca definidos en `app/globals.css`.

## Pruebas y calidad

- Validación de entrada global con `class-validator` (`whitelist` + `forbidNonWhitelisted`).
- Autorización por roles (`CLIENTE`, `YANAPAYER`, `ADMIN`) con guard dedicado.
- Antes de producción: pruebas de estrés sobre `POST /favores` y la liquidación, y `EXPLAIN ANALYZE` sobre las consultas del feed de favores disponibles.
