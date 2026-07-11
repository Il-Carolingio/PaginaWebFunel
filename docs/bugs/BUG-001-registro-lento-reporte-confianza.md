# BUG-001: Registro lento al alcanzar 5 prospectos de confianza

**Fecha:** 2026-07-10
**Reportado por:** Usuario
**Severidad:** Media
**Prioridad:** Alta
**Estado:** Pendiente de evaluación

---

## Descripción del Bug

Al registrar el quinto prospecto de confianza (cumpleFiltros: true), el sistema tarda en mostrar:
- El número de rifa
- El mensaje de "registro exitoso"

Este retraso ocurre porque el proceso de envío del reporte de prospectos confiables se ejecuta de forma **síncrona** antes de responder al cliente, bloqueando la respuesta HTTP.

### Comportamiento Actual
1. Usuario completa formulario de registro
2. Sistema guarda prospecto en BD
3. Sistema detecta que hay 5+ prospectos de confianza
4. **Sistema envía correo de reporte (bloquea ~3-8 segundos)**
5. Sistema marca prospectos como `reporteEnviado: true`
6. **Recién aquí** el usuario ve el número de rifa y mensaje de éxito

### Comportamiento Esperado
1. Usuario completa formulario de registro
2. Sistema guarda prospecto en BD
3. **Usuario ve inmediatamente el número de rifa y mensaje de éxito**
4. Sistema revisa los registros de reporteEnviado igual a false y los actualiza a true (sin bloquear)
5. Sistema envía correo de reporte en background (sin bloquear)

---

## Análisis de Causa Raíz

### Código Problemático
**Archivo:** `backend/controllers/ProspectoController.js`
**Líneas:** 170-201

```javascript
// HU-008: Verificar si hay 5+ prospectos de confianza para notificar
if (nuevoProspecto.cumpleFiltros) {
  const prospectosConfianza = await Prospecto.countDocuments({
    cumpleFiltros: true,
    reporteEnviado: false,
  });

  if (prospectosConfianza >= 5) {
    const prospectos = await Prospecto.find({
      cumpleFiltros: true,
      reporteEnviado: false,
    })
      .sort({ createdAt: -1 })
      .limit(5)
      .lean();

    try {
      // ❌ ESTA LÍNEA BLOQUEA LA RESPUESTA (3-8 segundos)
      await enviarReporteConfianza(prospectos);
      
      // ❌ ESTA TAMBIÉN BLOQUEA
      await Prospecto.updateMany(
        { _id: { $in: prospectos.map(p => p._id) } },
        { $set: { reporteEnviado: true } }
      );
    } catch (error) {
      console.error('[ProspectoController] Error al enviar notificación:', error);
    }
  }
}
```

### Causa del Retraso
1. **`enviarReporteConfianza()`** (emailService.js línea 178-204):
   - Genera HTML del reporte
   - Envía correo con reintentos y backoff exponencial
   - **Tiempo estimado: 3-8 segundos** (depende del SMTP)

2. **`Prospecto.updateMany()`**:
   - Marca 5 prospectos como `reporteEnviado: true`
   - **Tiempo estimado: 100-300ms**

**Total: 3-8 segundos de bloqueo**

---

## Evaluación de Impacto

### Afectación a Funcionalidad Existente

| Componente | Afectación | Riesgo |
|------------|------------|--------|
| **Registro de prospectos** | ✅ Mejora performance de respuesta | Bajo |
| **Envío de reportes** | ✅ Sigue funcionando igual | Bajo |
| **Marcado de prospectos** | ✅ Sigue funcionando igual | Bajo |
| **Base de datos** | ✅ Sin cambios | Bajo |
| **Frontend (Funnel.jsx)** | ✅ Sin cambios necesarios | Bajo |

### Riesgos Identificados

| # | Riesgo | Probabilidad | Impacto | Mitigación |
|---|--------|--------------|---------|------------|
| 1 | **El proceso en background falla** | Media | Medio | Agregar logs detallados y reintentos automáticos |
| 2 | **El correo no se envía** | Baja | Bajo | El sistema ya tiene reintentos (3 intentos con backoff) |
| 3 | **Los prospectos no se marcan como enviados** | Baja | Medio | El job en background maneja esto, pero podría fallar |
| 4 | **Múltiples envíos del mismo reporte** | Media | Bajo | Usar flag `reporteEnviado` como mecanismo de idempotencia |

---

## Propuesta de Solución

### Enfoque: Procesamiento Asíncrono con `setImmediate()`

**Ventajas:**
- ✅ Simple de implementar
- ✅ No requiere dependencias adicionales
- ✅ El proceso continúa en el mismo servidor
- ✅ Bajo riesgo de fallo

**Desventajas:**
- ⚠️ Si el servidor se reinicia, el proceso en background se pierde
- ⚠️ No hay persistencia del job

### Implementación Propuesta

```javascript
// En ProspectoController.js (líneas 170-201)

if (nuevoProspecto.cumpleFiltros) {
  const prospectosConfianza = await Prospecto.countDocuments({
    cumpleFiltros: true,
    reporteEnviado: false,
  });

  if (prospectosConfianza >= 5) {
    // ✅ RESPONDER INMEDIATAMENTE AL CLIENTE
    res.status(201).json({
      success: true,
      message: `¡Tu registro fue exitoso! Tu número de proceso es ${nuevoProspecto.numeroRifa}. Conserva este número para reclamar tu premio en caso de resultar ganador/a. Te deseamos mucha suerte en la rifa.`,
      numeroRifa: nuevoProspecto.numeroRifa,
    });
    
    // ✅ PROCESAR REPORTE EN BACKGROUND (sin bloquear)
    setImmediate(async () => {
      try {
        const prospectos = await Prospecto.find({
          cumpleFiltros: true,
          reporteEnviado: false,
        })
          .sort({ createdAt: -1 })
          .limit(5)
          .lean();

        if (prospectos.length > 0) {
          await enviarReporteConfianza(prospectos);
          
          await Prospecto.updateMany(
            { _id: { $in: prospectos.map(p => p._id) } },
            { $set: { reporteEnviado: true } }
          );
          
          console.log(`[ProspectoController] Reporte enviado en background para ${prospectos.length} prospectos`);
        }
      } catch (error) {
        console.error('[ProspectoController] Error en background job:', error);
        // No afecta la respuesta al usuario
      }
    });
    
    return; // ✅ IMPORTANTE: Salir de la función
  }
}

// Si no hay 5+ prospectos, responder normalmente
res.status(201).json({
  success: true,
  message: `¡Tu registro fue exitoso! Tu número de proceso es ${nuevoProspecto.numeroRifa}. Conserva este número para reclamar tu premio en caso de resultar ganador/a. Te deseamos mucha suerte en la rifa.`,
  numeroRifa: nuevoProspecto.numeroRifa,
});
```

---

## Plan de Implementación

### Paso 1: Crear rama bugfix
```bash
git checkout develop
git pull origin develop
git checkout -b bugfix/BUG-001-registro-lento-reporte-confianza
```

### Paso 2: Modificar ProspectoController.js
- Mover lógica de envío de reporte a `setImmediate()`
- Responder al cliente antes de procesar el reporte
- Agregar logs detallados en el proceso background

### Paso 3: Probar
1. Registrar 4 prospectos normales (deben responder rápido)
2. Registrar el 5to prospecto de confianza
3. Verificar que:
   - ✅ La respuesta sea inmediata (< 500ms)
   - ✅ El número de rifa aparezca inmediatamente
   - ✅ El correo se envíe en background
   - ✅ Los prospectos se marquen como `reporteEnviado: true`

### Paso 4: Commit y push
```bash
git add backend/controllers/ProspectoController.js
git commit -m "fix(BUG-001): Procesar reporte de prospectos en background para mejorar performance"
git push origin bugfix/BUG-001-registro-lento-reporte-confianza
```

### Paso 5: Crear PR y merge a develop
- Crear PR en GitHub
- Esperar aprobación humana
- Merge a develop

---

## Estimación

- **Análisis:** 15 min (este documento)
- **Implementación:** 30 min
- **Testing:** 30 min
- **Documentación:** 15 min
- **Total:** ~1.5 horas

---

## Conclusión

**✅ RECOMENDADO: Implementar la solución**

El bug impacta la experiencia de usuario (3-8 segundos de espera), pero tiene bajo riesgo de implementación. La solución es simple, no requiere cambios en el frontend ni en la base de datos, y mejora significativamente la performance percibida del registro.

**Riesgo principal:** Si el proceso en background falla, el correo no se envía. Sin embargo:
- El sistema ya tiene reintentos (3 intentos)
- Se agregarán logs detallados para monitoreo
- El flag `reporteEnviado` previene envíos duplicados
- Si falla, se puede reenviar manualmente o en el próximo registro

**Próximo paso:** Esperar aprobación humana para proceder con la implementación.