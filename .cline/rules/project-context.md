# Contexto Global del Proyecto - Royal Prestige Funnel

> ⚠️ **Propósito**: Este archivo contiene el contexto completo del proyecto para que al leerlo en una nueva sesión (cuando se diga "comencemos") se tenga todo el panorama sin necesidad de releer los markdowns uno por uno.

---

## 📋 Información General

| Campo | Valor |
|-------|-------|
| **Proyecto** | Royal Prestige - Landing Page + Funnel de registro + Sistema de prospectos |
| **Stack** | MongoDB + Express + React (Vite) + Node.js (PERN Stack) |
| **Frontend** | `frontend/` - React + Vite + Chakra UI + react-hook-form + Yup |
| **Backend** | `backend/` - Express + Mongoose + Nodemailer + express-rate-limit |
| **BD** | MongoDB (local: `mongodb://localhost:27017/royal_prestige`) |
| **Puertos** | Frontend: 5173 / Backend: 5000 |
| **Package Manager** | pnpm |

---

## ✅ Historias de Usuario Completadas

| # | Descripción | Sprint |
|---|-------------|--------|
| **HU-001** | Sincronizar carrusel de productos con Hero Section (framer-motion) | 1 |
| **HU-002** | Formulario de registro para la rifa (`Funnel.jsx`) | 1 |
| **HU-003** | Endpoint `POST /api/rifa/registro-olla-sarten-salud` (registro de prospectos) | 1 |
| **HU-004** | Sistema de scoring: 3 reglas (casado, ingreso >= $25k, gusta cocinar) | 1 |
| **HU-005** | Reporte por correo de prospectos confiables (Nodemailer + umbral 10) | 2 |

---

## 📂 Estructura del Proyecto

### Backend (`backend/`)

```
backend/
├── server.js                  # Entry point (Express + rutas)
├── config/
│   └── db.js                  # Conexión MongoDB
├── controllers/
│   ├── ProspectoController.js  # POST registro + GET estadísticas ingresos
│   └── ReporteConfianzaController.js  # POST reporte por correo
├── models/
│   └── Prospecto.js            # Schema: nombre, teléfono, estadoCivil, nivelEstudios,
│                               #   marcasPrefiere[], gustaCocinar, numeroRifa (8 dígitos),
│                               #   ingresoEstimado, rangoIngreso, statusProspect,
│                               #   cumpleFiltros, estadoProspecto (CRM), reporteEnviado
├── services/
│   └── emailService.js         # Nodemailer + sanitización HTML + reintentos backoff
├── middleware/
├── routes/
├── utils/
├── .env                        # SMTP + API Key + MONGO_URI
└── .env.example                # Template documentado
```

### Frontend (`frontend/`)

```
frontend/
├── src/
│   ├── pages/
│   │   ├── Home.jsx            # Página principal con Hero + carrusel
│   │   └── Funnel.jsx          # Formulario de registro para la rifa
│   ├── services/
│   │   └── api.js              # Cliente Axios
│   ├── assets/images/
│   └── App.jsx
├── vite.config.js
└── package.json
```

---

## 🔌 Endpoints API

| Método | Ruta | Auth | Rate Limit | Descripción |
|--------|------|------|------------|-------------|
| `GET` | `/api/health` | ❌ | ❌ | Health check |
| `POST` | `/api/rifa/registro-olla-sarten-salud` | ❌ | ❌ | Registrar prospecto (funnel) |
| `POST` | `/api/rifa/reporte-confianza/enviar` | ✅ Bearer Token | ✅ 1 cada 30 min | Enviar reporte de confianza por correo |

---

## 📊 Reglas de Scoring (HU-004 / ProspectoController.js)

### Cálculo de ingreso estimado
```
ingreso = nivelEstudios.base * max(multiplicador_marca)
```

| Nivel Estudios | Base |
|----------------|------|
| primaria | $10,000 |
| secundaria | $15,000 |
| preparatoria | $24,000 |
| licenciatura | $37,500 |
| posgrado | $52,500 |

| Marca | Multiplicador |
|-------|--------------|
| royal_prestige | 1.30 |
| t_fal | 1.15 |
| oster | 1.15 |
| tupperware | 1.10 |
| other | 1.00 |
| none | 1.00 |

### 3 Reglas de filtro (debe cumplir al menos 2):
1. `estadoCivil === "casado"`
2. `ingresoEstimado >= 25000`
3. `gustaCocinar === true`

Si cumple 3/3 → `cumpleFiltros: true` + status "Genial"
Si cumple 2/3 → se registra con status "No ideal: cumple 2 de 3 filtros"
Si cumple < 2 → rechazado con error 400

---

## 📧 Reporte de Confianza (HU-005)

### Comportamiento del endpoint:
1. Valida API Key (header `Authorization: Bearer <key>`)
2. Valida rate limit (1 solicitud cada 30 minutos)
3. Cuenta prospectos con `cumpleFiltros: true` y `reporteEnviado: false`
4. Si < 10 → responde 200 con mensaje "umbral no alcanzado" (NO envía correo)
5. Si >= 10 → toma los 10 más recientes, envía correo con tabla HTML, los marca como `reporteEnviado: true`

### Credenciales SMTP:
- **Host:** smtp.gmail.com
- **Port:** 587
- **User:** copaduceo@gmail.com
- **Pass:** (contraseña de aplicación de Gmail, configurada en .env)
- **Email TO:** copaduceo@gmail.com
- **API Key:** `e26f84a46d5f77c9cd801e1cfbe36a5ffc567f850dc6bf16ec65d50206f450b1`

---

## 🧪 Cómo probar

### Registrar un prospecto:
```bash
curl -X POST http://localhost:5000/api/rifa/registro-olla-sarten-salud \
  -H "Content-Type: application/json" \
  -d '{"nombre":"Test","telefono":"5512345678","estadoCivil":"casado","nivelEstudios":"licenciatura","marcasPrefiere":["royal_prestige"],"gustaCocinar":true}'
```

### Enviar reporte de confianza:
```bash
curl -X POST http://localhost:5000/api/rifa/reporte-confianza/enviar \
  -H "Authorization: Bearer e26f84a46d5f77c9cd801e1cfbe36a5ffc567f850dc6bf16ec65d50206f450b1"
```

---

## 📝 Archivos de Documentación

| Archivo | Contenido |
|---------|-----------|
| `docs/user-stories/index.md` | Índice general de HU |
| `docs/user-stories/README.md` | Guía de estructura de HU |
| `docs/user-stories/templates/story-template.md` | Plantilla para nuevas HU |
| `docs/user-stories/templates/sprint-template.md` | Plantilla para sprints |
| `docs/user-stories/backlog/HU-001-*.md` a HU-005-*.md | Detalle de cada HU |
| `docs/user-stories/evaluations/HU-001-eval.md` y HU-005-eval.md | Evaluaciones técnicas |
| `docs/user-stories/sprints/HU-005-sprint.md` | Sprint de HU-005 (completado) |
| `.cline/rules/start-sprint.md` | Reglas para iniciar sprints |
| `.cline/rules/project-context.md` | **Este archivo** - Contexto global del proyecto |