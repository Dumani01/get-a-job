# JobConnect

Panel administrativo frontend para reclutadores. Esta rama contiene la fundación compartida que usarán Jared, Berny y Jeremy.

## Requisitos

- Node.js 20 o superior.
- Navegador moderno con soporte para módulos ES.
- No requiere dependencias de producción ni de desarrollo.

## Instalación y ejecución

```bash
npm run check
npm start
```

Abrir `http://127.0.0.1:4173`. `npm run dev` ejecuta el mismo servidor local.

## Alcance de esta rama

- Servidor estático construido con `node:http`.
- Router hash, cliente API, servicio de autenticación, estado de sesión, validadores y fábrica CRUD compartidos.
- Componentes y estilos reutilizables con prefijo `jc-`.
- Seis módulos importables en estado provisional.
- Páginas provisionales para comprobar la navegación sin adelantar la Parte B.

## Flujo de ramas

- Fundación: `chore/jared-foundation`.
- Jared: `feature/jared-auth-candidates-companies`.
- Berny: `feature/berny-vacancies-applications-interviews`.
- Jeremy: `feature/jeremy-tasks-docs`.

Nadie debe trabajar directamente en `main`. Las ramas funcionales se crean después de fusionar la fundación.

## Credenciales de integración previstas

- Usuario: `emilys`.
- Contraseña: `emilyspass`.

La conexión real y las pantallas funcionales se implementarán en la Parte B. Nunca se guarda la contraseña en el navegador ni en el repositorio.

## Créditos de interfaz

Los siguientes diseños se adaptarán a HTML, CSS y JavaScript vanilla, con selectores `jc-` y la identidad visual de JobConnect:

- [Redes sociales](https://uiverse.io/Praashoo7/silent-rabbit-57)
- [Carga inicial](https://uiverse.io/Smit-Prajapati/spicy-rat-83)
- [Candado de combinación](https://uiverse.io/dexter-st/good-pig-77)
- [Botón Guardar](https://uiverse.io/icochran10/ugly-gecko-9)
- [Botón Eliminar](https://uiverse.io/vinodjangid07/smart-emu-83)
- [Login y registro](https://uiverse.io/andrew-demchenk0/afraid-cougar-9)
- [Buscador](https://uiverse.io/santhosh_2608/purple-lizard-35)

## Limitación de DummyJSON

Las operaciones de escritura de DummyJSON son simuladas. La infraestructura común mantiene los cambios en memoria durante la sesión para que la interfaz pueda reflejarlos, pero no persisten en el servidor.
