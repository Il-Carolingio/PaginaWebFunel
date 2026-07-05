# Bug: Error de conexión en formulario de reclutamiento

## Reporte
- **Fecha:** 2026-07-04
- **Reportado por:** Usuario
- **Severidad:** Alta
- **Estado:** Pendiente de diagnóstico
- **HU Relacionada:** HU-017

## Descripción
Al intentar registrarse en "Únete al equipo", el formulario muestra error de conexión. No se puede enviar el registro.

## Pasos para reproducir
1. Navegar a http://localhost:3000/reclutamiento
2. Llenar el formulario de reclutamiento
3. Hacer clic en "Enviar Registro"
4. Observar error de conexión

## Comportamiento esperado
- El formulario se envía exitosamente
- Se muestra mensaje de éxito
- El registro se guarda en la base de datos

## Comportamiento actual
- Muestra error: "Error de conexión. Por favor intenta de nuevo más tarde."
- En consola del navegador se muestra:
  ```
  XHR POST http://localhost:3000/api/reclutamiento/registro
  [HTTP/1.1 404 Not Found 4209ms]
  Error: SyntaxError: JSON.parse: unexpected character at line 1 column 1 of the JSON data
  ```

## Diagnóstico
- **URL incorrecta:** El frontend está apuntando a `http://localhost:3000/api/reclutamiento/registro`
- **Puerto incorrecto:** El backend corre en puerto 5000, no 3000
- **Resultado:** 404 Not Found porque no existe el endpoint en ese puerto

## Hipótesis
1. El archivo de configuración de API tiene el puerto incorrecto (3000 en lugar de 5000)
2. El servicio de reclutamiento en el frontend usa la URL base incorrecta

## Archivos a revisar
- `frontend/src/services/api.js` - Configuración de URL base
- `frontend/src/pages/Reclutamiento.jsx` - Llamada al endpoint
- `backend/server.js` - Verificar puerto del servidor

## Solución propuesta
Corregir la configuración de la URL base en el frontend para apuntar al puerto correcto (5000).