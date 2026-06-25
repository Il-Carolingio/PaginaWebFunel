# Evaluación: HU-001 - Sincronizar carrusel de productos con Hero Section

**Fecha:** 2026-06-24  
**Evaluador:** Cline (asistente IA)  
**Estado de la HU:** Completada  

---

## 1. Resumen Ejecutivo

La HU-001 implementó la sincronización entre el Hero Section y el carrusel de productos en la página principal (`Home.jsx`). El carrusel ahora recibe `currentIndex` y `onIndexChange` como props desde el Hero, permitiendo que ambos componentes compartan el mismo estado de navegación. La implementación es funcional y cumple los criterios de aceptación, pero se identificaron varios puntos de deuda técnica y riesgos que deben abordarse para garantizar la estabilidad a largo plazo.

---

## 2. Análisis de Riesgos

### 2.1 Riesgos Técnicos

| # | Riesgo | Impacto | Probabilidad | Descripción |
|---|--------|---------|-------------|-------------|
| R1 | Desincronización por diferencias en longitud de arrays | **Alto** | Media | El Hero tiene 4 slides, el carrusel tiene 4 productos. Si se agrega/elimina un slide del Hero sin actualizar el carrusel, el mapeo `heroIndex % 4` fallará |
| R2 | Fuga de memoria por intervalos no limpiados | **Medio** | Baja | El `useEffect` del Hero tiene `clearInterval` pero el de Carousel solo limpia si `externalIndex` cambia. En modo autónomo podría haber fugas si el componente se desmonta |
| R3 | Transiciones entrecortadas en dispositivos de baja capacidad | **Medio** | Alta | Se usan 2 `AnimatePresence` simultáneos (slide actual + siguiente) con videos de fondo, lo que puede saturar la GPU en móviles |
| R4 | Videos sin control de reproducción al cambiar de slide | **Medio** | Alta | Los videos continúan reproduciéndose en segundo plano aunque no sean visibles, consumiendo recursos innecesariamente |

### 2.2 Riesgos de Negocio

| # | Riesgo | Impacto | Descripción |
|---|--------|---------|-------------|
| RN1 | Experiencia móvil degradada | **Alto** | Usuarios en dispositivos móviles con conexiones lentas pueden experimentar lentitud al cargar múltiples videos simultáneamente |
| RN2 | Dependencia de imágenes externas (Unsplash) | **Medio** | Las imágenes de productos destacados usan URLs de Unsplash que podrían cambiar o dejar de estar disponibles |

---

## 3. Deuda Técnica Identificada

| # | Tipo | Descripción | Impacto | Tiempo estimado |
|---|------|-------------|---------|-----------------|
| DT1 | **Código** | **Acoplamiento frágil:** El carrusel usa `heroIndex % 4` (hardcoded) para sincronizarse. Si cambia la cantidad de slides del Hero, se rompe la sincronización | Alto | 1.5h |
| DT2 | **Código** | **Duplicación de lógica de transición:** El Hero tiene prácticamente el mismo bloque de código duplicado para slides de video y de imagen (líneas 116-250), lo que dificulta el mantenimiento | Alto | 2h |
| DT3 | **Código** | **Múltiples `AnimatePresence` anidados:** Se usan 2 `AnimatePresence` mode="wait" simultáneos (slide actual + slide siguiente), lo que puede causar comportamientos inesperados en framer-motion | Medio | 1h |
| DT4 | **Rendimiento** | **Videos sin pausa al cambiar:** Los videos no se detienen al salir de foco, consumiendo memoria y CPU | Medio | 1h |
| DT5 | **Código** | **Falta de lazy loading:** Las imágenes del carrusel y productos destacados no usan carga diferida | Bajo | 0.5h |
| DT6 | **Código** | **Variables sin usar:** `videoRefs` se declara pero no se utiliza para controlar reproducción de video | Bajo | 0.25h |
| DT7 | **Diseño** | **Fondo fijo con imagen local:** `multipan.png` se usa como fondo fijo con `pointerEvents: none`, lo que puede causar problemas de accesibilidad | Bajo | 0.5h |
| DT8 | **Pruebas** | **Sin pruebas unitarias:** No hay tests para el componente Carousel ni para la lógica de sincronización | Alto | 3h |

---

## 4. Desglose de Tareas

| # | Tarea | Dependencias | Esfuerzo (horas) | Prioridad |
|---|-------|-------------|------------------|-----------|
| 1 | Refactorizar lógica de transición del Hero para eliminar duplicación (unificar slides de video e imagen) | Ninguna | 2h | Alta |
| 2 | Crear un hook personalizado `useSyncSlides` que maneje la sincronización Hero-Carrusel sin acoplamiento hardcoded | Tarea 1 | 1.5h | Alta |
| 3 | Implementar pausa automática de videos cuando no están visibles (usando `IntersectionObserver`) | Ninguna | 1h | Media |
| 4 | Simplificar `AnimatePresence` a una sola instancia en lugar de dos simultáneas | Tarea 1 | 1h | Media |
| 5 | Agregar lazy loading (`loading="lazy"`) a todas las imágenes del Home y Carousel | Ninguna | 0.5h | Baja |
| 6 | Eliminar variable `videoRefs` no utilizada y limpiar imports | Ninguna | 0.25h | Baja |
| 7 | Escribir pruebas unitarias para Carousel (Jest + React Testing Library) | Ninguna | 2h | Alta |
| 8 | Escribir pruebas de integración para la sincronización Hero-Carrusel | Tarea 7 | 1h | Alta |
| 9 | Reemplazar imágenes de Unsplash por assets locales o agregar fallback | Ninguna | 0.5h | Media |
| 10 | Agregar manejo de error para videos que no cargan (fallback a imagen) | Ninguna | 0.5h | Media |

**Total estimado:** **10.25 horas** / ~1.5 días hábiles (considerando jornada de 6h efectivas)

---

## 5. Archivos Afectados

| Archivo | Cambio requerido | Impacto |
|---------|-----------------|---------|
| `frontend/src/pages/Home.jsx` | Refactorizar lógica de transiciones duplicadas, simplificar AnimatePresence, pausar videos, limpiar variables no usadas | Alto |
| `frontend/src/components/Carousel.jsx` | Desacoplar sincronización, agregar lazy loading, escribir tests | Alto |
| `frontend/src/hooks/useSyncSlides.js` | **Nuevo archivo:** Hook personalizado para manejar la sincronización Hero-Carrusel | Medio |
| `frontend/src/__tests__/Carousel.test.jsx` | **Nuevo archivo:** Pruebas unitarias del carrusel | Medio |
| `frontend/src/__tests__/Home.test.jsx` | **Nuevo archivo:** Pruebas de integración de la página principal | Medio |

---

## 6. Recomendaciones

1. **Prioridad inmediata:** Refactorizar la duplicación de lógica de transición en Home.jsx (DT2) y desacoplar la sincronización (DT1) — estas dos tareas representan el mayor riesgo de bugs futuros.
2. **No opcional:** Agregar pruebas unitarias (DT8) antes de cualquier cambio adicional en el carrusel o hero. Sin tests, cualquier modificación es un riesgo.
3. **Optimización de rendimiento:** Implementar pausa de videos (DT4) usando `IntersectionObserver` para mejorar la experiencia en móviles y reducir consumo de recursos.
4. **Estandarizar assets:** Migrar las imágenes de Unsplash a assets locales para eliminar dependencias externas.
5. **Monitoreo:** Agregar un indicador visual de que los videos se están cargando (spinner/skeleton) para mejorar la percepción de rendimiento.

---

## 7. Conclusión

**Veredicto: Funcional pero requiere refactorización**

La HU-001 cumple con todos los criterios de aceptación y la funcionalidad de sincronización opera correctamente. Sin embargo, la implementación actual tiene **deuda técnica significativa** (estimada en ~10 horas de trabajo) debido principalmente a:

- **Duplicación masiva de código** en las transiciones del Hero (~130 líneas duplicadas)
- **Acoplamiento frágil** entre Hero y Carousel
- **Ausencia total de pruebas**
- **Falta de optimización** en el manejo de videos

Se recomienda abordar la refactorización en un sprint dedicado antes de agregar nuevas funcionalidades a la página principal, ya que cualquier cambio futuro en el Hero o Carousel sin estas mejoras incrementará la deuda técnica y el riesgo de regresión.