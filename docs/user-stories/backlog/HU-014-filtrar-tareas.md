# HU-014: Filtrar listado de tareas por estado

## Descripción
Como usuario vendedor, quiero poder filtrar el listado de tareas haciendo clic en los contadores (Pendientes, Completadas, Canceladas, Total) para visualizar únicamente las tareas de ese estado y organizar mejor mi trabajo.

## Criterios de Aceptación
- [x] Existen 4 contadores: Pendientes, Completadas, Canceladas, Total
- [x] Al hacer clic en "Completadas" se muestran solo tareas completadas
- [x] Al hacer clic en "Pendientes" se muestran solo tareas pendientes
- [x] Al hacer clic en "Canceladas" se muestran solo tareas canceladas
- [x] Al hacer clic en "Total" se muestran todas las tareas
- [x] El orden actual de las tareas (pendientes más antiguas primero, luego por fecha descendente para las demás) se mantiene dentro de cada filtro
- [x] Los contadores reflejan cantidades reales del estado actual

## Notas Técnicas
- Se agrega estado `filtroEstado` en `Crm.jsx`
- Se genera `tareasFiltradas` con `useEffect` derivado de `tareas` + `filtroEstado`
- Los contadores ahora tienen `cursor="pointer"` y `onClick` para cambiar el filtro

## Sprint
Sprint pendiente

## Estado
✅ Implementada