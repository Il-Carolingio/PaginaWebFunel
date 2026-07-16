# Evaluación: HU-017 - Tareas de Llamada para Reclutamiento

**Fecha de evaluación:** 2026-07-04  
**Evaluado por:** Sistema Agentic Brain  
**Resultado:** ✅ APROBADA - Lista para implementación

---

## 📋 Descripción de la Propuesta

> **Como** administrador,  
> **Quiero** ver como tareas de llamada a las personas que se han registrado en "Únete al equipo",  
> **Para** poder darle seguimiento a su contratación.

---

## ✅ Análisis de Viabilidad

### Valor de Negocio: **ALTO**
- Permite seguimiento efectivo de prospectos de reclutamiento
- Convierte registros en tareas accionables
- Mejora el proceso de contratación del equipo de ventas
- Aprovecha datos ya capturados en HU-007

### Viabilidad Técnica: **ALTA**
- ✅ Colección `reclutamiento` existe (HU-007)
- ✅ Sistema de tareas implementado (HU-013, 014, 015)
- ✅ Infraestructura de backend lista
- ✅ Frontend con componentes de tareas reutilizables

### Esfuerzo Estimado: **MEDIO**
- **Backend:** 2-3 horas (nuevo endpoint + lógica de conversión)
- **Frontend:** 2-3 horas (extender dashboard o crear vista específica)
- **Total:** 4-6 horas (1 día de trabajo)

---

## 📝 Criterios de Aceptación Propuestos

- [ ] El administrador puede ver lista de personas registradas en "Únete al equipo"
- [ ] Cada registro se muestra como tarea de llamada pendiente
- [ ] Se puede filtrar por estado (pendiente, contactado, contratado, cancelado)
- [ ] Se puede marcar como completada o actualizar estado
- [ ] Muestra información relevante: nombre, teléfono, correo, fecha de registro, esto puede ir dentro del campo de descripcion de la tarea
- [ ] Las tareas se crean automáticamente al haber nuevo registro, se registra en reclutamientos y a su vez en tareas
- [ ] Interfaz responsive y consistente con el diseño existente
- [ ] La tarea debe ser guardada sin fecha ni horario

---

## 🔧 Notas Técnicas

### Backend
- Nuevo endpoint: `GET /api/reclutamiento/tareas-llamada`
- Lógica: Consultar colección `reclutamiento` y transformar en tareas
- Reutilizar estructura de tareas existente (HU-013)
- Debe crearse: `POST /api/reclutamiento/crear-tarea` para generación manual

### Frontend
- Se observaran estas tareas como cualquier tarea pendiente en el apartado Mis Tareas del administrador, el titulo debe ser Reclutamiento y la descripcion los datos del aspirante sobre todo nombre y telefono, el horario y la fecha deben estar en blanco para poderse editar por el admin
- Las tareas de reclutamiento inicial deben ser prioritarias, deben verse hasta arriba como tareas que deben hacerse hoy, todas las demas despues en el orden fecha mas vieja, hoy y hora hasta la mas nueva
- Reutilizar componentes de `Tareas.jsx` y `FiltroTareas.jsx`
- Mostrar datos de la colección `reclutamiento` en formato de tarea

### Base de Datos
- Colección existente: `reclutamiento`
- Agregar campo `tareaGenerada` (boolean) para evitar duplicados

---

## 🔗 Dependencias

- ✅ **HU-007** - Formulario de Reclutamiento (Completada - provee datos)
- ✅ **HU-013** - Evolucionar y administrar tareas (Completada - provee estructura)
- ✅ **HU-014** - Filtrar listado de tareas (Completada - provee filtros)
- ✅ **HU-015** - Cambiar estado de tarea (Completada - provee gestión de estados)

---

## 📊 Historial de Cambios

| Fecha | Cambio |
|-------|--------|
| 2026-07-04 | Evaluación inicial: Aprobada para implementación |

---

## 🎯 Recomendación

**APROBADA** para implementación en el próximo sprint.

**Sugerencia de implementación:**
1. Crear endpoint backend para obtener registros de reclutamiento como tareas
2. Implementar actualización de estado con feedback visual

**Esfuerzo total estimado:** 1 día de desarrollo