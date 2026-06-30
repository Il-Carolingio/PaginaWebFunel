# HU-009: Visualizador de Catálogo PDF

**Estado:** ✅ Aprobada
**Prioridad:** Media
**Sprint:** 4
**Esfuerzo estimado:** 2 horas
**Tiempo estimado:** 0.5 días
**Sprint Inicio:** 2026-06-30
**Sprint Fin:** 2026-07-14

---

## Descripción

> **Como** usuario convencional,
> **Quiero** ver un catálogo en el apartado "Catálogo" que muestre un PDF embebido como HTML,
> **Para** poder ver con claridad y facilidad los productos disponibles.

---

## Criterios de Aceptación

- [ ] La página `/catalogo` muestra el PDF del catálogo embebido en la página
- [ ] El PDF se renderiza como HTML (no redirige a una descarga)
- [ ] Se puede navegar por las páginas del PDF dentro de la página web
- [ ] Botón de descarga visible para descargar el PDF
- [ ] El diseño es responsivo (funciona en móvil, tablet y desktop)
- [ ] Se ve como si fuera parte de la propia página (integración visual)
- [ ] Se agrega un boton para realizar la descarga en pdf

---

## Notas Técnicas

- **PDF existente:** `frontend/public/catalogo/Novel Catalog_DIGITAL.pdf`
- **Ruta:** `/catalogo` (ya existe la ruta en App.jsx)
- **Página a modificar:** `frontend/src/pages/Catalogo.jsx`
- **Visualizador:** Usar `<iframe>` con el visor nativo de PDF del navegador
- **Parámetros:** Agregar `#view=FitH` o `#toolbar=1` al src para mejor experiencia
- **Descarga:** Botón con `href` directo al PDF para descarga
- **Responsive:** El iframe debe adaptarse al 100% del ancho con altura responsive

---

## Dependencias

- Ninguna. Es una página independiente.

---

## Estimación

- **Complejidad:** Baja
- **Esfuerzo:** 2 horas
- **Tiempo:** 0.5 días

**Desglose:**
- Modificar Catalogo.jsx para mostrar PDF: 1h
- Agregar botón de descarga: 0.5h
- Testing responsive: 0.5h