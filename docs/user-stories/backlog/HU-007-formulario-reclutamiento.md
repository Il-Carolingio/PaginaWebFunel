# HU-007: Formulario de Registro para Reclutamiento de Equipo de Ventas

**Estado:** Pendiente de aprobación
**Prioridad:** Alta
**Sprint:** 4
**Esfuerzo estimado:** 6 horas
**Tiempo estimado:** 1.5 días

---

## Descripción

> **Como** usuario final interesado en unirse al equipo de ventas,
> **Quiero** registrarme mediante un formulario vistoso, rápido y fácil de llenar,
> **Para** que me puedan contactar lo antes posible.

---

## Criterios de Aceptación

- [ ] El formulario es visualmente atractivo y profesional
- [ ] Los campos son claros y fáciles de entender
- [ ] El formulario se puede llenar en menos de 2 minutos
- [ ] Muestra validación en tiempo real de los campos
- [ ] Al enviar, muestra mensaje de éxito confirmando el registro
- [ ] Los datos se guardan en la base de datos (colección `prospectos` o nueva colección `reclutamiento`)
- [ ] El formulario es responsive (funciona en móvil y desktop)

---

## Notas Técnicas

- Crear página `frontend/src/pages/Reclutamiento.jsx` (ya existe, hay que mejorarla)
- Usar React Hook Form + Yup para validación
- Usar Chakra UI para el diseño
- Campos sugeridos:
  - Nombre completo (requerido)
  - Teléfono (requerido, validar formato)
  - Correo electrónico (requerido, validar email)
  - ¿Tienes experiencia en ventas? (select: Sí/No)
  - ¿Por qué quieres unirte a Royal Prestige? (textarea, opcional)
  - Disponibilidad de horario (select: Mañana/Tarde/Noche/Flexible)
  - Status de reclutamiento (pendiente, contratado, cancelado)
- Endpoint backend: `POST /api/reclutamiento/registro`
- Colección MongoDB: `reclutamiento`

---

## Dependencias

- HU-002 (Formulario de registro) ✅ Completada (reutilizar validaciones)
- HU-003 (Endpoint de registro) ✅ Completada (reutilizar estructura)