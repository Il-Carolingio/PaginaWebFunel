# HU-011: Editar Perfil de Usuario

**Estado:** ✅ Completada
**Prioridad:** Media
**Sprint:** 4
**Esfuerzo estimado:** 3 horas
**Tiempo estimado:** 0.75 días
**Sprint Inicio:** 2026-06-30
**Sprint Fin:** 2026-07-14

---

## Descripción

> **Como** vendedor y/o administrador autenticado,
> **Quiero** editar mi perfil para modificar todos mis datos,
> **Para** poder completar mi información personal.

---

## Criterios de Aceptación

- [ ] El usuario autenticado puede acceder a la sección de editar perfil
- [ ] Puede modificar: nombre, teléfono, email, dirección, contrato
- [ ] El email no se puede modificar (es el identificador único)
- [ ] Validación de email en tiempo real
- [ ] Validación de teléfono (formato)
- [ ] Al guardar, muestra mensaje de éxito
- [ ] Al guardar, actualiza el contexto de autenticación
- [ ] Diseño responsivo (móvil y desktop)

---

## Notas Técnicas

### Backend
- **Endpoint existente:** `PUT /api/vendedor/perfil` (ya existe en HU-010)
- **Validaciones:**
  - Email: formato válido, único (no se puede cambiar)
  - Teléfono: formato opcional
  - Nombre: requerido
  - Dirección: opcional
  - Contrato: opcional
- **Respuesta:** Devuelve el usuario actualizado

### Frontend
- **Página:** `frontend/src/pages/Crm.jsx` (pestaña Perfil)
- **Cambios:**
  - Convertir vista de perfil a formulario editable
  - Agregar modo edición/visualización
  - Botón "Editar","Guardar" y "Cancelar"
  - Validaciones en tiempo real
  - Actualizar contexto de autenticación después de guardar

---

## Dependencias

- HU-010 (Login y Dashboard CRM) ✅ Completada

---

## Estimación

- **Complejidad:** Baja
- **Esfuerzo:** 3 horas
- **Tiempo:** 0.75 días

**Desglose:**
- Backend: Ya existe el endpoint (0h)
- Frontend - Formulario editable: 2h
- Testing y validación: 1h