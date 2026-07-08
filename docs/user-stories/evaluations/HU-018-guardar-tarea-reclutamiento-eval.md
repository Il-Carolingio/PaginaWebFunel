# Evaluación: HU-018 - Guardar tarea de reclutamiento con fecha y hora

**Fecha de evaluación:** 2026-07-05
**Evaluado por:** Sistema Agentic Brain
**Resultado:** ✅ APROBADA - Lista para implementación

---

## 📋 Descripción de la Propuesta

> **Como** usuario administrador,
> **Quiero** ver las tareas creadas automáticamente por el sistema para Reclutamiento,
> **Para** poder guardar esta tarea ya con fecha y hora para que sea asignada al administrador y dar seguimiento.

---

## ✅ Análisis de Viabilidad

### Valor de Negocio: **ALTO**
- Permite seguimiento efectivo de candidatos de reclutamiento
- Convierte tareas sin asignar en tareas con fecha/hora
- Mejora el proceso de contratación del equipo de ventas
- Aprovecha la infraestructura existente de tareas

### Viabilidad Técnica: **ALTA**
- ✅ Colección `tareas` existe (HU-013)
- ✅ Sistema de tareas implementado (HU-013, 014, 015)
- ✅ Endpoint de actualización de tareas existe
- ✅ Frontend con componentes de tareas reutilizables

### Esfuerzo Estimado: **MEDIO**
- **Backend:** 1 hora (validar endpoint existente)
- **Frontend:** 2 horas (modificar componente de tareas)
- **Total:** 3 horas (0.5 días)

---

## 📝 Criterios de Aceptación Propuestos

- [ ] El administrador puede ver tareas de reclutamiento sin fecha/hora asignados
- [ ] El administrador puede editar la tarea para agregar fecha y hora
- [ ] Al guardar la tarea, se actualiza en la base de datos
- [ ] La tarea se asigna correctamente al administrador
- [ ] No aparece el mensaje "la tarea no existe"
- [ ] Interfaz responsive y consistente con el diseño existente

---

## 🔧 Notas Técnicas

### Backend
- **Endpoint existente:** `PUT /api/tareas/:id` (HU-015)
- **Validación:** Asegurar que la tarea exista antes de actualizar
- **Filtro:** Tareas con `titulo: "Reclutamiento"` y `vendedorId: null`

### Frontend
- **Componente:** Reutilizar `Tareas.jsx` y modales existentes
- **Funcionalidad:** Reusar formulario de edición de fecha/hora para tareas de reclutamiento, esta es una tarea como cualquier otra debe poderse editar sin problemas
- **Validación:** Mostrar error si la tarea no existe (revisar bien que la tarea exista, debe existir pues se esta visualizando en el apartado Mis tareas)

### Base de Datos
- **Colección existente:** `tareas`
- **Campos a actualizar:** `fecha`, `hora`, `vendedorId` (todos los campos se deben actualizar al guardar)

---

## 🔗 Dependencias

- ✅ **HU-017** - Tareas de Llamada para Reclutamiento (Completada - provee tareas)
- ✅ **HU-013** - Evolucionar y administrar tareas (Completada - provee estructura)
- ✅ **HU-015** - Cambiar estado de tarea (Completada - provee gestión de estados)

---

## 📊 Historial de Cambios

| Fecha | Cambio |
|-------|--------|
| 2026-07-05 | Evaluación inicial: Aprobada para implementación |

---

## 🎯 Recomendación

**APROBADA** para implementación en el próximo sprint.

**Sugerencia de implementación:**
1. Verificar que el endpoint `PUT /api/tareas/:id` funciona correctamente
2. Modificar el componente de tareas para permitir edición de tareas de reclutamiento
3. Agregar validación de existencia de tarea, si la tarea aparece en el apartado Mis tareas la tarea debe existir

**Esfuerzo total estimado:** 0.5 días de desarrollo