# Planificación - JobConnect

## Descripción general

JobConnect es un panel administrativo para reclutadores, construido como
aplicación 100% frontend (HTML5, CSS3 y JavaScript vanilla con módulos ES).
No incluye backend ni base de datos propios: consume la API pública
`https://dummyjson.com` como fuente de datos simulada.

El usuario principal es un reclutador autenticado que gestiona candidatos,
vacantes, empresas clientes, postulaciones, entrevistas y tareas propias
desde un mismo panel.

## Los seis módulos

| Módulo | Ruta hash | Endpoint | Clave de respuesta |
|---|---|---|---|
| Candidatos | `#/candidatos` | `/users` | `users` |
| Vacantes | `#/vacantes` | `/products` | `products` |
| Empresas | `#/empresas` | `/carts` | `carts` |
| Postulaciones | `#/postulaciones` | `/posts` | `posts` |
| Entrevistas | `#/entrevistas` | `/comments` | `comments` |
| Tareas | `#/tareas` | `/todos` | `todos` |

## Endpoints y métodos por módulo

| Módulo | GET | POST | PUT | PATCH | DELETE |
|---|---|---|---|---|---|
| Candidatos | `/users` | `/users/add` | `/users/:id` | `/users/:id` | `/users/:id` |
| Vacantes | `/products` | `/products/add` | `/products/:id` | `/products/:id` | `/products/:id` |
| Empresas | `/carts` | `/carts/add` | `/carts/:id` | No requerido | `/carts/:id` |
| Postulaciones | `/posts` | `/posts/add` | No requerido | `/posts/:id` | `/posts/:id` |
| Entrevistas | `/comments` | `/comments/add` | No requerido | `/comments/:id` | `/comments/:id` |
| **Tareas** | **`/todos`** | **`/todos/add`** | **No requerido** | **`/todos/:id`** | **`/todos/:id`** |

## Flujo de autenticación

1. El login envía `{ username, password, expiresInMins: 30 }` a `/auth/login`
   usando el candado de combinación (modo numérico o alfanumérico) como
   entrada de `password`.
2. Tras una respuesta exitosa se guardan `jobconnect.accessToken`,
   `jobconnect.refreshToken` y `jobconnect.authUser`.
3. Al iniciar la aplicación con token guardado, se valida la sesión contra
   `/auth/me`.
4. Cualquier ruta privada sin token válido redirige a `#/login`.
5. `Cerrar sesión` elimina las cuatro claves `jobconnect.*` y redirige a
   `#/login`.
6. El registro simula un alta vía `POST /users/add`, mostrando el aviso de
   que DummyJSON no persiste la cuenta creada.

## Arquitectura

- **Núcleo compartido (`src/core/`)**: `api-client.js` centraliza `fetch`
  con manejo de token, headers y errores; `auth-service.js` gestiona login,
  validación de sesión y logout; `session-store.js` mantiene el estado en
  memoria/UI; `crud-service.js` expone la fábrica `createCrudModule` que
  usan los seis módulos; `router.js` resuelve las rutas hash;
  `validators.js` centraliza las validaciones de formularios.
- **Módulos (`src/modules/<nombre>/`)**: cada módulo define `*.config.js`
  (metadatos y endpoints), `*.mapper.js` (adaptación de datos DummyJSON al
  dominio de empleabilidad) e `index.js` (ensamblado con
  `createCrudModule`).
- **Componentes compartidos (`src/components/`)**: shell, sidebar/topbar,
  buscador, candado, modal de formulario, vista CRUD reutilizable, diálogo
  de confirmación, toast y redes sociales. Ningún módulo duplica estos
  componentes.
- **Estilos (`src/styles/`)**: `tokens.css` es el único archivo con colores
  hexadecimales; el resto usa variables CSS y clases `jc-*` compartidas.

## Estrategia de ramas

- `chore/jared-foundation` → fusionada primero a `main` (fundación
  compartida).
- `feature/jared-auth-candidates-companies` → autenticación, dashboard,
  candidatos y empresas.
- `feature/berny-vacancies-applications-interviews` → vacantes,
  postulaciones y entrevistas.
- `feature/jeremy-tasks-docs` → módulo de Tareas y documentación (esta
  rama).

Orden de integración de Pull Requests: 1) Jared, 2) Berny, 3) Jeremy. Antes
de fusionar cada PR se ejecuta la lista de pruebas del archivo maestro.
