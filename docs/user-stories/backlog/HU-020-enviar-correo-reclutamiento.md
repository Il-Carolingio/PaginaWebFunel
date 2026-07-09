# HU-020: Enviar correo a candidato de reclutamiento

**Estado:** Pendiente de evaluación
**Prioridad:** Media
**Sprint:** 4
**Esfuerzo estimado:** 2.5 horas
**Tiempo estimado:** 0.625 días
**Sprint Inicio:** 2026-07-05
**Sprint Fin:** 2026-07-19

---

## Descripción

> **Como** usuario administrador,
> **Quiero** enviar un correo electrónico a un candidato de reclutamiento desde las tareas del CRM,
> **Para** verificar que el correo sea válido y enviarle el enlace de registro dentro del CRM, permitiendo el alta de un nuevo vendedor.

---

## Contexto
- Cada persona que se registra para ser reclutada se convierte en una **tarea** de tipo "reclutamiento" en el CRM
- Estas tareas se generan automáticamente cuando alguien llena el formulario de reclutamiento
- El administrador ve estas tareas en el CRM, en el filtro "Reclutamiento"
- Desde cada tarea de reclutamiento, el admin debe poder enviar un correo de registro al candidato

---

## Criterios de Aceptación

- [ ] En las tareas de tipo "reclutamiento" del CRM, el administrador ve un botón "Enviar Correo de Registro"
- [ ] Al hacer clic, se muestra un diálogo/modal con formulario prellenado con los datos del candidato
- [ ] El formulario muestra: email (editable), nombre (editable), rol (select: admin/vendedor/invitado)
- [ ] El sistema valida que el correo tenga formato válido
- [ ] Al confirmar, se envía un correo electrónico con un enlace único de registro
- [ ] El enlace lleva a una página donde el candidato puede completar su registro
- [ ] La tarea de reclutamiento pasa a estado "completada" después de enviar el correo
- [ ] Se muestra mensaje de confirmación al administrador
- [ ] Si el correo falla, se muestra mensaje de error
- [ ] Solo el administrador puede ver y usar el botón de envío

---

## Notas Técnicas

- **Endpoint:** `POST /api/reclutamiento/enviar-correo/:id` (nuevo endpoint)
- **Backend:** 
  - Modificar modelo Reclutamiento: agregar tokenRegistro, tokenExpiracion, registroCompletado
  - Generar token JWT con expiración de 24h
  - Enviar correo con enlace usando nodemailer
  - Marcar tarea de reclutamiento como completada
- **Frontend:** 
  - Modificar Crm.jsx: agregar botón "Enviar Correo" en tareas de tipo "reclutamiento"
  - Modal con formulario: email, nombre, rol
  - Validar permisos de admin
- **Email:** Plantilla HTML con enlace de registro
- **Token:** JWT con reclutamientoId, email, nombre, rol (24h expiración)

---

## Dependencias

- ✅ **HU-012** - Sistema de reclutamiento (Completada - provee modelo Reclutamiento)
- ✅ **HU-014** - Registro de vendedores (Completada - provee registro)
- ✅ **HU-017** - Tareas de reclutamiento en CRM (Completada - provee tareas)

---

## Estimación

- **Complejidad:** Media
- **Esfuerzo:** 2.5 horas
- **Tiempo:** 0.625 días

**Desglose:**
- Backend (modelo + controlador + ruta + email): 1.5h
- Frontend Crm.jsx (botón + modal + formulario): 1h
- Testing y validación: 0.5h