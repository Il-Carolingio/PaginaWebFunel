# Evaluación: HU-019 - Borrar todas las tareas canceladas

**Fecha de evaluación:** 2026-07-08
**Evaluador:** Sistema Agentic Brain
**Estado HU:** Pendiente de evaluación → Evaluada

---

## 1. Resumen Ejecutivo

La HU-019 propone agregar la funcionalidad para que vendedores/administradores puedan eliminar tareas con estado "cancelada". Actualmente el sistema ya permite eliminar tareas individualmente (`DELETE /api/tareas/:id`) pero sin filtrar por estado. Se requiere un nuevo endpoint específico para eliminar tareas canceladas, ya sea individualmente o en lote. La implementación es de **baja complejidad** y no requiere cambios estructurales mayores.

---

## 2. Análisis de Viabilidad

- **¿Es técnicamente viable?** ✅ Sí
- **¿Requiere nueva infraestructura?** ❌ No
- **¿Depende de otras HUs?** ✅ Sí, depende de HU-013 (estructura de tareas) y HU-015 (estados de tarea), ambas completadas
- **¿Requiere nuevos paquetes/dependencias?** ❌ No

---

## 3. Estimación de Esfuerzo

| Capa | Esfuerzo estimado | Complejidad |
|------|-------------------|-------------|
| Backend (Controladores) | 0.5h | Baja |
| Backend (Rutas) | 0.25h | Baja |
| Frontend (Componentes - Crm.jsx) | 1h | Media |
| **Total** | **1.75h** | |

---

## 4. Tecnologías a Utilizar

- **Backend:** Express, Mongoose, JWT (existente)
- **Frontend:** React, Chakra UI, Axios/fetch (existente)
- **Base de datos:** MongoDB - Colección `tareas`
- **Paquetes nuevos requeridos:** Ninguno

---

## 5. Afectación Backend → Frontend

### Backend
- [ ] Nuevo modelo
- [x] Nuevo controlador (o función en TareaController.js)
- [x] Nuevas rutas (en routes/tareas.js)
- [ ] Modificar middleware existente
- [ ] Nuevos servicios/utilidades
- Archivos afectados:
  - `backend/controllers/TareaController.js` - Nueva función `eliminarTareaCancelada`
  - `backend/routes/tareas.js` - Nueva ruta `DELETE /api/tareas/cancelada` o `DELETE /api/tareas/:id/cancelada`

### Frontend
- [x] Modificar página existente
- [x] Nuevo componente (modal de confirmación reutilizable)
- [ ] Nueva página
- [ ] Nuevo servicio API
- [ ] Nuevo contexto/provider
- Archivos afectados:
  - `frontend/src/pages/Crm.jsx` - Agregar botón "Borrar" en cada tarea cancelada + diálogo de confirmación

---

## 6. Posibles Fallos y Riesgos

| # | Riesgo | Probabilidad | Impacto | Mitigación |
|---|--------|-------------|---------|------------|
| 1 | Eliminar tareas de otros vendedores (admin) | Baja | Alto | Validar por `vendedorId` según rol |
| 2 | Eliminar tareas no canceladas por error | Baja | Medio | El endpoint solo permite eliminar si estado === 'cancelada' |
| 3 | Conflicto con endpoint `DELETE /:id` existente | Media | Bajo | Usar ruta específica como `DELETE /cancelada` |
| 4 | Tareas de reclutamiento sin `vendedorId` | Media | Medio | Solo admin puede eliminar tareas sin `vendedorId` |

---

## 7. Criterios de Aceptación (Revisados)

Analizando la HU, se detecta una **ambigüedad** entre el título y los criterios:

- **Título:** "Borrar **todas** las tareas canceladas" → sugiere eliminación masiva
- **CA-01 a CA-06:** Describen eliminación **individual** ("la tarea [singular] con estado cancelada")
- **Nota técnica:** Menciona "Endpoint de eliminación múltiple: 1h"

Se recomienda aclarar: ¿es eliminación individual de tareas canceladas o eliminación masiva de TODAS las tareas canceladas?

### Escenario A: Eliminación individual (coincide con criterios)
- Botón "Borrar tarea cancelada" por cada tarea
- Diálogo de confirmación individual
- Endpoint: `DELETE /api/tareas/:id/cancelada`

### Escenario B: Eliminación masiva (coincide con título y notas)
- Botón "Borrar todas las canceladas"
- Diálogo de confirmación: "¿Estás seguro de eliminar N tareas canceladas?"
- Endpoint: `DELETE /api/tareas/canceladas`

**Recomendación:** Implementar **Escenario A (individual)** ya que los criterios de aceptación son más específicos y describen flujo individual, y además es más seguro para el usuario.

---

## 8. Dependencias

- [ ] Ninguna
- [x] **HU-013** - Evolucionar y administrar tareas (✅ Completada - provee modelo Tarea)
- [x] **HU-015** - Cambiar estado de tarea (✅ Completada - provee estados: cancelada)

---

## 9. Recomendación Final

**✅ Viable**

La HU es viable y de baja complejidad. Se recomienda implementar según el **Escenario A (eliminación individual)** que coincide con los criterios de aceptación. El backend necesita un nuevo endpoint con validación de estado "cancelada" y permiso por rol, mientras que el frontend requiere agregar un botón "Borrar" (visible solo en tareas canceladas) con diálogo de confirmación usando Chakra UI (`useDisclosure` + `AlertDialog`).

**Duración estimada:** ~2 horas