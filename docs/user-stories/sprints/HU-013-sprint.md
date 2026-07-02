# Sprint Tracking - HU-013

## Metadatos
- **HU:** HU-013 - Evolucionar y administrar tareas de vendedor
- **Rama:** feature/HU-013-evolucionar-tareas
- **Sprint:** 4
- **Inicio:** 2026-07-01
- **Fin:** 2026-07-15

## Bitácora de Commits

| Fecha | Commit | Descripción |
|-------|--------|-------------|
| 2026-07-01 | `docs: add sprint tracking file for HU-013` | Archivo de tracking del sprint |
| 2026-07-01 | `feat: add entrevista and contrato types to Tarea model` | Nuevos tipos en el modelo |
| 2026-07-01 | `feat: add edit modal and task evolution in Crm.jsx` | Modal de edición y evolución de tareas |
| 2026-07-01 | `feat: order tasks by oldest pending first` | Ordenamiento de tareas pendientes |

## Guía de Pruebas

### Pruebas Funcionales
- [ ] 1. Iniciar sesión como vendedor
- [ ] 2. Ver lista de tareas ordenadas (más antiguas pendientes primero)
- [ ] 3. Hacer clic en "Editar" en una tarea existente
- [ ] 4. Verificar que el modal se abre con datos pre-cargados
- [ ] 5. Cambiar el tipo de tarea (ej: llamada → cita → evento → entrevista → contrato)
- [ ] 6. Cambiar fecha y hora usando el calendario
- [ ] 7. Cambiar descripción/comentarios
- [ ] 8. Cambiar estado a "cancelada"
- [ ] 9. Guardar cambios y verificar que se reflejan en la lista
- [ ] 10. Verificar que los nuevos tipos (entrevista, contrato) tienen colores distintivos

### Pruebas de Regresión
- [ ] 1. Crear una tarea nueva sigue funcionando
- [ ] 2. El login sigue funcionando
- [ ] 3. El perfil sigue funcionando
- [ ] 4. El cambio de contraseña sigue funcionando