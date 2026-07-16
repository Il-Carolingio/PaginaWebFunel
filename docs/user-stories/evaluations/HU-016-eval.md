# Evaluación: HU-016 - Detección de conflictos de horario en citas

**Fecha:** 2026-07-03
**Evaluador:** Cline (asistente IA)
**Estado de la HU:** Pendiente (no creada formalmente en backlog)

---

## 1. Resumen Ejecutivo

El vendedor necesita que al crear/editar una tarea de tipo **cita**, el sistema valide que no exista otra cita en la misma fecha y hora para ese vendedor. Si hay conflicto, debe mostrar los datos de la cita con la que choca para que el vendedor pueda reordenar sus tiempos.

Actualmente el sistema permite crear citas sin ninguna validación de horario, lo que puede generar dobles agendas.

---

## 2. Análisis de Viabilidad

| Aspecto | Resultado |
|---------|-----------|
| **¿Es técnicamente viable?** | ✅ **Sí** — Implementación directa |
| **¿Requiere nueva infraestructura?** | ❌ No |
| **¿Depende de otras HUs?** | ❌ No, es independiente |
| **¿Afecta datos existentes?** | ❌ No, solo añade validación |

---

## 3. Estimación de Esfuerzo

| Capa | Esfuerzo estimado | Complejidad |
|------|-------------------|-------------|
| Backend (Modelos) | 0h | Ninguna — No requiere cambios en el modelo |
| Backend (Controladores) | 1.5h | Media — Lógica de detección de conflictos y mensaje de error |
| Backend (Rutas) | 0h | Ninguna — No requiere nuevas rutas |
| Frontend (Componentes) | 1h | Media — Mostrar alerta de conflicto con datos de la cita existente |
| Frontend (Páginas) | 0.5h | Baja — Modificar modal de crear/editar tarea |
| Frontend (Servicios/API) | 0h | Ninguna — Ya usa fetch |
| **Total** | **3h** | **Media** |

---

## 4. Tecnologías a Utilizar

- **Backend:** Express + Mongoose (validación en controlador existente)
- **Frontend:** React + Chakra UI (Alert, AlertIcon, Text)
- **Base de datos:** MongoDB — Colección `tareas`
- **Paquetes nuevos requeridos:** Ninguno

---

## 5. Afectación Backend → Frontend

### Backend
- [ ] Nuevo modelo
- [x] Modificar controlador existente — `backend/controllers/tareaController.js`
  - En `crearTarea`: Antes de guardar, verificar si existe otra cita del mismo vendedor en la misma fecha+hora
  - En `actualizarTarea`: Misma validación al editar (si el tipo es cita)
- [ ] Nuevas rutas
- [ ] Modificar middleware existente
- [ ] Nuevos servicios/utilidades
- **Archivos afectados:**
  - `backend/controllers/tareaController.js`

### Frontend
- [ ] Nuevo componente
- [ ] Nueva página
- [x] Modificar página existente — `frontend/src/pages/Crm.jsx`
  - En el modal de crear tarea: capturar error 409 y mostrar alerta con los datos de la cita conflictiva
  - En el modal de editar tarea: mismo manejo
- [ ] Nuevo servicio API
- [ ] Nuevo contexto/provider
- **Archivos afectados:**
  - `frontend/src/pages/Crm.jsx`

---

## 6. Posibles Fallos y Riesgos

| # | Riesgo | Probabilidad | Impacto | Mitigación |
|---|--------|-------------|---------|------------|
| 1 | La hora viene vacía (tarea sin hora) | Baja | Medio | Solo validar cuando `hora` esté presente. Si no tiene hora, no hay conflicto horario |
| 2 | Conflicto con la misma cita al editar (ella misma) | Media | Alto | Excluir el `_id` de la tarea actual en la consulta de detección |
| 3 | Zona horaria inconsistente entre frontend y backend | Baja | Bajo | Comparar fechas por día (YYYY-MM-DD) y hora como string |
| 4 | Dos citas a la misma hora pero en diferente ubicación (válido) | Baja | Bajo | La validación es correcta: mismo día y hora = conflicto, aunque sea diferente lugar |

---

## 7. Criterios de Aceptación

- [ ] CA-001: Al crear una cita, si ya existe otra cita del mismo vendedor en la misma fecha y hora, el sistema rechaza la creación y devuelve un error claro
- [ ] CA-002: El mensaje de error debe incluir el título, fecha, hora y ubicación de la cita existente con la que hay conflicto
- [ ] CA-003: Al editar una cita, si el cambio de fecha/hora genera conflicto con otra cita existente (excluyéndose a sí misma), el sistema rechaza la edición
- [ ] CA-004: Si la tarea no es de tipo "cita", no se aplica la validación de horario
- [ ] CA-005: Si la cita no tiene hora especificada, no se valida conflicto horario (solo por fecha)
- [ ] CA-006: En el frontend, el error se muestra como una alerta dentro del modal con los datos de la cita conflictiva

---

## 8. Dependencias

- [x] Ninguna — HU independiente

---

## 9. Recomendación Final

**✅ Viable**

La implementación es directa y de bajo riesgo. Solo requiere:
1. Agregar una consulta de verificación en el controlador backend (`crearTarea` y `actualizarTarea`)
2. Manejar el error 409 en el frontend mostrando los datos de la cita conflictiva

**Esfuerzo total estimado: ~3 horas** (2h backend + 1h frontend)

**Sugerencia:** Implementar como `feature/HU-016-detectar-conflictos-citas`