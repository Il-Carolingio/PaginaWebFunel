# HU-017: Tareas de Llamada para Reclutamiento

**Estado:** 🚧 En Progreso  
**Prioridad:** Alta  
**Sprint:** 6 (por definir)  
**Esfuerzo estimado:** 6 horas  
**Tiempo estimado:** 1.5 días

---

## Descripción

> **Como** administrador,  
> **Quiero** ver como tareas de llamada a las personas que se han registrado en "Únete al equipo",  
> **Para** poder darle seguimiento a su contratación.

---

## Criterios de Aceptación

- [ ] El administrador puede ver lista de personas registradas en "Únete al equipo"
- [ ] Cada registro se muestra como tarea de llamada pendiente
- [ ] Se puede filtrar por estado (pendiente, contactado, contratado, cancelado)
- [ ] Se puede marcar como completada o actualizar estado
- [ ] Muestra información relevante: nombre, teléfono, correo, fecha de registro
- [ ] Las tareas se crean automáticamente al haber nuevo registro (opcional)
- [ ] Interfaz responsive y consistente con el diseño existente

---

## Notas Técnicas

### Backend
- Nuevo endpoint: `GET /api/reclutamiento/tareas-llamada`
- Lógica: Consultar colección `reclutamiento` y transformar en tareas
- Reutilizar estructura de tareas existente (HU-013)
- Posiblemente: `POST /api/reclutamiento/crear-tarea` para generación manual

### Frontend
- Opción A: Extender dashboard de tareas existente con filtro por tipo "reclutamiento"
- Opción B: Crear página específica `ReclutamientoTareas.jsx`
- Reutilizar componentes de `Tareas.jsx` y `FiltroTareas.jsx`
- Mostrar datos de la colección `reclutamiento` en formato de tarea

### Base de Datos
- Colección existente: `reclutamiento`
- Posiblemente agregar campo `tareaGenerada` (boolean) para evitar duplicados

---

## Dependencias

- ✅ **HU-007** - Formulario de Reclutamiento (Completada - provee datos)
- ✅ **HU-013** - Evolucionar y administrar tareas (Completada - provee estructura)
- ✅ **HU-014** - Filtrar listado de tareas (Completada - provee filtros)
- ✅ **HU-015** - Cambiar estado de tarea (Completada - provee gestión de estados)

---

## 📊 Progreso de Implementación

### Fase 1: Backend ✅ Completada
- [x] Crear endpoint `GET /api/reclutamiento/tareas-llamada`
- [x] Implementar lógica de consulta a colección `reclutamiento`
- [x] Transformar datos de reclutamiento a formato de tareas
- [x] Agregar campo `tareaGenerada` a esquema de reclutamiento
- [x] Crear método `marcarTareaGenerada` en controlador
- [x] Agregar ruta `PUT /:id/marcar-tarea-generada`
- [x] Probar endpoint con Postman/Thunder Client

**Archivos modificados:**
- `backend/controllers/reclutamientoController.js` - Agregados métodos `obtenerTareasLlamada` y `marcarTareaGenerada`
- `backend/routes/reclutamiento.js` - Agregadas rutas `GET /tareas-llamada` y `PUT /:id/marcar-tarea-generada`
- `backend/models/Reclutamiento.js` - Agregado campo `tareaGenerada`

### Fase 2: Frontend - En Progreso
- [x] Crear servicio `reclutamientoService.js` con método `obtenerTareasLlamada()`
- [x] Modificar `Crm.jsx` para cargar tareas de reclutamiento (admin)
- [x] Agregar filtro por tipo "Reclutamiento" en dashboard
- [x] Implementar badge visual para diferenciar tareas de reclutamiento
- [ ] Mostrar información de contacto en tareas de reclutamiento
- [ ] Probar integración completa

**Archivos modificados:**
- `frontend/src/services/reclutamientoService.js` - Creado servicio completo
- `frontend/src/pages/Crm.jsx` - Agregado soporte para tareas de reclutamiento

### Fase 3: Testing y Pulido
- [ ] Probar flujo completo end-to-end
- [ ] Verificar responsive en móvil y desktop
- [ ] Validar mensajes de error y éxito
- [ ] Documentar cambios

---

## 🔍 Notas para el Siguiente Agente

### Estado Actual
La HU-017 está en progreso. El backend está completo y funcionando. El frontend necesita:
1. Crear el servicio de API para consumir el endpoint
2. Modificar los componentes existentes de tareas para soportar el nuevo tipo
3. Agregar el filtro de "Reclutamiento" en el dashboard

### Próximos Pasos Inmediatos
1. Mostrar información de contacto (teléfono, email) en tarjetas de reclutamiento
2. Probar la integración completa end-to-end
3. Verificar responsive en móvil y desktop
4. Documentar cambios finales

### Decisiones Tomadas
- Se reutiliza la estructura de tareas existente (no se crea tabla separada)
- Las tareas de reclutamiento se generan bajo demanda (no automáticamente al registrar)
- Se agregó campo `tareaGenerada` para futuras mejoras de generación automática

### Consideraciones
- El endpoint devuelve las tareas en el mismo formato que las tareas de vendedor
- El frontend debe diferenciar visualmente las tareas de reclutamiento con un badge o color distinto
- Los estados disponibles son: pendiente, contactado, contratado, cancelado

---

## 📊 Historial de Cambios

| Fecha | Cambio | Responsable |
|-------|--------|-------------|
| 2026-07-04 | Evaluación inicial: Aprobada | Sistema Agentic Brain |
| 2026-07-04 | Creación de documento de HU | Sistema Agentic Brain |
| 2026-07-04 | Fase 1 Backend completada | Sistema Agentic Brain |
| 2026-07-04 | Fase 2 Frontend en progreso | Sistema Agentic Brain |
