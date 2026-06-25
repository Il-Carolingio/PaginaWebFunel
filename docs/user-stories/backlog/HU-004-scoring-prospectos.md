# HU-004: Sistema de scoring y filtrado de prospectos

**Estado:** Completada  
**Prioridad:** Alta  
**Sprint:** 1

## Descripción

> **Como** administrador del sistema de Royal Prestige,  
> **Quiero** que el backend evalúe automáticamente a los prospectos según reglas de negocio,  
> **Para** filtrar y priorizar los registros más valiosos para el equipo de ventas.

## Criterios de Aceptación

- [x] Se evalúan 3 reglas: estado civil casado, ingreso estimado >= $25,000, le gusta cocinar
- [x] Si cumple las 3 reglas → status "Genial" y cumpleFiltros = true
- [x] Si cumple 2 reglas → se registra pero con status "No ideal: cumple 2 de 3 filtros"
- [x] Si cumple menos de 2 reglas → se rechaza el registro con error 400
- [x] El ingreso estimado se calcula según nivel de estudios * multiplicador de marca preferida
- [x] El campo `estadoProspecto` permite seguimiento CRM (nuevo, contactado, cita_agendada, etc.)

## Notas Técnicas

- Lógica duplicada entre `ProspectoController.js` y el middleware `pre('save')` del modelo
- Multiplicadores de marca: royal_prestige (1.30), t_fal/oster (1.15), tupperware (1.10), other/none (1.00)
- Niveles de estudio con ingresos base desde $10,000 (primaria) hasta $52,500 (posgrado)

## Dependencias

- [HU-003] - Endpoint de registro en backend

## Historial de Cambios

| Fecha | Cambio |
|-------|--------|
| 2026-06-24 | Creación de la HU |