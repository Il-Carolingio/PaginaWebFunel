# HU-013: Evolucionar y administrar tareas de vendedor

**Estado:** Pendiente
**Prioridad:** Alta
**Sprint:** 4

## Descripción
> **Como** usuario vendedor,
> **Quiero** administrar mis tareas y evolucionar una llamada a una cita, evento, entrevista o contrato,
> **Para** poder cambiar la fecha, hora y comentarios, y así llevar bien mis actividades.

## Criterios de Aceptación
- [ ] CA-01: El vendedor puede ver el detalle completo de una tarea existente
- [ ] CA-02: El vendedor puede editar una tarea (título, descripción, fecha, hora, ubicación)
- [ ] CA-03: El vendedor puede cambiar el tipo de tarea (evolucionar): llamada → cita → evento → entrevista → contrato
- [ ] CA-04: Se agregan los tipos "entrevista" y "contrato" al modelo de Tarea
- [ ] CA-05: El vendedor puede cambiar el estado de la tarea (pendiente → cancelada)
- [ ] CA-06: La edición se realiza mediante un modal con formulario pre-cargado
- [ ] CA-07: Los cambios se guardan correctamente en la base de datos
- [ ] CA-08: La interfaz muestra los nuevos tipos con colores distintivos
- [ ] CA-09: El sistema debe mostrar las tareas mas antiguas pendientes primero y despues las de hoy

## Notas Técnicas
- Modificar `backend/models/Tarea.js` para agregar tipos "entrevista" y "contrato"
- Modificar `frontend/src/pages/Crm.jsx` para agregar modal de edición
- El endpoint PUT `/:id` en `backend/routes/tareas.js` ya existe
- Agregar botón de editar en cada tarjeta de tarea
- El modal de edición debe pre-cargar todos los campos existentes

## Dependencias
- El CRUD de tareas ya está implementado
- El seleccionador de fecha debe funcionar correctamente tomando el valor seleccionado en el calendario

## Desglose de Tareas

| # | Tarea | Estimación |
|---|-------|------------|
| 1 | Agregar tipos "entrevista" y "contrato" al modelo Tarea.js | 15 min |
| 2 | Crear modal de edición de tarea en Crm.jsx | 45 min |
| 3 | Agregar botón de editar en cada tarjeta de tarea | 15 min |
| 4 | Implementar lógica de evolución de tipo (cambio de tipo) | 20 min |
| 5 | Agregar colores y labels para los nuevos tipos | 10 min |
| 6 | Verificar sintaxis y pruebas | 15 min |

**Tiempo total estimado:** ~2 horas