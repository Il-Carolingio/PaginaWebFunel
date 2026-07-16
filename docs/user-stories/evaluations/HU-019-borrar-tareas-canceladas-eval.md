# Evaluación: HU-019 - Borrar todas las tareas canceladas

**Fecha de evaluación:** 2026-07-05
**Evaluado por:** Sistema Agentic Brain
**Resultado:** ✅ APROBADA - Lista para implementación

---

## 📋 Descripción de la Propuesta

> **Como** usuario vendedor/administrador,
> **Quiero** poder borrar todas las tareas canceladas,
> **Para** liberar espacio en mi base de datos y no tener datos innecesarios.

---

## ✅ Análisis de Viabilidad

### Valor de Negocio: **MEDIO**
- Permite limpieza de base de datos
- Mejora el rendimiento al reducir datos innecesarios
- Funcionalidad administrativa útil para mantenimiento

### Viabilidad Técnica: **ALTA**
- ✅ Colección `tareas` existe (HU-013)
- ✅ Sistema de tareas implementado (HU-013, 014, 015)
- ✅ Endpoint de eliminación individual existe
- ✅ Frontend con componentes de tareas reutilizables

### Esfuerzo Estimado: **BAJO**
- **Backend:** 1 hora (nuevo endpoint)
- **Frontend:** 1 hora (botón y confirmación)
- **Total:** 2 horas (0.5 días)

---

## 📝 Criterios de Aceptación Propuestos

- [ ] El vendedor/administrador puede ver un botón "Borrar tarea cancelada" por cada tarea
- [ ] Al hacer clic, se muestra un diálogo de confirmación
- [ ] Al confirmar, se elimina la tarea deseada con estado "cancelada"
- [ ] Solo se eliminan las tareas del vendedor o las tareas del admin en caso de estar el en su sesion
- [ ] Se muestra mensaje de confirmación
- [ ] Se actualiza la lista de tareas automáticamente

---

## 🔧 Notas Técnicas

### Backend
- **Endpoint nuevo:** `DELETE /api/tareas/canceladas`
- **Filtro:** Tareas con `estado: "cancelada"` y `vendedorId` (o todas para admin)
- **Respuesta:** Mensaje con tarea borrada con exito

### Frontend
- **Componente:** Agregar botón en Crm.jsx en cada tarea, junto y visualmente compatible con el de editar
- **Funcionalidad:** Confirmación antes de eliminar
- **Feedback:** Toast con mensaje de tarea eliminada

### Base de Datos
- **Colección existente:** `tareas`
- **Operación:** `deleteMany` con filtro de estado

---

## 🔗 Dependencias

- ✅ **HU-013** - Evolucionar y administrar tareas (Completada - provee estructura)
- ✅ **HU-015** - Cambiar estado de tarea (Completada - provee estados)
- -Revisar que las tareas deben estar filtradas por usuario, solo el usuario puede ver sus tareas, las tareas personales no las puede ver el administrador ni otros vendedores

---

## 📊 Historial de Cambios

| Fecha | Cambio |
|-------|--------|
| 2026-07-05 | Evaluación inicial: Aprobada para implementación |

---

## 🎯 Recomendación

**APROBADA** para implementación en el próximo sprint.

**Sugerencia de implementación:**
1. Crear endpoint `DELETE /api/tareas/canceladas` en TareaController
2. Agregar botón en Crm.jsx con confirmación
3. Testing y validación

**Esfuerzo total estimado:** 0.5 días de desarrollo