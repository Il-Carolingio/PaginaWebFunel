# Evaluación: HU-005 - Reporte por correo de prospectos que cumplen filtro al 100%

**Fecha:** 2026-06-24  
**Evaluador:** Cline (asistente IA)  
**Estado de la HU:** Pendiente  

---

## 1. Resumen Ejecutivo

La HU-005 propone un nuevo módulo backend que consulta prospectos con `cumpleFiltros = true`, selecciona hasta 10 (los más recientes) y envía un correo con una tabla HTML al equipo de ventas. La implementación requiere crear 2 archivos nuevos, modificar 3 existentes e instalar una dependencia npm. El impacto es bajo sobre el código existente, pero introduce un nuevo servicio externo (SMTP) que requiere configuración cuidadosa. La HU está bien definida y es viable, aunque se identificaron algunos puntos de mejora en seguridad y logging.

---

## 2. Análisis de Riesgos

### 2.1 Riesgos Técnicos

| # | Riesgo | Impacto | Probabilidad | Descripción |
|---|--------|---------|-------------|-------------|
| R1 | **Credenciales SMTP expuestas en el repositorio** | **Alto** | Media | Si `.env` no está en `.gitignore` o se sube por error, las credenciales SMTP quedarían expuestas. Gmail requiere contraseñas de aplicación |
| R2 | **Fallo de conexión SMTP sin reintentos** | **Medio** | Alta | El servicio de correo puede fallar temporalmente. Sin reintentos, se perderán envíos y el usuario recibirá un error 500 sin saber si el problema es temporal |
| R3 | **Endpoint sin rate limiting** | **Medio** | Baja | Si alguien obtiene la API Key, podría hacer spam de correos. No hay límite de peticiones por tiempo |
| R4 | **Prospectos duplicados entre envíos** | **Bajo** | Alta | Si se ejecuta el reporte dos veces en el mismo día, los mismos prospectos aparecerán en ambos correos. No hay marca de "ya notificado" |
| R5 | **Formato de tabla HTML no responsive** | **Bajo** | Alta | La tabla con `border="1"` y estilos inline puede verse mal en clientes de correo móvil |

### 2.2 Riesgos de Negocio

| # | Riesgo | Impacto | Descripción |
|---|--------|---------|-------------|
| RN1 | **Prospectos no contactados a tiempo** | **Alto** | Si el reporte se envía y nadie lo revisa por días, los prospectos pueden enfriarse o ser contactados por la competencia |
| RN2 | **Dependencia de Gmail/terceros** | **Medio** | Si el servidor SMTP de Gmail cambia políticas o bloquea la cuenta, el sistema deja de funcionar hasta reconfigurar |
| RN3 | **Privacidad de datos** | **Alto** | El correo contiene datos personales (nombre, teléfono, nivel estudios, ingresos estimados). Si llega a la persona equivocada, se viola privacidad |

---

## 3. Deuda Técnica Identificada

| # | Tipo | Descripción | Impacto | Tiempo estimado |
|---|------|-------------|---------|-----------------|
| DT1 | **Diseño** | **Historial de envíos mínimo:** Se agrega campo `reporteEnviado` al modelo Prospecto en lugar de un modelo separado. Esto es más simple pero no permite saber cuándo ni cuántas veces se envió cada prospecto. Para un MVP inicial es aceptable | Medio | 0.5h |
| DT2 | **Diseño** | **Sin cola de reintentos:** El envío SMTP es síncrono. Si falla, se pierde la solicitud. Una cola con reintentos (ej. bull o bee-queue) sería más robusta | Medio | 3h |
| DT3 | **Código** | **Endpoint GET para acción de escritura:** Usar `GET` para enviar un correo viola el principio REST. Debería ser `POST` | Bajo | 0.25h |
| DT4 | **Seguridad** | **API Key en URL si se usa GET:** Si se mantiene GET, la API Key podría quedar en logs del servidor. Con POST va en headers | Medio | 0.25h |
| DT5 | **Pruebas** | **Sin pruebas para el servicio de email:** No se mencionan tests. El servicio SMTP es difícil de testear sin mocking | Alto | 2.5h |
| DT6 | **Código** | **Falta de sanitización de datos:** Los nombres podrían contener caracteres especiales que rompan la tabla HTML (inyección HTML) | Medio | 0.5h |
| DT7 | **Documentación** | **Sin instrucciones de configuración SMTP:** No hay docs sobre cómo generar contraseña de aplicación en Gmail | Bajo | 0.5h |

---

## 4. Desglose de Tareas

| # | Tarea | Dependencias | Esfuerzo (horas) | Prioridad |
|---|-------|-------------|------------------|-----------|
| 1 | Instalar `nodemailer` y actualizar `package.json` | Ninguna | 0.25h | Alta |
| 2 | Crear `backend/services/emailService.js` - Servicio de envío con Nodemailer (conexión SMTP, generación de tabla HTML, sanitización de datos) | Ninguna | 2h | Alta |
| 3 | Crear `backend/controllers/ReporteConfianzaController.js` - Consulta de prospectos, validación de API Key, invocación del servicio de email | Tarea 2 | 1.5h | Alta |
| 4 | Modificar `backend/server.js` - Agregar ruta `POST /api/rifa/reporte-confianza/enviar` con middleware de autenticación | Tarea 3 | 0.5h | Alta |
| 5 | Modificar `backend/.env` - Agregar variables SMTP + REPORTE_API_KEY | Ninguna | 0.25h | Alta |
| 6 | **Mejora:** Agregar campo `reporteEnviado` al modelo Prospecto.js (Boolean, default: false) | Ninguna | 0.5h | Alta |
| 7 | **Mejora:** Modificar consulta en controlador para filtrar `reporteEnviado: false` y actualizar a `true` después del envío | Tarea 6 | 0.5h | Alta |
| 8 | **Mejora:** Agregar rate limiting al endpoint (express-rate-limit) | Tarea 4 | 0.5h | Media |
| 9 | Escribir pruebas unitarias para `emailService.js` con mocking de Nodemailer | Tarea 2 | 1.5h | Alta |
| 10 | Escribir pruebas de integración para el endpoint completo | Tareas 3,4,9 | 1h | Alta |
| 11 | Agregar sanitización de datos para tabla HTML (escapar caracteres especiales) | Tarea 2 | 0.5h | Media |
| 12 | Documentar configuración SMTP en README del backend | Ninguna | 0.5h | Baja |

**Total estimado (mínimo funcional):** **4.5 horas** (tareas 1-5)  
**Total estimado (completo con mejoras):** **11 horas** / ~2 días hábiles

---

## 5. Archivos Afectados

| Archivo | Acción | Cambio requerido |
|---------|--------|-----------------|
| `backend/services/emailService.js` | ✅ **Nuevo** | Servicio de envío SMTP con Nodemailer, generación de tabla HTML, sanitización |
| `backend/controllers/ReporteConfianzaController.js` | ✅ **Nuevo** | Controlador con consulta MongoDB, validación API Key, invocación emailService |
| `backend/server.js` | ✏️ **Modificar** | Agregar import y ruta `POST /api/rifa/reporte-confianza/enviar` |
| `backend/.env` | ✏️ **Modificar** | Agregar: SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS, EMAIL_TO, EMAIL_FROM, REPORTE_API_KEY |
| `backend/package.json` | ✏️ **Modificar** | Agregar dependencia `nodemailer` |
| `backend/models/Prospecto.js` | ✏️ **Modificar** | Agregar campo `reporteEnviado: { type: Boolean, default: false }` |

---

## 6. Recomendaciones

1. **Usar `POST` en lugar de `GET`** para el endpoint. El envío de correo es una acción con efectos secundarios, no una consulta. Además, la API Key se envía más segura en headers.

2. **Agregar campo `reporteEnviado` al modelo Prospecto** (Boolean, default: false). Esto permite:
   - Filtrar prospectos que aún no han sido reportados (`reporteEnviado: false`)
   - Marcar como `true` después de cada envío para evitar duplicados
   - Mantener la solución simple sin crear un modelo adicional
   - Como mejora futura, se podría agregar un campo `ultimoEnvio` (Date) para saber cuándo fue notificado cada prospecto

3. **Implementar reintentos con backoff:** Si el SMTP falla, reintentar 2-3 veces con espera exponencial (5s, 15s, 30s) antes de devolver error.

4. **Sanitizar datos para HTML:** Usar una función que escape `<`, `>`, `&`, `"` en nombres y otros campos antes de insertarlos en la tabla HTML para evitar inyección.

5. **Proteger con rate limiting:** Usar `express-rate-limit` para permitir máximo 1 envío cada 30 minutos por API Key.

6. **Agregar `.env.example`** en el backend con todas las variables documentadas para facilitar la configuración a nuevos desarrolladores.

7. **Considerar enviar el reporte en segundo plano:** Que el endpoint responda inmediatamente `{ success: true, message: "Envío iniciado" }` y el correo se envíe de forma asíncrona, para no bloquear la respuesta HTTP.

---

## 7. Conclusión

**Veredicto: Viable con mejoras recomendadas**

La HU-005 está bien definida, es técnicamente viable y aporta valor directo al negocio al permitir que el equipo de ventas contacte rápidamente a los prospectos más calificados.

**Puntos fuertes de la HU:**
- Consulta clara y optimizada (índice en `cumpleFiltros` + `createdAt`)
- Separación de responsabilidades (controller + service)
- Seguridad básica con API Key
- Manejo de casos edge (sin prospectos, errores SMTP)

**Áreas de mejora identificadas:**
- Cambiar `GET` por `POST` (REST + seguridad)
- Agregar campo `reporteEnviado` al modelo Prospecto para evitar duplicados
- Implementar reintentos en envío SMTP
- Agregar rate limiting
- Incluir sanitización de datos para tabla HTML

**Esfuerzo estimado:**
- **Mínimo funcional:** 4.5 horas (implementación básica)
- **Con mejoras recomendadas:** 11 horas (~2 días hábiles)
- **Con pruebas incluidas:** +2.5 horas adicionales

Se recomienda implementar las mejoras de seguridad (POST, rate limiting, sanitización) desde la versión inicial, ya que son de bajo esfuerzo y alto impacto. El modelo de historial de envíos puede dejarse para una segunda iteración.