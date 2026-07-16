# HU-021: Resetear contraseña por correo electrónico

## 📋 Historia de Usuario

**Como** usuario admin/vendedor  
**Quiero** poder resetear mi contraseña por medio del correo electrónico si se me olvidó y no puedo acceder al CRM  
**Para** tener nuevamente acceso al sistema sin necesidad de intervención manual del administrador

---

## 🎯 Criterios de Aceptación

### Criterio 1: Solicitud de reset
- [ ] El usuario puede solicitar el reseteo de contraseña desde la pantalla de login
- [ ] Debe ingresar su correo electrónico registrado
- [ ] El sistema valida que el correo exista en la base de datos
- [ ] Si el correo existe, se envía un enlace de reset al correo
- [ ] Si el correo no existe, se muestra un mensaje genérico (por seguridad)

### Criterio 2: Token de reset
- [ ] Se genera un token JWT con expiración de 1 hora
- [ ] El token se almacena en la base de datos junto con la fecha de expiración
- [ ] El token se envía por correo electrónico en un enlace
- [ ] El enlace incluye el token como parámetro

### Criterio 3: Página de reset
- [ ] El usuario puede acceder a la página de reset mediante el enlace del correo
- [ ] La página valida que el token sea correcto y no haya expirado
- [ ] Si el token es inválido o expiró, se muestra un mensaje de error
- [ ] Si el token es válido, se muestra un formulario para ingresar nueva contraseña
- [ ] El formulario requiere confirmación de contraseña
- [ ] La contraseña debe tener al menos 8 caracteres, una mayuscula, una minuscula, un numero y un caracter especial

### Criterio 4: Actualización de contraseña
- [ ] Al enviar el formulario, se valida que las contraseñas coincidan
- [ ] Se actualiza la contraseña en la base de datos (hasheada con bcrypt)
- [ ] Se invalida el token usado (no se puede reutilizar)
- [ ] Se envía un correo de confirmación al usuario
- [ ] Se muestra un mensaje de éxito al usuario

### Criterio 5: Seguridad
- [ ] Los tokens expiran en 1 hora
- [ ] Los tokens solo se pueden usar una vez
- [ ] No se revela información sensible en los mensajes de error
- [ ] Se registran intentos de reset en los logs
- [ ] Se implementa rate limiting para evitar abuso

---

## 📊 Priorización

- **Prioridad:** Alta
- **Complejidad:** Media
- **Esfuerzo estimado:** 4-6 horas
- **Dependencias:** 
  - Sistema de correos funcionando (ya implementado en HU-005 y HU-020)
  - Autenticación JWT funcionando (ya implementado)

---

## 🔧 Consideraciones Técnicas

### Backend
1. **Nuevo modelo:** `PasswordReset` (o agregar campos a `Usuario`)
   - email
   - token
   - expiracion
   - usado (boolean)

2. **Nuevos endpoints:**
   - `POST /api/auth/solicitar-reset` - Solicitar reset de contraseña
   - `POST /api/auth/resetear-password` - Resetear contraseña con token
   - `GET /api/auth/validar-token-reset` - Validar que el token sea válido

3. **Servicio de correo:** Reutilizar `emailService.js`

### Frontend
1. **Nuevas páginas:**
   - `/solicitar-reset` - Formulario para ingresar email
   - `/resetear-password/:token` - Formulario para nueva contraseña

2. **Modificaciones:**
   - Agregar enlace "¿Olvidaste tu contraseña?" en Login.jsx
   - Actualizar Navbar.jsx para mostrar opción de reset

### Seguridad
- Tokens JWT con expiración corta (1 hora)
- Rate limiting en endpoint de solicitud (máximo 3 intentos por hora)
- No revelar si un email existe o no
- Invalidar token después de uso
- Logs de auditoría

---

## 🧪 Casos de Prueba

### Caso 1: Solicitud de reset exitosa
1. Usuario va a login
2. Hace clic en "¿Olvidaste tu contraseña?"
3. Ingresa su email registrado
4. Recibe correo con enlace de reset
5. Hace clic en el enlace
6. Ingresa nueva contraseña
7. Confirma contraseña
8. Puede hacer login con la nueva contraseña

### Caso 2: Email no registrado
1. Usuario solicita reset con email no registrado
2. Sistema muestra mensaje genérico (no revela que el email no existe)
3. No se envía correo

### Caso 3: Token expirado
1. Usuario recibe correo con enlace
2. Espera más de 1 hora
3. Intenta acceder al enlace
4. Sistema muestra mensaje de token expirado
5. Opción de solicitar nuevo reset

### Caso 4: Token ya usado
1. Usuario resetea su contraseña
2. Intenta usar el mismo enlace nuevamente
3. Sistema muestra mensaje de token inválido

### Caso 5: Contraseñas no coinciden
1. Usuario ingresa al formulario de reset
2. Ingresa contraseñas diferentes
3. Sistema muestra error de validación

---

## 📝 Notas Adicionales

- El sistema de correos ya está funcionando (SMTP configurado)
- Se puede reutilizar la lógica de JWT de AuthController
- Considerar implementar un servicio de email transaccional para mejor deliverabilidad
- En producción, considerar usar un servicio especializado como SendGrid o Mailgun

---

## 🔄 Historial

- **Creada:** 2026-07-10
- **Estado:** Pendiente de evaluación
- **Evaluador:** (pendiente)