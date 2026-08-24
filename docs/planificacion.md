# Planificación de JobConnect

> Documento provisional de la fundación. Jeremy completará la versión final con información real del equipo.

## Objetivo

JobConnect será un panel administrativo frontend para reclutadores con autenticación protegida y seis módulos CRUD: candidatos, vacantes, empresas clientes, postulaciones, entrevistas y tareas del reclutador.

## Arquitectura acordada

- HTML5, CSS3 y JavaScript vanilla con módulos ES.
- Node.js 20 o superior únicamente para el servidor estático local.
- Cliente API común para DummyJSON.
- Router hash común.
- Estado de autenticación limitado a las cuatro claves `jobconnect.*` del contrato.
- Cambios CRUD simulados conservados en memoria durante la sesión.

## Responsables

| Integrante | Responsabilidad |
|---|---|
| Jared | Fundación, autenticación, dashboard, candidatos y empresas |
| Berny | Vacantes, postulaciones, entrevistas y revisión de PR |
| Jeremy | Tareas, pruebas manuales y documentación |

## Pendientes

- [ ] Completar endpoints, métodos y resultados reales después de implementar los módulos.
- [ ] Registrar las pruebas reales de integración.
- [ ] Incorporar la estrategia final de presentación y entregables.

