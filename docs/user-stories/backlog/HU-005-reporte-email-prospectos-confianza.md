# HU-005: Reporte por correo de prospectos que cumplen filtro al 100%

**Estado:** Pendiente  
**Prioridad:** Alta  
**Sprint:** 2

## Descripción

> **Como** sistema (backend),  
> **Quiero** consultar los registros que cumplan al 100% el filtro del funnel, tomar hasta 10 de ellos y enviar un correo con una tabla HTML que los liste,  
> **Para** que el equipo de ventas pueda llamar a estos prospectos confiables, agendarles una demostración y llevarles el regalo de Royal Prestige.

## Criterios de Aceptación

- [ ] El sistema consulta prospectos donde `cumpleFiltros = true` (casado, ingreso >= $25,000, le gusta cocinar)
- [ ] La consulta selecciona hasta 10 prospectos, priorizando los más recientes (`createdAt` descendente)
- [ ] Se genera un correo electrónico con una tabla HTML que incluya: nombre, teléfono, nivel de estudios, ingreso estimado, rango de ingreso, estado civil, marcas preferidas y fecha de registro
- [ ] El correo se envía a una o más direcciones configuradas (desde variable de entorno)
- [ ] El envío puede ejecutarse manualmente mediante un endpoint API protegido o un comando programado (cron)
- [ ] Se registra en un log la fecha/hora del último envío y la cantidad de prospectos incluidos
- [ ] Si no hay prospectos que cumplan el filtro, se envía un correo notificando que no hay prospectos disponibles
- [ ] El sistema maneja errores de conexión SMTP sin interrumpir el servidor

## Notas Técnicas

### Backend - Nuevo endpoint
- **Ruta sugerida:** `GET /api/rifa/reporte-confianza/enviar`
- **Controlador:** Nuevo archivo `backend/controllers/ReporteConfianzaController.js`
- **Query:** `Prospecto.find({ cumpleFiltros: true }).sort({ createdAt: -1 }).limit(10)`
- **Respuesta:** JSON con `{ success: true, message: "...", enviados: N, destinatarios: [...] }`

### Dependencia nueva
- **Nodemailer** (`npm install nodemailer`) para envío de correos SMTP
- Configuración SMTP en variables de entorno:
  ```
  SMTP_HOST=smtp.gmail.com
  SMTP_PORT=587
  SMTP_USER=tu-correo@gmail.com
  SMTP_PASS=tu-contraseña-de-aplicacion
  EMAIL_TO=ventas@royalprestige.com,gerente@royalprestige.com
  EMAIL_FROM=noreply@royalprestige.com
  ```

### Formato de tabla HTML
```html
<table border="1" cellpadding="8" cellspacing="0" style="border-collapse:collapse; width:100%; font-family:Arial;">
  <thead style="background:#2B6CB0; color:white;">
    <tr>
      <th>#</th>
      <th>Nombre</th>
      <th>Teléfono</th>
      <th>Estado Civil</th>
      <th>Nivel Estudios</th>
      <th>Ingreso Estimado</th>
      <th>Rango Ingreso</th>
      <th>Marcas Prefiere</th>
      <th>Registrado</th>
    </tr>
  </thead>
  <tbody>
    <!-- Filas con datos de cada prospecto -->
  </tbody>
</table>
```

### Modificación en el modelo Prospecto

Se agregará un nuevo campo booleano `reporteEnviado` al esquema de Prospecto para marcar si ya fue incluido en un reporte:

```javascript
reporteEnviado: {
  type: Boolean,
  default: false,
}
```

La consulta en el controlador filtrará además por `reporteEnviado: false` y, después de enviar el correo, actualizará los prospectos seleccionados marcando `reporteEnviado: true`.

### Archivos a crear/modificar

| Archivo | Acción |
|---------|--------|
| `backend/controllers/ReporteConfianzaController.js` | ✅ Crear - Lógica de consulta y envío de correo |
| `backend/services/emailService.js` | ✅ Crear - Servicio de envío de correos con Nodemailer |
| `backend/models/Prospecto.js` | ✏️ Modificar - Agregar campo `reporteEnviado: Boolean` |
| `backend/server.js` | ✏️ Modificar - Agregar nueva ruta e importar controlador |
| `backend/.env` | ✏️ Modificar - Agregar variables SMTP |
| `backend/package.json` | ✏️ Modificar - Agregar dependencia `nodemailer` |

### Seguridad
- El endpoint debe validar una API key o token simple para evitar uso no autorizado
- Sugerencia: `Authorization: Bearer <API_KEY>` con la clave en variable de entorno `REPORTE_API_KEY`

## Dependencias

- [HU-004] - Sistema de scoring de prospectos (provee el campo `cumpleFiltros`)

## Historial de Cambios

| Fecha | Cambio |
|-------|--------|
| 2026-06-24 | Creación de la HU |