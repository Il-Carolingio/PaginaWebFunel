# HU-019: Borrar todas las tareas canceladas

**Estado:** Pendiente de evaluación
**Prioridad:** Media
**Sprint:** 4
**Esfuerzo estimado:** 2 horas
**Tiempo estimado:** 0.5 días
**Sprint Inicio:** 2026-07-05
**Sprint Fin:** 2026-07-19

---

## Descripción

> **Como** usuario vendedor/administrador,
> **Quiero** poder borrar todas las tareas canceladas,
> **Para** liberar espacio en mi base de datos y no tener datos innecesarios.

---

## Criterios de Aceptación

- [ ] El vendedor/administrador puede ver un botón "Borrar tarea"
- [ ] Al hacer clic, se muestra un diálogo de confirmación
- [ ] Al confirmar, se elimina la tarea con estado "cancelada" la cual se desea eliminar
- [ ] Solo se eliminan las tareas del vendedor
- [ ] Se muestra mensaje de confirmación con la tarea que se elimino
- [ ] Se actualiza la lista de tareas automáticamente

---

## Notas Técnicas

- **Endpoint:** `DELETE /api/tarea/cancelada` (nuevo endpoint)
- **Backend:** Filtrar por `estado: "cancelada"` y `vendedorId` (o todos para admin)
- **Frontend:** Agregar botón en cada tarea en Crm.jsx con confirmación
- **Validación:** Verificar que el usuario tenga permisos

---

## Dependencias

- ✅ **HU-013** - Evolucionar y administrar tareas (Completada - provee estructura)
- ✅ **HU-015** - Cambiar estado de tarea (Completada - provee estados)

---

## Estimación

- **Complejidad:** Baja
- **Esfuerzo:** 2 horas
- **Tiempo:** 0.5 días

**Desglose:**
- Crear endpoint de eliminación múltiple: 1h
- Agregar botón en frontend: 0.5h
- Testing y validación: 0.5h