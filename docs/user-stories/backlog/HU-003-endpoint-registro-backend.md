# HU-003: Endpoint de registro de prospectos en backend

**Estado:** Completada  
**Prioridad:** Alta  
**Sprint:** 1

## Descripción

> **Como** administrador del sistema,  
> **Quiero** contar con un endpoint API que registre prospectos de la rifa,  
> **Para** almacenar sus datos en MongoDB y generar números de proceso únicos.

## Criterios de Aceptación

- [x] Endpoint `POST /api/rifa/registro-olla-sarten-salud` recibe y valida datos del prospecto
- [x] Genera número de rifa único de 8 dígitos
- [x] Calcula ingreso estimado basado en nivel de estudios + marcas preferidas
- [x] Evalúa 3 reglas de negocio (casado, ingreso >= $25k, gusta cocinar)
- [x] Rechaza registro si cumple menos de 2 reglas
- [x] Verifica que el teléfono no esté duplicado
- [x] Devuelve número de proceso al frontend

## Notas Técnicas

- Implementado en `backend/controllers/ProspectoController.js`
- Modelo Mongoose en `backend/models/Prospecto.js` con middleware `pre('save')`
- Usa `express` + `mongoose` + `cors`
- Configuración de BD en `backend/config/db.js`

## Dependencias

- Ninguna

## Historial de Cambios

| Fecha | Cambio |
|-------|--------|
| 2026-06-24 | Creación de la HU |