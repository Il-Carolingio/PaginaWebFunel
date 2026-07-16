# Evaluación: HU-021 - Resetear contraseña por correo electrónico

**Fecha:** 2026-07-10  
**Evaluador:** Sistema Agentic Brain  
**Resultado:** ✅ Viable - Complejidad Media

---

## 📊 Resumen de Evaluación

| Aspecto | Valoración |
|---------|------------|
| **Viabilidad** | ✅ Alta - Tecnologías disponibles |
| **Complejidad** | 🟡 Media - Requiere integración de múltiples componentes |
| **Esfuerzo** | 4-6 horas |
| **Prioridad** | Alta |
| **Riesgo** | Bajo - Componentes probados |

---

## ✅ Análisis de Viabilidad

### Componentes Disponibles
1. **Sistema de correos** ✅
   - Ya implementado en HU-005 y HU-020
   - Servicio `emailService.js` funcionando
   - SMTP configurado y probado

2. **Autenticación JWT** ✅
   - Ya implementado en AuthController
   - Tokens con expiración funcionando
   - Lógica de generación y validación lista

3. **Base de datos** ✅
   - MongoDB Atlas funcionando
   - Modelo Usuario disponible
   - Posibilidad de agregar campos o crear modelo PasswordReset

4. **Frontend** ✅
   - React + Chakra UI disponibles
   - React Router configurado
   - Componentes de formulario existentes

### Tecnologías Requeridas
- **Backend:** Express, JWT, bcrypt, nodemailer (ya disponibles)
- **Frontend:** React, React Router, Axios (ya disponibles)
- **Base de datos:** MongoDB (ya disponible)

**Conclusión:** ✅ Todos los componentes necesarios están disponibles y funcionando.

---

## 🟡 Análisis de Complejidad

### Complejidad Media - Razones:

1. **Backend (Media)**
   - 3 nuevos endpoints requeridos
   - Lógica de tokens con expiración
   - Rate limiting necesario
   - Integración con servicio de email

2. **Frontend (Media)**
   - 2 nuevas páginas
   - Modificación de Login.jsx
   - Validaciones de formulario
   - Manejo de estados de carga y error

3. **Seguridad (Media)**
   - Implementación de rate limiting
   - Validación de tokens
   - Prevención de reutilización de tokens
   - Logs de auditoría

### Factores que Reducen Complejidad
- ✅ Sistema de email ya funcionando
- ✅ Lógica JWT ya implementada
- ✅ Patrones de código establecidos
- ✅ Documentación de HU-020 como referencia

---

## 📋 Análisis de Impacto

### Afectación a Componentes Existentes

| Componente | Afectación | Riesgo |
|------------|------------|--------|
| **AuthController** | 🟡 Modificación menor | Bajo |
| **Modelo Usuario** | 🟡 Posible modificación | Bajo |
| **EmailService** | ✅ Sin cambios | Muy Bajo |
| **Login.jsx** | 🟡 Modificación menor | Bajo |
| **Navbar.jsx** | 🟡 Modificación menor | Bajo |
| **Base de datos** | 🟡 Nuevos campos o modelo | Bajo |

### Impacto en Funcionalidad Existente
- **Login actual:** No se ve afectado
- **Registro de usuarios:** No se ve afectado
- **CRM:** No se ve afectado
- **API endpoints existentes:** No se ven afectados

**Conclusión:** ✅ Bajo impacto en funcionalidad existente.

---

## ⚠️ Análisis de Riesgos

### Riesgos Identificados

| # | Riesgo | Probabilidad | Impacto | Mitigación |
|---|--------|--------------|---------|------------|
| 1 | **Abuso del endpoint de solicitud** | Media | Medio | Rate limiting (3 intentos/hora) |
| 2 | **Tokens filtrados** | Baja | Alto | HTTPS obligatorio, expiración 1h |
| 3 | **Emails no entregados** | Baja | Medio | Logs detallados, reintentos |
| 4 | **Tokens reutilizados** | Baja | Medio | Marcar token como usado después de uso |
| 5 | **Fuerza bruta** | Baja | Alto | Rate limiting, logs de auditoría |

### Medidas de Seguridad a Implementar
1. **Rate limiting:** Máximo 3 solicitudes por hora por IP
2. **Expiración:** Tokens válidos por 1 hora
3. **Uso único:** Token se invalida después de usar
4. **Mensajes genéricos:** No revelar si email existe
5. **Logs:** Registrar todos los intentos de reset
6. **HTTPS:** Obligatorio en producción

---

## 💡 Propuesta de Implementación

### Enfoque: Token JWT con Modelo Dedicado

**Ventajas:**
- ✅ Separación de concerns
- ✅ Fácil de invalidar tokens
- ✅ Escalable
- ✅ Permite auditoría

**Desventajas:**
- ⚠️ Requiere crear nuevo modelo
- ⚠️ Tabla adicional en BD

### Arquitectura Propuesta

#### Backend

**1. Nuevo Modelo: PasswordReset**
```javascript
{
  email: String,
  token: String,
  expiracion: Date,
  usado: Boolean,
  createdAt: Date
}
```

**2. Nuevos Endpoints:**
- `POST /api/auth/solicitar-reset` - Solicitar reset
- `GET /api/auth/validar-token-reset` - Validar token
- `POST /api/auth/resetear-password` - Resetear contraseña

**3. Lógica:**
- Generar token JWT con expiración 1h
- Almacenar en BD
- Enviar email con enlace
- Invalidar token después de uso

#### Frontend

**1. Nuevas Páginas:**
- `/solicitar-reset` - Formulario de solicitud
- `/resetear-password/:token` - Formulario de nueva contraseña

**2. Modificaciones:**
- Login.jsx: Agregar enlace "¿Olvidaste tu contraseña?"

**3. Componentes:**
- Formulario de solicitud de reset
- Formulario de nueva contraseña
- Mensajes de éxito/error

---

## 📝 Plan de Implementación

### Paso 1: Backend (2-3 horas)
1. Crear modelo PasswordReset
2. Crear endpoints en AuthController
3. Implementar rate limiting
4. Crear servicio de email para reset
5. Agregar validaciones

### Paso 2: Frontend (1.5-2 horas)
1. Crear página SolicitarReset.jsx
2. Crear página ResetearPassword.jsx
3. Modificar Login.jsx
4. Crear servicio de API
5. Agregar validaciones de formulario

### Paso 3: Testing (1 hora)
1. Probar flujo completo
2. Probar casos de error
3. Probar rate limiting
4. Probar expiración de tokens

### Paso 4: Documentación (0.5 horas)
1. Actualizar documentación
2. Crear guía de uso
3. Actualizar README

---

## 🎯 Criterios de Éxito

- ✅ Usuario puede solicitar reset desde login
- ✅ Recibe email con enlace funcional
- ✅ Puede resetear contraseña con token
- ✅ Token expira después de 1 hora
- ✅ Token no se puede reutilizar
- ✅ Rate limiting funciona
- ✅ No se revela información sensible
- ✅ Logs de auditoría funcionando

---

## 📊 Estimación Detallada

| Tarea | Tiempo |
|-------|--------|
| **Backend** | |
| - Modelo PasswordReset | 30 min |
| - Endpoints (3) | 1.5 horas |
| - Rate limiting | 30 min |
| - Servicio email | 30 min |
| - Validaciones | 30 min |
| **Frontend** | |
| - Páginas (2) | 1 hora |
| - Modificaciones Login/Navbar | 30 min |
| - Servicio API | 30 min |
| - Validaciones | 30 min |
| **Testing** | |
| - Pruebas unitarias | 30 min |
| - Pruebas de integración | 30 min |
| **Documentación** | |
| - Actualizar docs | 30 min |
| **Total** | **4-6 horas** |

---

## ✅ Conclusión

**RECOMENDADO: Proceder con la implementación**

La HU-021 es viable y tiene complejidad media. Todos los componentes necesarios están disponibles y funcionando. El impacto en funcionalidad existente es bajo y los riesgos son manejables con las medidas de seguridad propuestas.

**Próximo paso:** Esperar aprobación humana para proceder con la implementación.

---

## 📝 Notas

- Se puede reutilizar la lógica de JWT de HU-020
- El sistema de email ya está probado y funcionando
- Considerar implementar en una rama feature/HU-021-resetear-contrasena-email
- Después de implementar, crear PR y esperar aprobación antes de merge