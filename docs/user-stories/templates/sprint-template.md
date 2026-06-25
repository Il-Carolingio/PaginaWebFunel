# Sprint: HU-XXX - [Título de la Historia de Usuario]

**Fecha de inicio:** YYYY-MM-DD  
**Fecha de finalización:** YYYY-MM-DD  
**Estado:** [⏳ En Progreso | ✅ Completado | ❌ Fallido]

---

## 📋 Resumen del Sprint

| Campo | Valor |
|-------|-------|
| **Historia de Usuario** | HU-XXX: [Título] |
| **Prioridad** | [Alta/Media/Baja] |
| **Esfuerzo estimado** | [N] horas |
| **Total tareas** | [N] |
| **Completadas** | [N] |
| **Pendientes** | [N] |

---

## 🎯 Objetivos

- [Objetivo 1]
- [Objetivo 2]

---

## 📦 Archivos Afectados

| Archivo | Acción | Estado |
|---------|--------|--------|
| `path/to/file.js` | ✏️ Modificar / ✅ Crear | ✅ / ⏳ |
| `path/to/file2.js` | ✏️ Modificar / ✅ Crear | ✅ / ⏳ |

---

## ✅ Verificación Dual (Agente + Humano)

### 🔍 Auto-Verificación del Agente (Cline)

Cada tarea completada debe pasar por esta verificación automática antes de marcarse como finalizada:

| # | Verificación | ¿Aplica? | Resultado |
|---|-------------|----------|-----------|
| 1 | **Sintaxis válida** - El código no tiene errores de sintaxis (JS, HTML, CSS) | Sí/No | ✅ / ❌ |
| 2 | **Imports correctos** - Todos los imports/resolves existen y están bien escritos | Sí/No | ✅ / ❌ |
| 3 | **Variables de entorno** - Las nuevas variables están documentadas en `.env` | Sí/No | ✅ / ❌ |
| 4 | **Manejo de errores** - Las funciones críticas tienen try/catch o manejo de errores | Sí/No | ✅ / ❌ |
| 5 | **Logging** - Se agregaron logs informativos (console.log/warn/error) | Sí/No | ✅ / ❌ |
| 6 | **Casos edge** - Se consideraron casos vacíos, nulos o límite | Sí/No | ✅ / ❌ |
| 7 | **Consistencia con código existente** - Sigue el mismo patrón que el código actual | Sí/No | ✅ / ❌ |
| 8 | **Sin secretos hardcodeados** - No hay passwords, API keys, tokens en el código | Sí/No | ✅ / ❌ |
| 9 | **Pruebas unitarias** - Se crearon/actualizaron pruebas para el nuevo código | Sí/No | ✅ / ❌ |
| 10 | **Pruebas de integración** - Se crearon/actualizaron pruebas de integración | Sí/No | ✅ / ❌ |

### 👤 Verificación Humana (QA/Revisor)

El revisor humano debe ejecutar estas pruebas manuales y reportar resultados:

| # | Prueba Manual | Resultado | Comentarios |
|---|--------------|-----------|-------------|
| 1 | **Prueba funcional** - Ejecutar la funcionalidad y verificar que hace lo esperado | ✅ / ❌ | |
| 2 | **Prueba de error** - Provocar una condición de error y verificar el manejo | ✅ / ❌ | |
| 3 | **Prueba de integración** - Verificar que no rompe otras funcionalidades | ✅ / ❌ | |
| 4 | **Prueba de regresión visual** (si aplica) - La UI se ve bien en diferentes pantallas | ✅ / ❌ | |
| 5 | **Prueba de datos** - Los datos se guardan/leen correctamente | ✅ / ❌ | |
| 6 | **Prueba de seguridad** - Los endpoints protegidos no son accesibles sin auth | ✅ / ❌ | |

---

## 📝 Bitácora del Sprint

| Fecha | Evento | Detalle |
|-------|--------|---------|
| YYYY-MM-DD HH:mm | `SPRINT_INITIALIZED` | Sprint iniciado |
| YYYY-MM-DD HH:mm | `TASK_STARTED` | Tarea #: [nombre] |
| YYYY-MM-DD HH:mm | `TASK_COMPLETED` | Tarea #: [nombre] - ✅ |
| YYYY-MM-DD HH:mm | `AGENT_VERIFIED` | Auto-verificación completada |
| YYYY-MM-DD HH:mm | `HUMAN_VERIFIED` | Verificación humana completada |
| YYYY-MM-DD HH:mm | `SPRINT_COMPLETED` | Sprint finalizado |

---

## 🧪 Pruebas Ejecutadas

| Tipo | Archivo | Estado |
|------|---------|--------|
| Unitaria | `tests/unit/...` | ✅ / ⏳ |
| Integración | `tests/integration/...` | ✅ / ⏳ |
| Manual | — | ✅ / ⏳ |

---

## 🔗 Enlaces

- [Historia de Usuario](../backlog/HU-XXX-*.md)
- [Evaluación Técnica](../evaluations/HU-XXX-*-eval.md)
- [Pruebas](../../backend/tests/...)