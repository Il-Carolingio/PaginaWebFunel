# Evaluación: HU-020 - Enviar correo a candidato de reclutamiento

**Fecha de evaluación:** 2026-07-09 (v2 - actualizada)
**Evaluador:** Sistema Agentic Brain
**Estado HU:** Pendiente de evaluación → Evaluada

---

## 1. Resumen Ejecutivo

La HU-020 propone agregar la funcionalidad para que administradores envíen correos de registro a candidatos de reclutamiento. El sistema ya cuenta con:
- Modelo `Reclutamiento` con email validado por formato pero no por existencia
- Servicio de envío de correos (`emailService.js`) con nodemailer, actualmente usado solo para reportes de prospectos
- Sistema de registro de prospectos de clientes (HU-005, HU-008)
- Sistema de registro de prospectos de vendedores (HU-007)

Se requiere generar un token único de registro, almacenarlo en el modelo, enviar un correo con enlace y marcar la tarea como completada. La implementación es de **complejidad media** y requiere modificar el modelo de datos.

---

## 2. Análisis de Viabilidad

- **¿Es técnicamente viable?** ✅ Sí
- **¿Requiere nueva infraestructura?** ❌ No (usa infraestructura existente)
- **¿Depende de otras HUs?** ✅ Sí, depende de HU-007 (reclutamiento) - completada
- **¿Requiere nuevos paquetes/dependencias?** ❌ No
- **¿Requiere modificar modelo de datos?** ✅ Sí, agregar campos de token a `Reclutamiento` y crear entrada en modelo `Usuario` como vendedor

---

## 3. Estimación de Esfuerzo

| Capa | Esfuerzo estimado | Complejidad |
|------|-------------------|-------------|
| Backend (Modelo Reclutamiento) | 0.5h | Media |
| Backend (Controlador) | 1h | Media |
| Backend (Rutas) | 0.25h | Baja |
| Backend (Servicio email) | 0.5h | Baja |
| Backend (Página de registro) | 2h | Media |
| Frontend (Reclutamiento.jsx) | 1h | Media |
| **Total** | **5.25h** | |

**Nota:** Si la página de registro ya existe y solo necesita adaptarse para tokens, el tiempo se reduce a ~3.25h.

---

## 4. Tecnologías a Utilizar

- **Backend:** Express, Mongoose, JWT (para generar token), nodemailer (existente)
- **Frontend:** React, Chakra UI, fetch (existente)
- **Base de datos:** MongoDB - Colecciones `reclutamientos` y `usuarios`
- **Paquetes nuevos requeridos:** Ninguno

---

## 5. Afectación Backend → Frontend

### Backend
- [x] Modificar modelo existente
- [x] Nuevo controlador (función en ReclutamientoController.js)
- [x] Nuevas rutas (en routes/reclutamiento.js)
- [x] Modificar servicio de email existente
- Archivos afectados:
  - `backend/models/Reclutamiento.js` - Agregar campos: `tokenRegistro`, `tokenExpiracion`, `registroCompletado`
  - `backend/controllers/ReclutamientoController.js` - Nueva función `enviarCorreoRegistro`
  - `backend/routes/reclutamiento.js` - Nueva ruta `POST /api/reclutamiento/enviar-correo/:id`
  - `backend/services/emailService.js` - Nueva función `enviarCorreoRegistroReclutamiento`
  - `backend/models/Usuario.js` - Verificar si soporta rol "vendedor"

### Frontend
- [x] Modificar página existente
- [ ] Nuevo componente (formulario de envío)
- [x] Nueva página (registro-vendedor con token)
- [ ] Nuevo servicio API
- [ ] Nuevo contexto/provider
- Archivos afectados:
  - `frontend/src/pages/Reclutamiento.jsx` - Agregar botón "Enviar correo de registro" en cada tarjeta de reclutamiento + diálogo de confirmación con formulario (email, nombre, rol: admin/vendedor/invitado)
  - `frontend/src/pages/RegistroUsuario.jsx` - **Nueva página** para completar registro con token

---

## 6. Posibles Fallos y Riesgos

| # | Riesgo | Probabilidad | Impacto | Mitigación |
|---|--------|-------------|---------|------------|
| 1 | Token expirado o inválido | Media | Alto | Validar expiración (24h) y marcar como usado |
| 2 | Correo no enviado (SMTP) | Media | Medio | Reintentos automáticos + mensaje de error claro |
| 3 | Candidato ya registrado | Baja | Bajo | Validar si el email o teléfono ya existe en `Usuario` |
| 4 | Token filtrado/robado | Baja | Alto | Token de un solo uso + expiración corta (24h) |
| 5 | Formato de correo inválido | Baja | Bajo | Validar con regex antes de enviar |
| 6 | Página de registro no existe | Media | Alto | Crear página básica "Próximamente" o completa |

---

## 7. Criterios de Aceptación (Revisados)

- [x] CA-01: El administrador puede ver un botón "Enviar correo de registro" en cada tarea de reclutamiento
- [x] CA-02: Al hacer clic, se muestra un formulario/diálogo con datos prellenados (email, nombre) y selector de rol (admin/vendedor/invitado)
- [x] CA-03: El sistema valida que el correo del candidato tenga formato válido (ya validado en modelo Reclutamiento)
- [x] CA-04: Se envía un correo electrónico al candidato con un enlace único de registro
- [x] CA-05: El enlace lleva a una página de registro donde el candidato puede crear su cuenta
- [x] CA-06: Una vez registrado, el candidato queda asociado al proceso de reclutamiento (marcar `registroCompletado: true`)
- [x] CA-07: Se muestra un mensaje de confirmación al administrador
- [x] CA-08: Si el correo falla al enviarse, se muestra un mensaje de error
- [x] CA-09: La tarea de reclutamiento pasa a estado "completada" después de enviar el correo

**Nota:** CA-05 requiere crear la página de registro. Según la HU, puede ser una página básica con el mensaje "Próximamente" mientras se completa el flujo.

---

## 8. Dependencias

- [x] **HU-007** - Sistema de reclutamiento (✅ Completada - provee modelo Reclutamiento)
- [x] **HU-014** - Registro de vendedores (✅ Completada - provee registro, pero necesita adaptarse para tokens)

**Pregunta resuelta:** El sistema de registro actual necesita adaptarse para soportar tokens de registro. Se creará una página especial `RegistroUsuarios.jsx` que maneje el token.

---

## 9. Recomendación Final

**✅ Viable**

La HU es viable. Se recomienda implementar en este orden:

1. **Modificar el modelo `Reclutamiento`** para agregar:
   - `tokenRegistro`: String (único, indexado)
   - `tokenExpiracion`: Date
   - `registroCompletado`: Boolean (default: false)

2. **Generar token JWT** con:
   - `reclutamientoId`
   - `email`
   - `nombre`
   - `rol` (admin/vendedor/invitado)
   - `exp`: 24 horas

3. **Crear endpoint** `POST /api/reclutamiento/enviar-correo/:id` que:
   - Valide que el candidato existe
   - Genere el token
   - Actualice el modelo con token y expiración
   - Envíe el correo con enlace: `{FRONTEND_URL}/registro-vendedor?token={token}`
   - Marque la tarea de reclutamiento como completada

4. **Frontend - Reclutamiento.jsx:**
   - Botón "Enviar correo de registro" en cada tarjeta
   - Diálogo con formulario: email (editable), nombre (editable), rol (select: admin/vendedor/invitado)
   - Mostrar estado de envío con toast

5. **Frontend - Nueva página RegistroVendedor.jsx:**
   - Página básica con mensaje "Próximamente" o formulario simple
   - Validar token en URL
   - Mostrar datos del candidato
   - Opción de crear cuenta (si se implementa completo)

**Duración estimada:** ~5.25 horas

**Desglose actualizado:**
- Backend (modelo + controlador + rutas + email): 2.25h
- Frontend Reclutamiento.jsx (botón + formulario): 1h
- Página RegistroVendedor.jsx (básica): 2h