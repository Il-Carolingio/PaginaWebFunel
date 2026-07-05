# HU-018: Guardar tarea de reclutamiento con fecha y hora

**Estado:** ✅ Aprobada - En implementación
**Prioridad:** Alta
**Sprint:** 4
**Esfuerzo estimado:** 3 horas
**Tiempo estimado:** 0.5 días
**Sprint Inicio:** 2026-07-05
**Sprint Fin:** 2026-07-19

---

## Descripción

> **Como** usuario administrador,
> **Quiero** ver las tareas creadas automáticamente por el sistema para Reclutamiento,
> **Para** poder guardar esta tarea ya con fecha y hora para que sea asignada al administrador y dar seguimiento.

---

## Criterios de Aceptación

- [ ] El administrador puede ver tareas de reclutamiento sin fecha/hora asignados
- [ ] El administrador puede editar la tarea para agregar fecha y hora
- [ ] Al guardar la tarea, se actualiza en la base de datos
- [ ] La tarea se asigna correctamente al administrador
- [ ] No aparece el mensaje "la tarea no existe"
- [ ] Interfaz responsive y consistente con el diseño existente

---

## Notas Técnicas

- **Colección:** `tareas` (ya existe)
- **Filtro:** Tareas con `titulo: "Reclutamiento"` y `vendedorId: null`
- **Endpoint:** `PUT /api/tareas/:id` para actualizar fecha, hora y vendedorId
- **Frontend:** Modificar el componente de tareas para permitir edición de tareas de reclutamiento
- **Validación:** Asegurar que la tarea exista antes de actualizar

---

## Dependencias

- ✅ **HU-017** - Tareas de Llamada para Reclutamiento (Completada - provee tareas)

---

## Estimación

- **Complejidad:** Media
- **Esfuerzo:** 3 horas
- **Tiempo:** 0.5 días

**Desglose:**
- Modificar endpoint de tareas para permitir actualización: 1h
- Agregar funcionalidad de edición en frontend: 1.5h
- Testing y validación: 0.5h

---

## Pull Request

- **URL:** https://github.com/Il-Carolingio/PaginaWebFunel/pull/3
- **Estado:** Abierto, pendiente de revisión