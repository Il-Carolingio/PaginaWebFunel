# Reglas para iniciarSprint-HU-XXX (Versión Event-Driven con Verificación Dual)

## 📋 Propósito
Ejecutar un sprint de implementación con verificación dual (agente + humano) para garantizar calidad, tomando como base la evaluación técnica de una Historia de Usuario.

---

## 🔄 Flujo de Ejecución Event-Driven

### Fase 1: Preparación
1. **Validar entrada:** Recibir `iniciarSprint-HU-XXX` (ej: `iniciarSprint-HU-005`)
2. **Leer la HU:** Buscar el archivo en `docs/user-stories/backlog/HU-XXX-*.md`
3. **Leer la evaluación:** Buscar el archivo en `docs/user-stories/evaluations/HU-XXX-*-eval.md`
4. **Crear archivo de sprint** en `docs/user-stories/sprints/HU-XXX-sprint.md` usando la plantilla `docs/user-stories/templates/sprint-template.md`
5. **Registrar evento:** Agregar entrada `SPRINT_INITIALIZED` en la bitácora del sprint

---

### Fase 2: Ejecución de Tareas (Cada tarea sigue este flujo)

#### 2.1 Implementación
Para cada tarea del desglose (sección 4 de la evaluación):

1. **Leer archivos afectados** si existen
2. **Implementar los cambios** necesarios siguiendo las directrices técnicas
3. **Verificar la sintaxis** del código creado/modificado
4. **Registrar evento:** Agregar entrada `TASK_STARTED` y `TASK_COMPLETED` en la bitácora

#### 2.2 Auto-Verificación del Agente (Cline) — Por cada tarea
Después de implementar cada tarea, Cline debe ejecutar esta verificación automática:

| # | Verificación | Descripción |
|---|-------------|-------------|
| 1 | **Sintaxis válida** | Verificar que el código no tiene errores de sintaxis (JS, HTML, CSS) |
| 2 | **Imports correctos** | Verificar que todos los imports/resolves existen y están bien escritos |
| 3 | **Variables de entorno** | Verificar que las nuevas variables están documentadas en `.env` |
| 4 | **Manejo de errores** | Verificar que las funciones críticas tienen try/catch o manejo de errores |
| 5 | **Logging** | Verificar que se agregaron logs informativos (console.log/warn/error) |
| 6 | **Casos edge** | Verificar que se consideraron casos vacíos, nulos o límite |
| 7 | **Consistencia** | Verificar que sigue el mismo patrón que el código existente |
| 8 | **Sin secretos** | Verificar que no hay passwords, API keys, tokens hardcodeados |
| 9 | **Pruebas unitarias** | Verificar que se crearon/actualizaron pruebas para el nuevo código |
| 10 | **Pruebas de integración** | Verificar que se crearon/actualizaron pruebas de integración |

**Si alguna verificación falla:** Corregir el problema antes de continuar con la siguiente tarea.

**Registrar evento:** Agregar entrada `AGENT_VERIFIED` o `AGENT_FAILED` en la bitácora.

#### 2.3 Verificación Humana (QA)
Al completar TODAS las tareas del desglose:

1. **Registrar evento:** Agregar entrada `HUMAN_REQUESTED` en la bitácora
2. **Presentar al humano** el checklist de pruebas manuales definido en el sprint
3. **Esperar confirmación** del humano (respuesta: `✅ Aprobado` o `❌ Rechazado - [motivo]`)

**Reglas de la verificación humana:**
- El sprint NO se considera completado hasta que el humano haya verificado todas las pruebas manuales exitosamente
- Si el humano rechaza, el agente debe solicitar detalles para corregir
- Después de corregir, solicitar nueva verificación humana

**Registrar evento:** Agregar entrada `HUMAN_VERIFIED` o `HUMAN_REJECTED` en la bitácora.

---

### Fase 3: Finalización

1. **Actualizar estado de la HU** en `docs/user-stories/index.md`:
   - Cambiar estado de `⏳ Pendiente` a `✅ Completada`
   - Mover la HU de la sección "Backlog (pendientes)" a "Completadas"

2. **Cerrar el sprint** en `docs/user-stories/sprints/HU-XXX-sprint.md`:
   - Marcar estado como `✅ Completado`
   - Agregar fecha de finalización
   - Registrar evento `SPRINT_COMPLETED`

3. **Presentar resumen final** con el formato especificado

---

## 📋 Formato de Archivo de Sprint

El archivo de sprint debe crearse usando la plantilla:
`docs/user-stories/templates/sprint-template.md`

**Estructura del archivo:**
- Resumen del Sprint (metadatos)
- Archivos Afectados (con estado de cada uno)
- ✅ Verificación Dual (Agente + Humano) — **OBLIGATORIO**
   - Tabla de auto-verificación del agente (10 puntos)
   - Tabla de verificación humana (pruebas manuales)
- 📝 Bitácora del Sprint (eventos cronológicos)
- 🧪 Pruebas Ejecutadas
- 🔗 Enlaces relacionados

---

## 🧪 Directrices de Pruebas (Testing Directives)

### Para toda implementación nueva, Cline DEBE:

#### 1. Pruebas Unitarias (Jest + Supertest)
- Crear archivos en `backend/tests/unit/` con nombre `*.test.js`
- Usar mocking para dependencias externas (Nodemailer, MongoDB)
- Probar casos exitosos y de error
- Ubicación sugerida: `backend/tests/unit/<servicio>.test.js`

```javascript
// Ejemplo de estructura de prueba unitaria
import { describe, it, expect, jest, beforeEach } from '@jest/globals';

describe('emailService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('debe enviar correo exitosamente', async () => {
    // Arrange
    // Act
    // Assert
  });

  it('debe manejar error de conexión SMTP', async () => {
    // Arrange
    // Act
    // Assert
  });
});
```

#### 2. Pruebas de Integración
- Crear archivos en `backend/tests/integration/` con nombre `*.test.js`
- Probar el endpoint completo con autenticación
- Probar casos: éxito, sin datos, error de autenticación, rate limiting
- Usar base de datos en memoria (mongodb-memory-server) o mock de la BD

```javascript
// Ejemplo de estructura de prueba de integración
import { describe, it, expect, beforeAll, afterAll } from '@jest/globals';
import request from 'supertest';

describe('POST /api/rifa/reporte-confianza/enviar', () => {
  it('debe devolver 401 sin API Key', async () => {
    const res = await request(app).post('/api/rifa/reporte-confianza/enviar');
    expect(res.status).toBe(401);
  });

  it('debe enviar reporte exitosamente con API Key válida', async () => {
    const res = await request(app)
      .post('/api/rifa/reporte-confianza/enviar')
      .set('Authorization', 'Bearer test-api-key');
    expect(res.status).toBe(200);
  });
});
```

#### 3. Pruebas Manuales (Checklist Humano)
- Definir en el archivo de sprint las pruebas manuales que el humano debe ejecutar
- Incluir: prueba funcional, prueba de error, prueba de integración, prueba de seguridad

#### 4. Cobertura Mínima
- **Pruebas unitarias:** Al menos 2 escenarios por función (éxito + error)
- **Pruebas de integración:** Al menos 3 escenarios por endpoint (éxito, sin auth, sin datos)
- **Pruebas manuales:** Al menos 3 escenarios definidos en el sprint

---

## ✅ Criterios de Aceptación del Sprint

Un sprint se considera exitoso cuando:

- [ ] Todas las tareas del desglose están implementadas
- [ ] La auto-verificación del agente tiene 10/10 ✅
- [ ] La verificación humana tiene todas las pruebas ✅
- [ ] Las pruebas unitarias pasan (comando: `cd backend && pnpm jest tests/unit/`)
- [ ] Las pruebas de integración pasan (comando: `cd backend && pnpm jest tests/integration/`)
- [ ] El archivo de sprint está completo y actualizado
- [ ] El índice `docs/user-stories/index.md` refleja el estado actualizado
- [ ] No hay secretos hardcodeados en el código

---

## 🚨 Reglas Importantes

1. **No modificar archivos no relacionados** con la HU
2. **Respetar el orden de dependencias** del desglose de tareas
3. **Si una tarea no puede completarse**, reportar el problema y no continuar
4. **Si se identifica otra dependencia o riesgo**, reportar el problema y no continuar
5. **NO marcar una tarea como completada** si la auto-verificación falla
6. **NO cerrar el sprint** hasta que el humano haya verificado las pruebas manuales
7. **El archivo de sprint es la fuente de verdad** del estado del sprint

---

## 📊 Formato de Respuesta

Al finalizar la implementación (pero antes de la verificación humana), Cline debe presentar:

```
✅ Implementación completada para HU-XXX

Tareas implementadas:
- [x] Tarea 1: [descripción] - [archivos modificados]
- [x] Tarea 2: [descripción] - [archivos modificados]
- ...

Auto-verificación del agente: [N]/10 ✅

⏳ Pendiente: Verificación humana (QA)
El sprint está listo para revisión humana.
Ejecutar pruebas manuales definidas en:
docs/user-stories/sprints/HU-XXX-sprint.md
```

Al recibir confirmación de la verificación humana, presentar:

```
✅ Sprint completado para HU-XXX

Tareas implementadas:
- [x] Todas las [N] tareas completadas

Auto-verificación del agente: 10/10 ✅
Verificación humana: [N]/[M] ✅

Estado actualizado:
- HU-XXX: ⏳ Pendiente → ✅ Completada
- Sprint: docs/user-stories/sprints/HU-XXX-sprint.md
- Index: Actualizado