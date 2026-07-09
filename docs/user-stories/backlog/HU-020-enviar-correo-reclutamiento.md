# HU-020: Enviar correo a candidato de reclutamiento

**Estado:** Pendiente de evaluación
**Prioridad:** Media
**Sprint:** 4
**Esfuerzo estimado:** 3 horas
**Tiempo estimado:** 0.75 días
**Sprint Inicio:** 2026-07-05
**Sprint Fin:** 2026-07-19

---

## Descripción

> **Como** usuario administrador,
> **Quiero** enviar un correo electrónico a un candidato de reclutamiento como vendedor,
> **Para** verificar que el correo sea válido y enviarle el enlace de registro dentro del CRM, permitiendo el alta de un nuevo vendedor.

---

## Criterios de Aceptación

- [ ] El administrador puede ver un botón "Enviar correo de registro" en la página de reclutamiento
- [ ] Al hacer clic, se muestra un formulario o diálogo para confirmar el envío
- [ ] El sistema valida que el correo del candidato tenga formato válido
- [ ] Se envía un correo electrónico al candidato con un enlace único de registro
- [ ] El enlace lleva a una página de registro donde el candidato puede crear su cuenta
- [ ] Una vez registrado, el candidato queda asociado al proceso de reclutamiento
- [ ] Se muestra un mensaje de confirmación al administrador
- [ ] Si el correo falla al enviarse, se muestra un mensaje de error

---

## Notas Técnicas

- **Endpoint:** `POST /api/reclutamiento/enviar-correo/:id` (nuevo endpoint)
- **Backend:** 
  - Validar formato de correo
  - Generar token único de registro
  - Enviar correo con enlace usando nodemailer
  - Almacenar token y fecha de expiración
- **Frontend:** 
  - Agregar botón en Reclutamiento.jsx
  - Mostrar estado de envío (éxito/error)
- **Email:** Usar plantilla HTML con enlace de registro
- **Token:** JWT o token aleatorio con expiración (24h)

---

## Dependencias

- ✅ **HU-012** - Sistema de reclutamiento (Completada - provee estructura)
- ✅ **HU-014** - Registro de vendedores (Completada - provee registro)

---

## Estimación

- **Complejidad:** Media
- **Esfuerzo:** 3 horas
- **Tiempo:** 0.75 días

**Desglose:**
- Backend: Generar token + endpoint + envío de correo: 1.5h
- Frontend: Botón + formulario + manejo de estados: 1h
- Testing y validación: 0.5h