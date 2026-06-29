# Bug: HU-001 - Imágenes de baja calidad y rutas incorrectas en Home

**Tipo:** Bugfix
**Prioridad:** Media
**Estado:** Verificado
**Fecha de reporte:** 2026-06-29

---

## 🐛 Descripción del Bug

**Comportamiento actual:**
1. La sección "Cocina Profesional" usa una imagen de Unsplash de baja calidad en lugar de la imagen local `CocinaProfesional.png`
2. El componente Image tiene props inválidas (`high`, `textColor`, `bgImage`) que no funcionan
3. Las imágenes en "Productos Destacados" usan rutas `../../public/homeImages/...` que no funcionan en Vite (debe ser `/homeImages/...`)

**Comportamiento esperado:**
1. La sección "Cocina Profesional" debe mostrar la imagen local `CocinaProfesional.png` con alta calidad
2. Las props del Image deben ser válidas
3. Las imágenes de productos deben cargarse correctamente usando rutas absolutas de Vite (`/homeImages/...`)

## 🔍 Contexto Técnico

**HU afectada:** HU-001 - Home Page  
**Archivos involucrados:**
- `frontend/src/pages/Home.jsx`

## ✅ Criterios de Aceptación

- [ ] La sección "Cocina Profesional" muestra la imagen local de alta calidad
- [ ] Las imágenes de productos destacados se cargan correctamente
- [ ] El home se ve correctamente sin imágenes rotas