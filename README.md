# 🧠 Sistema Agentic Brain

> **IMPORTANTE:** Este proyecto está gestionado por el Sistema Agentic Brain.
> Antes de hacer cualquier cambio, lee las instrucciones obligatorias.

---

## ⚠️ INSTRUCCIONES OBLIGATORIAS PARA CLINE

**ANTES DE CUALQUIER ACCIÓN**, leer obligatoriamente:

1. **agentic-brain/agentic.md** - Filosofía y reglas del sistema
2. **agentic-brain/_current/next-task.md** - Tarea actual en progreso
3. **agentic-brain/projects/PaginaWebFunel/context.md** - Contexto completo del proyecto

## 📋 Reglas de Oro

- ❌ **NO hacer nada** hasta haber leído los archivos anteriores
- ✅ **SIEMPRE** seguir el flujo definido en agentic.md
- ✅ **SIEMPRE** actualizar el contexto después de cada operación
- ✅ **SIEMPRE** pushear a GitHub al finalizar
- ✅ **SIEMPRE** verificar con el humano antes de mergear a develop

## 🔄 Flujo de Trabajo

```
1. Leer archivos de contexto (arriba)
2. Identificar tipo de tarea (sprint/bugfix/hotfix)
3. Seguir flujo correspondiente
4. Actualizar contexto del proyecto
5. Push a GitHub
```

## ⚙️ Configuración

- **Ruta del cerebro:** `agentic-brain/` (en la raíz del proyecto)
- **Proyecto activo:** Ver en `_current/project.link`
- **Comandos disponibles:** Ver `agentic-brain/commands/`

---

## 📦 Stack Tecnológico

### Frontend
- **Framework:** React 19.2.6
- **Build Tool:** Vite 8.0.12
- **UI Library:** Chakra UI 2.8.2
- **Routing:** React Router DOM 7.15.1
- **Formularios:** React Hook Form + Yup
- **HTTP Client:** Axios
- **Animaciones:** Framer Motion
- **Iconos:** React Icons
- **Gestor de paquetes:** pnpm

### Backend
- **Runtime:** Node.js
- **Framework:** Express 4.22.2
- **Base de datos:** MongoDB
- **ORM:** Mongoose 9.6.2
- **Autenticación:** bcryptjs + jsonwebtoken
- **Email:** nodemailer
- **Seguridad:** express-rate-limit, cors
- **Gestor de paquetes:** pnpm

---

## 🚀 Comandos de Desarrollo

### Frontend
```bash
cd frontend
pnpm dev          # Servidor de desarrollo (Vite)
pnpm build        # Build de producción
pnpm lint         # Linter
pnpm preview      # Previsualizar build
```

### Backend
```bash
cd backend
pnpm dev          # Servidor de desarrollo (nodemon)
pnpm start        # Servidor de producción
```

---

## 📝 Nota

Este archivo es generado automáticamente por el sistema agentic brain.
No editar manualmente. Para modificar, editar la plantilla en `agentic-brain/templates/project-readme.md`.