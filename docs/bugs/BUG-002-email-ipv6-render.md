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

## ✅ Solución Aplicada

Se agregaron las siguientes configuraciones al `nodemailer.createTransport()`:

```javascript
{
  family: 4,           // Fuerza uso de IPv4
  tls: {
    rejectUnauthorized: false,
  },
  connectionTimeout: 10000,
  socketTimeout: 10000,
}
```

## 📁 Archivos Modificados

- `backend/services/emailService.js` - Configuración del transporter SMTP

## 🔄 Estado

- **Rama:** `bugfix/BUG-002-email-ipv6-render`
- **Estado:** Pendiente de deploy y verificación