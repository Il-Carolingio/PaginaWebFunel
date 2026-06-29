# 📊 Comando: evaluarHU-XXX

## Propósito
Recibir una nueva Historia de Usuario, evaluarla, estimar tiempos/esfuerzos y documentarla.
**NO ejecuta implementación**, solo prepara la HU para ser aprobada.

## Flujo

```
PASO 1: Recibir descripción de la HU
   → El humano describe la funcionalidad deseada
   → Ej: "recibeHU-007: como usuario quiero registrarme para unirme al equipo de ventas"

PASO 2: Hacer preguntas de clarificación (si es necesario)
   → ¿Qué campos debe tener el formulario?
   → ¿Qué validaciones son necesarias?
   → ¿Hay dependencias con otras HUs?
   → ¿Prioridad: Alta/Media/Baja?

PASO 3: Estimar esfuerzo y tiempo
   → Preguntar al humano o estimar basado en complejidad:

   | Complejidad | Esfuerzo (horas) | Tiempo (días) |
   |-------------|------------------|---------------|
   | Baja        | 2-4h             | 0.5-1 día     |
   | Media       | 4-8h             | 1-2 días      |
   | Alta        | 8-16h            | 2-4 días      |

   Para HU-007 (formulario de reclutamiento):
   - Complejidad: Media
   - Esfuerzo estimado: 6 horas
   - Tiempo estimado: 1.5 días

PASO 4: Crear documento de HU
   → Crear docs/user-stories/backlog/HU-XXX-descripcion.md
   → Incluir:
       - Título
       - Descripción (Como/Quiero/Para)
       - Criterios de aceptación
       - Notas técnicas
       - Dependencias
       - Esfuerzo estimado
       - Tiempo estimado
       - Prioridad
       - Estado: Pendiente de aprobación

PASO 5: Presentar resumen al humano
   → Mostrar la HU completa con estimaciones
   → Preguntar: ¿Aprobar HU-XXX para implementar?

PASO 6: Esperar aprobación
   → Si humano aprueba → cambiar estado a "Pendiente"
   → Si humano rechaza → ajustar y volver a PASO 4
```

## Formato del Documento de HU

```markdown
# HU-XXX: [Título]

**Estado:** Pendiente de aprobación
**Prioridad:** [Alta/Media/Baja]
**Esfuerzo estimado:** [N] horas
**Tiempo estimado:** [N] días
**Sprint:** [Pendiente de asignar]

---

## Descripción
> **Como** [tipo de usuario],
> **Quiero** [acción],
> **Para** [beneficio].

## Criterios de Aceptación
- [ ] Criterio 1
- [ ] Criterio 2

## Notas Técnicas
- [Notas]

## Dependencias
- [Otras HUs]

## Estimación
- **Complejidad:** [Baja/Media/Alta]
- **Esfuerzo:** [N] horas
- **Tiempo:** [N] días
```

## Reglas

1. **NO crear rama Git** - Solo documentar
2. **NO implementar código** - Solo planificar
3. **NO hacer commits** - Solo documentar
4. **Sí estimar tiempos** - Preguntar o calcular
5. **Sí esperar aprobación** - El humano debe aprobar antes de continuar

## Comando de Aprobación

Una vez aprobada la HU, el humano ejecuta:
```
iniciarSprint-HU-XXX
```

Este comando SÍ ejecuta la implementación completa (ver `commands/sprint.md`).