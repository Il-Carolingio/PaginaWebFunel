# HU-012: Cambiar Contraseña de Usuario

**Estado:** ✅ Aprobada
**Prioridad:** Media
**Sprint:** 4
**Esfuerzo estimado:** 3 horas
**Tiempo estimado:** 0.75 días
**Sprint Inicio:** 2026-06-30
**Sprint Fin:** 2026-07-14

---

## Descripción

> **Como** usuario vendedor o administrador autenticado,
> **Quiero** cambiar mi contraseña,
> **Para** poder tener mayor seguridad en mi cuenta.

---

## Criterios de Aceptación

- [ ] El usuario autenticado puede acceder a la sección de cambiar contraseña
- [ ] Debe ingresar la contraseña actual (para verificar identidad)
- [ ] Debe ingresar la nueva contraseña
- [ ] Debe confirmar la nueva contraseña
- [ ] Validación: contraseña actual debe ser correcta
- [ ] Validación: nueva contraseña debe tener mínimo 6 caracteres
- [ ] Validación: nueva contraseña y confirmación deben coincidir
- [ ] Al cambiar, muestra mensaje de éxito
- [ ] Al cambiar, cierra todas las sesiones activas (opcional pero recomendado)
- [ ] Diseño responsivo (móvil y desktop)

---

## Notas Técnicas

### Backend
- **Endpoint nuevo:** `POST /api/auth/cambiar-password`
- **Middleware:** `verificarToken` (autenticación requerida)
- **Validaciones:**
  - Contraseña actual: debe coincidir con la almacenada
  - Nueva contraseña: mínimo 6 caracteres
  - Confirmación: debe coincidir con nueva contraseña
- **Seguridad:**
  - Hashear nueva contraseña con bcrypt
  - No devolver la contraseña en la respuesta
  - invalidar todos los tokens JWT anteriores
  - volver a solicitar log in

### Frontend
- **Página:** `frontend/src/pages/Crm.jsx` (pestaña Perfil)
- **Cambios:**
  - Agregar sección/formulario de cambio de contraseña
  - Campos: contraseña actual, nueva contraseña, confirmar contraseña
  - Validaciones en tiempo real solo cuando se cambia la contraseña
    - 8 caracteres
    - una mayuscula y una minuscula
    - un numero
    - un caracter especial
  - Botón "Cambiar Contraseña"
  - Mostrar fortaleza de contraseña de acuerdo a las reglas que cumpla en la validacion (usar yup)

---

## Dependencias

- HU-010 (Login y Dashboard CRM) ✅ Completada
- HU-011 (Editar Perfil) ✅ Completada

---

## Estimación

- **Complejidad:** Media
- **Esfuerzo:** 3 horas
- **Tiempo:** 0.75 días

**Desglose:**
- Backend - Endpoint de cambio de password: 1h
- Frontend - Formulario de cambio de password: 1.5h
- Testing y validación: 0.5h

---

## Consideraciones de Seguridad

1. **Verificación de identidad:** El usuario debe ingresar su contraseña actual
2. **Hash de contraseña:** Usar bcrypt con salt de 10 rondas
3. **Validación de fortaleza:** Mínimo 6 caracteres (puede aumentarse)
4. **Invalidar sesiones:** Al cambiar contraseña, cerrar todas las sesiones activas
5. **Mensajes genéricos:** No revelar si la contraseña actual es incorrecta (prevenir enumeración)