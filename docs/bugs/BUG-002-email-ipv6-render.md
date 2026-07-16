# BUG-002: Error de conexión SMTP por IPv6 en Render

## 📋 Descripción del Bug

El servicio de correo falla al enviar emails desde el servidor de Render debido a que Node.js intenta conectarse a Gmail usando IPv6, pero Render no tiene soporte para IPv6.

## 🔴 Síntomas

```
[emailService] Error en intento 3/3: connect ENETUNREACH 2607:f8b0:400e:c02::6c:587 - Local (:::0)
```

## 🔍 Causa Raíz

- **Dirección IPv6:** `2607:f8b0:400e:c02::6c` es una dirección IPv6 de los servidores de Gmail
- **Error ENETUNREACH:** Indica que la red IPv6 no es accesible desde Render
- **Node.js por defecto:** Intenta usar IPv6 cuando está disponible
- **Render:** Tiene restricciones de red que bloquean ciertas conexiones salientes SMTP

## ✅ Solución Implementada

### 1. Configuración SMTP optimizada
Se agregaron las siguientes configuraciones al `nodemailer.createTransport()`:

```javascript
{
  port: 465,           // Usar puerto 465 (SSL) en lugar de 587 (TLS)
  secure: true,        // SSL obligatorio
  family: 4,           // Fuerza uso de IPv4
  tls: {
    rejectUnauthorized: false,
  },
  connectionTimeout: 10000,
  socketTimeout: 10000,
}
```

### 2. Fallback a SendGrid
Se agregó soporte para SendGrid como servicio alternativo cuando SMTP falla:
- Se agregó `@sendgrid/mail` como dependencia
- El código intenta SMTP primero, y si falla, usa SendGrid automáticamente

## 📁 Archivos Modificados

- `backend/services/emailService.js` - Configuración del transporter SMTP + fallback SendGrid
- `backend/package.json` - Agregada dependencia @sendgrid/mail
- `backend/.env.example` - Documentación de configuración

## 🔄 Estado

- **Rama:** `bugfix/BUG-002-email-ipv6-render`
- **PR:** https://github.com/Il-Carolingio/PaginaWebFunel/pull/5
- **Estado:** ✅ Mergeada a develop

## 📋 Próximos Pasos

1. **Configurar SendGrid (recomendado):**
   - Registrar cuenta en https://sendgrid.com/
   - Crear API Key en https://app.sendgrid.com/settings/api_keys
   - Agregar `SENDGRID_API_KEY=SG.xxx` al .env de Render

2. **Verificar contraseña de aplicación de Gmail:**
   - Si el SMTP sigue fallando, generar nueva contraseña en https://myaccount.google.com/apppasswords

3. **Verificar en producción:**
   - Probar envío de correo desde el CRM
   - Revisar logs de Render