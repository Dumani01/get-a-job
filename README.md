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

## Acceso con candado y contraseña

- Usuario: `emilys`.
- PIN del candado: `2026`.
- Contraseña normal: `emilyspass`.

Al registrarse se solicita una contraseña normal y un PIN de cuatro dígitos. Las cuentas creadas pueden iniciar sesión con cualquiera de los dos mecanismos desde el mismo navegador. Como DummyJSON no persiste registros, el sistema guarda verificadores locales, no las credenciales en texto plano.

## Créditos de interfaz

La interfaz JobConnect adapta componentes publicados bajo licencia MIT en Uiverse:

1. https://uiverse.io/uiverse-astronaut/new-kangaroo-72
2. https://uiverse.io/uiverse-astronaut/witty-swan-38
3. https://uiverse.io/uiverse-astronaut/good-ape-60
4. https://uiverse.io/uiverse-astronaut/smooth-eel-7
5. https://uiverse.io/uiverse-astronaut/fresh-cat-3
6. https://uiverse.io/uiverse-astronaut/clever-snail-45
7. https://uiverse.io/uiverse-astronaut/cuddly-elephant-44
8. https://uiverse.io/uiverse-astronaut/lovely-otter-52

Los componentes fueron reconstruidos con HTML, CSS y JavaScript vanilla,
renombrando sus selectores con el prefijo `jc-` y adaptándolos a la identidad
visual de JobConnect.

## Limitación de DummyJSON

Las operaciones de escritura de DummyJSON son simuladas. La infraestructura común mantiene los cambios en memoria durante la sesión para que la interfaz pueda reflejarlos, pero no persisten en el servidor.
