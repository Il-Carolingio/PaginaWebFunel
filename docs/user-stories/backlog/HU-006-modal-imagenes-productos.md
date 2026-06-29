# HU-006: Modal de ampliación de imágenes en Productos Destacados

**Estado:** Pendiente
**Prioridad:** Media
**Sprint:** 3

---

## Descripción

> **Como** usuario final,
> **Quiero** hacer clic sobre cualquier imagen en la sección "Productos Destacados" y que se abra completamente,
> **Para** poder ver los detalles del producto en una vista ampliada.

---

## Criterios de Aceptación

- [ ] Al hacer clic en cualquier imagen de "Productos Destacados" se abre un modal/overlay
- [ ] El modal muestra la imagen en tamaño completo/grande
- [ ] El modal tiene un botón de cerrar (X) visible
- [ ] Al hacer clic fuera del modal o en el botón cerrar, se cierra
- [ ] La imagen se ve con buena calidad y sin distorsión
- [ ] El modal es responsive (funciona en móvil y desktop)

---

## Notas Técnicas

- Implementar en `frontend/src/pages/Home.jsx`
- Usar componentes de Chakra UI (`Modal`, `ModalOverlay`, `ModalContent`, `ModalCloseButton`)
- Estado local para controlar qué imagen está abierta
- Las imágenes ya están en `/homeImages/` (SartenesEasyRelease.png, Ollas-Presion-Lux.png, AccesoriosPremium.png)

---

## Dependencias

- HU-001 (Home page base) ✅ Completada