# Reglas para User Stories (Historias de Usuario)

## Propósito
Estandarizar la creación y documentación de Historias de Usuario en el proyecto Royal Prestige.

## 📋 Instrucciones Generales
Cuando un usuario dice "recibeHU" seguido de una historia simple, debes:

1. **Analizar la historia**: Identificar el usuario, acción y beneficio
2. **Expandir los criterios de aceptación**: Crear una lista detallada
3. **Identificar requisitos técnicos**: Frontend, backend, base de datos
4. **Generar el archivo**: Usar la plantilla estándar
5. **Actualizar el índice**: Añadir la nueva historia al listado

## Estructura obligatoria

Toda HU debe contener:

1. **Encabezado:** `# HU-XXX: Título descriptivo`
2. **Metadatos:** Estado, Prioridad, Sprint
3. **Descripción:** Formato "Como... Quiero... Para..."
4. **Criterios de Aceptación:** Lista de verificación
5. **Notas Técnicas:** Detalles de implementación
6. **Dependencias:** Referencias a otras HU si aplica

## 🎯 Formato de Entrada

recibeHU: Como [usuario], quiero [acción] para [beneficio]

## Nomenclatura de archivos

```
HU-XXX-descripcion-corta.md
```

Ejemplo: `HU-001-sincronizar-carrusel.md`

## Ubicación

- Backlog: `docs/user-stories/backlog/`
- Plantilla: `docs/user-stories/templates/story-template.md`

## Flujo de trabajo

1. Crear HU en `backlog/` usando la plantilla
2. Mover a "En Progreso" cuando se comienza a trabajar
3. Marcar como "Completada" cuando los criterios de aceptación se cumplen
4. Actualizar `docs/user-stories/index.md` con el estado actual

## Evaluación de HU

Al ejecutar el comando `evaluar-HU-XXX`, Cline:

1. Lee la HU desde `docs/user-stories/backlog/HU-XXX-*.md`
2. Analiza los archivos del proyecto relacionados
3. Genera un reporte de evaluación en `docs/user-stories/evaluations/HU-XXX-*-eval.md`
4. El reporte incluye: riesgos, deuda técnica, desglose de tareas con tiempos, archivos afectados y recomendaciones

## Archivos relacionados

- Reglas de evaluación: `.cline/rules/evaluate-story.md`
- Evaluaciones generadas: `docs/user-stories/evaluations/`
- HU archivadas: `docs/user-stories/archive/`

## Validación automática

Cline verificará que cualquier HU nueva:
- [ ] Siga la plantilla establecida
- [ ] Tenga criterios de aceptación medibles
- [ ] Esté registrada en el `index.md`


## 📝 Formato de Salida
Crear un archivo en `docs/user-stories/backlog/HU-XXX-titulo.md` con:
- ID auto-generado (HU-001, HU-002, ...)
- Fecha actual
- Prioridad (preguntar si no se especifica)
- Todos los campos de la plantilla completados
- Criterios de aceptación detallados
- Requisitos técnicos específicos

## 🔄 Actualización del Índice
Después de crear una historia, actualizar `docs/user-stories/index.md`:
- Incrementar el contador de historias
- Añadir la nueva historia a la tabla
- Actualizar estadísticas de prioridad

## 🏷️ Convenciones de Nombres
- Archivos: `HU-XXX-titulo-corto.md`
- Títulos: Primera letra mayúscula
- IDs: Numéricos secuenciales

## 📊 Prioridades Sugeridas
- **Alta**: Funcionalidad crítica, bloquea otras historias
- **Media**: Funcionalidad importante, mejora significativa
- **Baja**: Mejoras, optimizaciones, nice-to-have