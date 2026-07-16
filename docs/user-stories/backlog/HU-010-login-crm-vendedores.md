# HU-010: Login y Dashboard de CRM para Vendedores

**Estado:** ✅ Completada
**Prioridad:** Media
**Sprint:** 4
**Esfuerzo estimado:** 8 horas
**Tiempo estimado:** 2 días
**Sprint Inicio:** 2026-06-30
**Sprint Fin:** 2026-07-14

---

## Descripción

> **Como** vendedor,
> **Quiero** entrar al CRM por medio de un login,
> **Para** poder ver todas mis configuraciones, tareas (citas, llamadas, seguimientos y organización de eventos).

---

## Criterios de Aceptación

- [ ] El vendedor puede iniciar sesión con email y contraseña
- [ ] El admin puede crear cuentas de vendedor desde los registros de reclutamiento (HU-007)
- [ ] El vendedor ve un dashboard con sus tareas pendientes
- [ ] El vendedor puede ver/editar su perfil (nombre, teléfono, email, dirección, contrato)
- [ ] El vendedor puede gestionar citas (agendar, ver, cancelar)
- [ ] El vendedor puede registrar llamadas (realizadas/pendientes)
- [ ] El vendedor puede agregar seguimientos a prospectos
- [ ] El vendedor puede organizar eventos
- [ ] El sistema usa autenticación JWT
- [ ] El diseño es responsivo (funciona en móvil y desktop)

---

## Notas Técnicas

### Backend
- **Modelos nuevos:**
  - `Usuario` (vendedor): email, password (hash), nombre, telefono, direccion, contrato, rol (vendedor/admin), activo
  - `Tarea` (base para citas, llamadas, seguimientos, eventos): tipo, titulo, descripcion, fecha, hora, estado, prospectoId, vendedorId
- **Autenticación:** JWT con bcrypt para passwords
- **Endpoints:**
  - `POST /api/auth/login` - Iniciar sesión
  - `POST /api/auth/registro` - Admin crea vendedor desde reclutamiento
  - `GET /api/vendedor/perfil` - Obtener perfil
  - `PUT /api/vendedor/perfil` - Actualizar perfil
  - `GET /api/tareas` - Listar tareas del vendedor
  - `POST /api/tareas` - Crear tarea
  - `PUT /api/tareas/:id` - Actualizar tarea
  - `DELETE /api/tareas/:id` - Eliminar tarea
- **Relación con HU-007:** Al aprobar un reclutamiento, el admin puede crear automáticamente un usuario vendedor

### Frontend
- **Login:** Página de login en `/crm/login`
- **Dashboard:** Página principal del CRM en `/crm/dashboard`
- **Secciones:**
  - Perfil (editar datos personales)
  - Citas (calendario/lista)
  - Llamadas (registro de llamadas)
  - Seguimientos (notas por prospecto)
  - Eventos (organización)
- **Protección:** Rutas protegidas con JWT, redirect a login si no autenticado

---

## Dependencias

- HU-007 (Formulario de Reclutamiento) ✅ Completada (base para crear vendedores)

---

## Cambios Requeridos

### 1. Modelos Backend
- `backend/models/Usuario.js` - Schema de vendedor/admin
- `backend/models/Tarea.js` - Schema de tareas (citas, llamadas, seguimientos, eventos)

### 2. Controladores Backend
- `backend/controllers/AuthController.js` - Login, registro
- `backend/controllers/VendedorController.js` - Perfil
- `backend/controllers/TareaController.js` - CRUD de tareas

### 3. Rutas Backend
- `backend/routes/auth.js`
- `backend/routes/vendedor.js`
- `backend/routes/tareas.js`

### 4. Frontend
- `frontend/src/pages/Crm.jsx` - Página principal del CRM (reemplazar contenido vacío)
- `frontend/src/components/Login.jsx` - Formulario de login
- `frontend/src/components/Dashboard.jsx` - Dashboard con tareas
- Contexto de autenticación para proteger rutas

---

## Estimación

- **Complejidad:** Alta
- **Esfuerzo:** 8 horas
- **Tiempo:** 2 días

**Desglose:**
- Backend (modelos, controladores, rutas): 4h
- Frontend (login, dashboard, perfil, tareas): 3h
- Testing e integración: 1h