# HU-008: Notificación Automática de Prospectos de Confianza

**Estado:** ✅ Aprobada - Lista para implementar
**Prioridad:** Alta
**Sprint:** 4
**Esfuerzo estimado:** 4 horas
**Tiempo estimado:** 1 día
**Sprint Inicio:** 2026-06-29
**Sprint Fin:** 2026-07-13

---

## Descripción

> **Como** vendedor,
> **Quiero** recibir una notificación por correo cuando se hayan registrado 5 prospectos de confianza (cumpleFiltros: true),
> **Para** poder iniciar el proceso de agendar citas de manera oportuna.

---

## Criterios de Aceptación

- [ ] Cuando un usuario se registra en la rifa, se evalúa automáticamente con el sistema de scoring
- [ ] Si el prospecto cumple filtros (cumpleFiltros: true), se agrega a la lista de pendientes
- [ ] Se verifica automáticamente la cantidad de prospectos con cumpleFiltros: true
- [ ] Cuando se alcanzan 5 prospectos de confianza, se envía correo automáticamente
- [ ] El correo se envía solo a administradores
- [ ] El correo incluye los datos de los 5 prospectos (nombre, teléfono, email, etc.)
- [ ] Después de enviar el correo, se marcan los prospectos como notificados
- [ ] El sistema vuelve a monitorear para el próximo grupo de 5

---

## Notas Técnicas

- Modificar el endpoint existente: `POST /api/rifa/registro-olla-sarten-salud`
- Después de guardar el prospecto y evaluar scoring, verificar cantidad de prospectos confiables
- Si cantidad >= 5 → enviar correo automáticamente
- Reutilizar lógica de `ReporteConfianzaController.js` (HU-005)
- Usar `reporteEnviado` para marcar como ya contado
- Destinatarios: configurados en `.env` (EMAIL_ADMIN:copaduceo@gmail.com solo en desarrollo)
- Contenido del correo: lista de prospectos con sus datos

---

## Dependencias

- HU-003 (Endpoint de registro) ✅ Completada
- HU-004 (Sistema de scoring) ✅ Completada
- HU-005 (Reporte por correo) ✅ Completada (reutilizar servicio de email)

---

## Cambios Requeridos

### 1. Modificar `backend/controllers/ProspectoController.js`

Después de guardar el prospecto y evaluar scoring:
```javascript
// Verificar si hay 5+ prospectos de confianza
const prospectosConfianza = await Prospecto.countDocuments({
  cumpleFiltros: true,
  reporteEnviado: false
});

if (prospectosConfianza >= 5) {
  // Obtener los 5 prospectos más recientes
  const prospectos = await Prospecto.find({
    cumpleFiltros: true,
    reporteEnviado: false
  })
  .sort({ createdAt: -1 })
  .limit(5)
  .lean();
  
  // Enviar correo
  await enviarReporteConfianza(prospectos);
  
  // Marcar como enviados
  await Prospecto.updateMany(
    { _id: { $in: prospectos.map(p => p._id) } },
    { $set: { reporteEnviado: true } }
  );
}
```

### 2. Modificar `backend/services/emailService.js`

Reutilizar función `enviarReporteConfianza` existente.

### 3. Actualizar `.env`

Agregar:
```
EMAIL_ADMIN=copaduceo@gmail.com(Solo en desarrollo para pruebas)
```

---

## Estimación

- **Complejidad:** Media
- **Esfuerzo:** 4 horas
- **Tiempo:** 1 día

**Desglose:**
- Modificar ProspectoController: 1.5h
- Probar flujo completo: 1h
- Testing y ajustes: 1.5h