# HU-001: Sincronizar carrusel de productos con Hero Section

**Estado:** Completada  
**Prioridad:** Alta  
**Sprint:** 1

## Descripción

> **Como** usuario visitante de la página principal,  
> **Quiero** que el carrusel de productos esté sincronizado con el Hero Section,  
> **Para** tener una experiencia visual coherente y atractiva al navegar.

## Criterios de Aceptación

- [x] El carrusel de productos cambia automáticamente al mismo ritmo que el Hero
- [x] Al hacer clic en los indicadores del Hero, el carrusel se actualiza al producto correspondiente
- [x] Las transiciones entre slides son suaves con crossfade
- [x] El carrusel muestra correctamente videos e imágenes

## Notas Técnicas

- Implementado en `frontend/src/pages/Home.jsx`
- El componente `Carousel` recibe `currentIndex` y `onIndexChange` como props
- Se usa `framer-motion` con `AnimatePresence` para las animaciones de transición
- El Hero maneja 4 slides: 2 videos (heroVideoMp4, ollaNovelMp4) y 2 imágenes (novelImg, easyReleaseImg)

## Dependencias

- Ninguna

## Historial de Cambios

| Fecha | Cambio |
|-------|--------|
| 2026-06-24 | Creación de la HU |