# HU-015: Cambiar estado de tarea a completada

## Descripción
Como vendedor en el CRM, quiero poder cambiar el estatus de una tarea a completada para poder saber si este prospecto se puede convertir en un cliente o se le podrá ofrecer después comprar.

## Criterios de Aceptación
- [x] El vendedor puede ver el estado actual de cada tarea
- [x] Existe una acción para cambiar el estado de la tarea
- [x] Al marcar como completada, la tarea cambia de estado
- [x] El cambio se refleja en el listado de tareas
- [x] Los contadores se actualizan automáticamente
- [x] La fecha de completado queda registrada

## Notas Técnicas
- Se agregó campo `fechaCompletado` al modelo Tarea
- Backend: actualización de estado con registro de fecha automática en TareaController
- Frontend: selector de estado con opción completada y botón rápido para marcar

## Sprint
Sprint 1

## Estado
✅ Completada