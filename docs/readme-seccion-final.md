<!--
  Esta sección se pega al final de README.md ÚNICAMENTE cuando Berny
  confirme que las Partes B de Jared y Berny ya están fusionadas en main.
  No modificar el resto del README sin acuerdo del equipo.
-->

## Instalación

```bash
git clone https://github.com/Dumani01/get-a-job.git
cd get-a-job
npm start
```

No requiere instalar dependencias de producción. Node.js 20+ es necesario
solo para ejecutar el servidor local de desarrollo (`scripts/dev-server.mjs`).

## Uso

1. Ejecuta `npm start` (o `npm run dev`).
2. Abre la URL indicada por el servidor local.
3. Inicia sesión con las credenciales de prueba.
4. Navega entre Dashboard, Candidatos, Vacantes, Empresas, Postulaciones,
   Entrevistas y Tareas desde el sidebar.

## Credenciales de prueba

- Usuario: `emilys`
- Contraseña: `emilyspass` (ingrésala usando el modo alfanumérico del
  candado).

## Estructura del proyecto

Ver la estructura exacta de carpetas en el Contrato compartido e inmutable
v1.0 (`Prompt_Maestro_JobConnect_Equipo_3.md`, sección 3.2).

## Módulos

| Módulo | Ruta | Responsable |
|---|---|---|
| Candidatos | `#/candidatos` | Jared |
| Empresas | `#/empresas` | Jared |
| Vacantes | `#/vacantes` | Berny |
| Postulaciones | `#/postulaciones` | Berny |
| Entrevistas | `#/entrevistas` | Berny |
| Tareas | `#/tareas` | Jeremy |

## Endpoints (DummyJSON)

Ver tabla completa en `docs/planificacion.md`.

## Miembros del equipo

- Jared — https://github.com/Osarii
- Berny — propietario del repositorio central
- Jeremy — https://github.com/jeremyoviedofwd-rats

## Ramas

- `chore/jared-foundation`
- `feature/jared-auth-candidates-companies`
- `feature/berny-vacancies-applications-interviews`
- `feature/jeremy-tasks-docs`

## Créditos de interfaz (Uiverse)

- Redes sociales: https://uiverse.io/Praashoo7/silent-rabbit-57
- Carga inicial: https://uiverse.io/Smit-Prajapati/spicy-rat-83
- Candado de combinación: https://uiverse.io/dexter-st/good-pig-77
- Botón Guardar: https://uiverse.io/icochran10/ugly-gecko-9
- Botón Eliminar: https://uiverse.io/vinodjangid07/smart-emu-83
- Login/Register: https://uiverse.io/andrew-demchenk0/afraid-cougar-9
- Buscador: https://uiverse.io/santhosh_2608/purple-lizard-35

## Limitación de persistencia de DummyJSON

DummyJSON simula las operaciones de creación, actualización y eliminación,
pero no persiste los cambios en su servidor. La interfaz refleja los
cambios durante la sesión activa mediante `sessionStore`, pero se pierden
al recargar o en una nueva sesión.

## Entregables

- Repositorio con ramas, commits frecuentes y contribuciones de los tres
  integrantes.
- Aplicación funcional con login y seis CRUD.
- README completo.
- Documento de planificación (`docs/planificacion.md`).
- Bitácora de dudas técnicas con NotebookLM (`docs/notebooklm-bitacora.md`).
- Documento reflexivo sobre NotebookLM (`docs/reflexion-notebooklm.md`).
- Video de presentación.
- Infografía de arquitectura, módulos, métodos y autenticación.
