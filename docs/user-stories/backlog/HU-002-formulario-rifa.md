# HU-002: Formulario de registro para la rifa

**Estado:** Completada  
**Prioridad:** Alta  
**Sprint:** 1

## Descripción

> **Como** visitante interesado en la rifa de Royal Prestige,  
> **Quiero** llenar un formulario con mis datos personales,  
> **Para** registrarme y obtener un número de proceso para participar.

## Criterios de Aceptación

- [x] El formulario solicita: nombre, teléfono, estado civil, nivel de estudios, marcas preferidas y si le gusta cocinar
- [x] La validación de campos se realiza con Yup (nombre obligatorio, teléfono 10 dígitos, etc.)
- [x] Se requiere seleccionar al menos una marca de utensilios
- [x] Al enviar, se muestra un toast de "sorpresa" con el número de proceso
- [x] Si el teléfono ya está registrado, se muestra un mensaje de error
- [x] El formulario se resetea después de un registro exitoso

## Notas Técnicas

- Implementado en `frontend/src/pages/Funnel.jsx`
- Validación con `react-hook-form` + `@hookform/resolvers/yup`
- Envío a `POST /api/rifa/registro-olla-sarten-salud`
- Backend con Express + MongoDB genera número de rifa único de 8 dígitos
- Backend valida reglas de negocio (scoring del prospecto) antes de guardar

## Dependencias

- [HU-003] - Crear endpoint de registro en backend

## Historial de Cambios

| Fecha | Cambio |
|-------|--------|
| 2026-06-24 | Creación de la HU |