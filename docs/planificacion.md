# Planificación de JobConnect

## 1. Objetivo

JobConnect es un panel administrativo frontend para reclutadores.

La aplicación permite gestionar seis módulos relacionados con el proceso de reclutamiento:

1. Candidatos
2. Vacantes
3. Empresas clientes
4. Postulaciones
5. Entrevistas
6. Tareas del reclutador

La aplicación utiliza DummyJSON como API de prueba y mantiene los cambios simulados en memoria durante la sesión.

## 2. Tecnologías

- HTML5
- CSS3
- JavaScript vanilla
- Módulos ES
- Fetch API
- async/await
- try/catch
- Node.js 20 o superior para el servidor local
- DummyJSON como API de prueba

No se utilizan frameworks ni librerías de componentes.

No se utilizan:

- React
- Vue
- Angular
- TypeScript
- Tailwind
- Bootstrap
- Axios
- jQuery
- Backend propio
- Base de datos

## 3. Arquitectura

La aplicación está organizada por módulos y utiliza una infraestructura compartida.

### Capas principales

- `src/app.js`: inicialización y conexión de rutas con módulos.
- `src/components/`: componentes visuales reutilizables.
- `src/config/`: configuración general y de módulos.
- `src/core/`: servicios compartidos, autenticación, API, router, sesión y validación.
- `src/modules/`: módulos funcionales de la aplicación.
- `src/pages/`: páginas principales.
- `src/styles/`: sistema visual compartido.
- `scripts/`: servidor local y comprobación de archivos.
- `docs/`: documentación del proyecto.

## 4. Módulos

| Módulo | Responsable | Endpoint |
|---|---|---|
| Candidatos | Jared | `/users` |
| Vacantes | Berny | `/products` |
| Empresas clientes | Jared | `/carts` |
| Postulaciones | Berny | `/posts` |
| Entrevistas | Berny | `/comments` |
| Tareas del reclutador | Jeremy | `/todos` |

## 5. Módulo de tareas

El módulo de tareas utiliza el endpoint `/todos` de DummyJSON.

### GET

```text
GET /todos
```

Respuesta esperada:

```text
todos
```

### Crear tarea

```text
POST /todos/add
```

Payload:

```js
{
  todo: "Descripción de la tarea",
  completed: false,
  userId: 1
}
```

### Actualizar tarea

```text
PATCH /todos/:id
```

Payload:

```js
{
  todo: "Descripción actualizada",
  completed: true,
  userId: 1
}
```

### Eliminar tarea

```text
DELETE /todos/:id
```

## 6. Campos del módulo de tareas

| Campo API | Etiqueta visible | Tipo |
|---|---|---|
| `todo` | Descripción de la tarea | textarea |
| `completed` | Completada | checkbox |
| `userId` | ID del reclutador | number |

El campo `completed` se muestra como `Sí` o `No` en la tabla.

## 7. Flujo de autenticación

1. El usuario accede a la aplicación.
2. Si no existe una sesión válida, se muestra el login.
3. El login utiliza `/auth/login`.
4. Una sesión existente se valida mediante `/auth/me`.
5. Las rutas privadas requieren una sesión válida.
6. Cerrar sesión elimina las claves de sesión de JobConnect.
7. El usuario vuelve a `#/login`.

Las credenciales de integración definidas por el contrato son:

```text
Usuario: emilys
Contraseña: emilyspass
```

La contraseña no se almacena en localStorage, sessionStorage, cookies manuales ni archivos del proyecto.

## 8. Rutas principales

```text
#/login
#/register
#/dashboard
#/candidatos
#/vacantes
#/empresas
#/postulaciones
#/entrevistas
#/tareas
```

## 9. Estrategia de ramas

El trabajo se realiza mediante ramas independientes.

### Jared

```text
chore/jared-foundation
feature/jared-auth-candidates-companies
```

### Berny

```text
feature/berny-vacancies-applications-interviews
```

### Jeremy

```text
feature/jeremy-tasks-docs
```

Jeremy trabaja exclusivamente en:

```text
src/modules/tasks/
docs/
```

La actualización final de `README.md` se realizará después de la integración de los demás módulos y de acuerdo con el contrato del equipo.

## 10. Flujo de integración

1. Jared crea y fusiona la fundación.
2. Los integrantes actualizan `main`.
3. Cada integrante crea su rama funcional.
4. Cada integrante modifica únicamente sus archivos asignados.
5. Se ejecuta `npm run check`.
6. Se ejecuta `npm start`.
7. Se realizan las pruebas manuales.
8. Se abre el Pull Request.
9. Se revisa la integración.
10. Se fusionan las ramas siguiendo el orden establecido.

## 11. Pruebas del módulo de tareas

Las pruebas locales todavía deben ejecutarse en la computadora de Jeremy.

| Prueba | Resultado |
|---|---|
| GET `/todos` | Pendiente de ejecución local |
| POST `/todos/add` | Pendiente de ejecución local |
| PATCH `/todos/:id` | Pendiente de ejecución local |
| DELETE `/todos/:id` | Pendiente de ejecución local |
| Búsqueda de tareas | Pendiente de ejecución local |
| Cambio de estado completada | Pendiente de ejecución local |
| Confirmación antes de eliminar | Pendiente de ejecución local |
| Vista a 320 px | Pendiente de ejecución local |
| Vista a 768 px | Pendiente de ejecución local |
| Vista a 1024 px | Pendiente de ejecución local |
| Navegación mediante Tab | Pendiente de ejecución local |
| Cierre de modal con Escape | Pendiente de ejecución local |
| Consola sin errores ni warnings | Pendiente de ejecución local |

No se marca ninguna prueba como aprobada hasta haber sido ejecutada realmente.

## 12. Limitación de DummyJSON

DummyJSON simula las operaciones de escritura.

Por esta razón, crear, actualizar y eliminar registros no implica persistencia permanente en el servidor.

La infraestructura compartida actualiza `sessionStore` para que los cambios puedan visualizarse durante la sesión.

## 13. Estado de la documentación

La planificación queda preparada para la integración del módulo de tareas y para registrar los resultados reales de las pruebas.

La bitácora de NotebookLM y la reflexión se mantienen sin información inventada hasta que existan experiencias reales del equipo.
