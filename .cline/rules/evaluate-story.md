# Reglas para Evaluación de Historias de Usuario

## Propósito
Generar reportes técnicos detallados al ejecutar el comando `evaluar-HU-XXX`, analizando el impacto, deuda técnica y esfuerzo estimado de una Historia de Usuario.

## Flujo de ejecución

1. Validar que la HU existe en `docs/user-stories/backlog/HU-XXX-*.md`
2. Leer el contenido de la HU y los archivos del proyecto relacionados
3. Generar un reporte en `docs/user-stories/evaluations/HU-XXX-*-eval.md`

## Estructura del reporte de evaluación

```markdown
# Evaluación: HU-XXX - [Título]

**Fecha:** YYYY-MM-DD  
**Evaluador:** Cline (asistente IA)  
**Estado de la HU:** [Pendiente | En Progreso | Completada]

---

## 1. Resumen Ejecutivo

Breve descripción del impacto general de la HU.

## 2. Análisis de Riesgos

### 2.1 Riesgos Técnicos
- [Riesgo 1] - [Impacto: Alto/Medio/Bajo]
- [Riesgo 2] - [Impacto: Alto/Medio/Bajo]

### 2.2 Riesgos de Negocio
- [Riesgo 1] - [Impacto: Alto/Medio/Bajo]

## 3. Deuda Técnica Identificada

| # | Tipo | Descripción | Impacto | Tiempo estimado |
|---|------|-------------|---------|-----------------|
| 1 | [Código/Diseño/Pruebas] | ... | [Alto/Medio/Bajo] | [Xh] |
| 2 | ... | ... | ... | ... |

## 4. Desglose de Tareas

| # | Tarea | Dependencias | Esfuerzo (horas) | Prioridad |
|---|-------|-------------|------------------|-----------|
| 1 | [Tarea 1] | Ninguna | Xh | Alta |
| 2 | [Tarea 2] | Tarea 1 | Xh | Media |

**Total estimado:** [X] horas / [Y] días hábiles

## 5. Archivos Afectados

- [ruta/archivo.js] - [Cambio requerido]
- [ruta/archivo2.jsx] - [Cambio requerido]

## 6. Recomendaciones

- [Recomendación 1]
- [Recomendación 2]

## 7. Conclusión

[Veredicto final: viable / requiere ajustes / no recomendado]
```

## Criterios de evaluación

- **Riesgo Alto:** Puede romper funcionalidad existente o requiere cambios arquitectónicos
- **Riesgo Medio:** Afecta componentes compartidos pero tiene soluciones claras
- **Riesgo Bajo:** Cambio aislado y bien definido

## Deuda técnica - Clasificación

- **Código:** Código existente con malas prácticas, duplicación, falta de optimización
- **Diseño:** Problemas de arquitectura o acoplamiento
- **Pruebas:** Falta de cobertura o pruebas frágiles
- **Documentación:** Falta de documentación técnica