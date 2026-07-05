# Bug: Visualización del Catálogo PDF

## Reporte
- **Fecha:** 2026-07-05
- **Reportado por:** Usuario
- **Severidad:** Media

## Descripción
El catálogo no se muestra correctamente. Al navegar a `/catalogo`, se muestra una subpágina de la misma página con el navbar dentro, en lugar del PDF embebido.

## Pasos para reproducir
1. Navegar a http://localhost:3000/catalogo
2. Observar que no se muestra el PDF del catálogo
3. En su lugar, se muestra contenido inesperado

## Comportamiento esperado
- El PDF del catálogo se muestra embebido en la página
- Se puede navegar por las páginas del PDF
- Hay un botón de descarga visible

## Comportamiento actual
- No se muestra el PDF
- Se muestra contenido inesperado

## Diagnóstico
- **PDF faltante:** El archivo `frontend/public/catalogo/Novel Catalog_DIGITAL.pdf` no existía
- **URL incorrecta:** El iframe intentaba cargar un archivo que no existía

## Solución Aplicada
- Crear directorio `frontend/public/catalogo/`
- Agregar PDF de ejemplo del catálogo
- Agregar botón de descarga del PDF
- Simplificar URL del iframe (remover parámetros que podrían causar problemas)

## Estado
- **Rama:** bugfix/HU-009-catalogo-pdf
- **Commit:** 2429bab
- **Pull Request:** https://github.com/Il-Carolingio/PaginaWebFunel/pull/2
- **Estado PR:** Abierto, pendiente de revisión

## Solución aplicada
✅ Corregido - PDF creado y botón de descarga agregado