# Bug: Botón guardar tarea no responde

## Reporte
- **Fecha:** 2026-07-02
- **Reportado por:** Usuario
- **Severidad:** Alta
- **Estado:** Pendiente de diagnóstico

## Descripción
Al intentar crear una nueva tarea desde el CRM, el botón "Guardar" no responde. No se envía el formulario ni se muestra ningún mensaje de error.

## Pasos para reproducir
1. Iniciar sesión como vendedor
2. Navegar a la pestaña "Mis Tareas"
3. Hacer clic en "Nueva Tarea"
4. Llenar el formulario
5. Hacer clic en "Guardar"

## Comportamiento esperado
- La tarea se crea exitosamente
- Se muestra mensaje de éxito
- El modal se cierra
- La lista de tareas se actualiza

## Comportamiento actual
- El modal permanece abierto
- No se muestra ningún mensaje
- No se crea la tarea
- No hay logs en consola del navegador

## Hipótesis
1. El evento onSubmit del formulario no se está disparando
2. El botón no tiene type="submit"
3. Hay un error de JavaScript previo al submit
4. El modal impide el submit del formulario

## Diagnóstico necesario
- [ ] Revisar consola del navegador para errores
- [ ] Verificar si el evento onSubmit se dispara
- [ ] Verificar la estructura del formulario en el modal
- [ ] Probar submit directo sin validaciones