# 🎯 Comando: comencemos

## Propósito
Iniciar una sesión de trabajo. Este es el comando principal del sistema.
Pregunta qué proyecto y qué tipo de tarea ejecutar.

## Flujo Completo

```
PASO 1: Bootstrap
   → Leer agentic-brain/core/bootstrap.md
   → Verificar estructura del cerebro
   → Detectar proyecto activo

PASO 2: Selección de Proyecto
   → Si hay proyecto activo:
        ¿Quieres trabajar en "PaginaWebFunel"? (S/N)
        S → continuar
        N → listar proyectos
   → Si no hay proyecto activo:
        Listar proyectos registrados
        Preguntar: ¿Cuál? (número, nombre, o "nuevo")
        
   Opciones especiales:
   - "nuevo" o "crear" → ejecutar new-project.md
   - "salir" o "cancelar" → terminar

PASO 3: Cargar Contexto
   → Leer projects/<proyecto>/context.md
   → Presentar resumen al humano

PASO 4: Selección de Tarea
   Preguntar: ¿Qué tipo de tarea quieres realizar?
   
   a) Evaluar HU (nueva funcionalidad - solo documentar)
      → Comando: evaluarHU-XXX
      → Docs: commands/evaluar-hu.md
      → Solo crea documento, NO implementa

   b) Iniciar Sprint (implementar HU aprobada)
      → Comando: iniciarSprint-HU-XXX
      → Rama: feature/HU-XXX-*
      → Docs: commands/sprint.md
   
   b) Bugfix (corrección de bug no urgente)
      → Comando: iniciarBugfix-HU-XXX
      → Rama: bugfix/HU-XXX-*
      → Docs: commands/bugfix.md
   
   c) Hotfix (corrección urgente)
      → Comando: iniciarHotfix-HU-XXX
      → Rama: hotfix/HU-XXX-*
      → Docs: commands/hotfix.md
   
   d) Consultar ayuda
      → Docs: commands/help.md

PASO 5: Ejecutar
   → Seguir el flujo del comando seleccionado
   → Al finalizar, actualizar contexto del proyecto
   → Actualizar _current/project.link si cambió

PASO 6: Actualizar Contexto
   → projects/<proyecto>/config.json → lastActivity
   → projects/<proyecto>/context.md → actualizar sesión activa
```

## Preguntas que el humano debe responder

1. ¿En qué proyecto quieres trabajar?
   - (mostrar lista de proyectos registrados)
   - Opción: "Crear nuevo proyecto"

2. ¿Qué tipo de tarea?
   - Sprint / Bugfix / Hotfix / Ayuda

3. (Según el tipo) ¿Cuál es el número de HU asociado? (ej: HU-006)

## Formato de Presentación

```
🧠 SEGUNDO CEREBRO AGENTICO ACTIVADO
─────────────────────────────────────

Proyecto activo: PaginaWebFunel
  Ruta: C:\Users\...\PaginaWebFunel
  Stack: MongoDB + Express + React (Vite) + Node.js
  Última actividad: [fecha]

📋 Resumen del proyecto:
  HUs completadas: 5
  HUs pendientes: 0
  Bugs abiertos: 0

─────────────────────────────────────

¿Qué tipo de tarea quieres realizar?

  a) Historia de Usuario (nuevo feature)
  b) Bugfix (corrección no urgente)
  c) Hotfix (corrección urgente)
  d) Ayuda / Ver comandos disponibles

  >