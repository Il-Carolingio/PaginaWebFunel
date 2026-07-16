# Guía: Migración a MongoDB Atlas

## 📋 Resumen
Esta guía te ayudará a crear una cuenta de MongoDB Atlas, configurar un cluster gratuito y migrar la base de datos del proyecto PaginaWebFunel.

---

## Paso 1: Crear Cuenta en MongoDB Atlas

### 1.1 Acceder a MongoDB Atlas
1. Abre tu navegador y ve a: **https://www.mongodb.com/atlas/database**
2. Haz clic en **"Try Free"** o **"Get Started Free"**
3. Regístrate con tu correo electrónico o usa Google/GitHub para autenticación

### 1.2 Verificar Correo
- Revisa tu bandeja de entrada y confirma tu cuenta haciendo clic en el enlace de verificación

---

## Paso 2: Crear un Cluster Gratuito

### 2.1 Iniciar Creación de Proyecto
1. Después de iniciar sesión, verás el **"Welcome to MongoDB Atlas"** wizard
2. Haz clic en **"Create a new project"** o **"Build my first cluster"**

### 2.2 Configurar el Cluster
1. **Nombre del proyecto:** `PaginaWebFunel` (o el nombre que prefieras)
2. **Nombre del cluster:** `Cluster0` (por defecto) o personalízalo
3. **Región:** Selecciona la región más cercana a tu ubicación
   - Para México: **N. Virginia (us-east-1)** o **São Paulo (sa-east-1)**
4. **Tier:** Selecciona **M0 Sandbox** (gratis)
   - 512 MB de almacenamiento
   - Compartido con otros usuarios
   - Perfecto para desarrollo y testing
5. **Additional Settings:**
   - Deja las opciones por defecto
6. Haz clic en **"Create Cluster"**

### 2.3 Esperar Creación del Cluster
- El cluster tardará 3-5 minutos en crearse
- Verás una pantalla de "Your cluster is being created..."

---

## Paso 3: Configurar Acceso a la Base de Datos

### 3.1 Crear Usuario de Base de Datos
1. En el menú izquierdo, ve a **Database Access**
2. Haz clic en **"Add New Database User"**
3. **Authentication Method:** Password
4. **Username:** `admin` (o el nombre que prefieras)
5. **Password:** Genera una contraseña segura (guárdala!)
   - Ejemplo: `RoyalPrestige2026!`
6. **Database User Privileges:** Read and write to any database
7. Haz clic en **"Add User"**

### 3.2 Configurar Acceso de Red
1. En el menú izquierdo, ve a **Network Access**
2. Haz clic en **"Add IP Address"**
3. **IP Address:** Selecciona **"Allow Access from Anywhere"** (0.0.0.0/0)
   - ⚠️ NOTA: Para producción, deberías restringir esto a IPs específicas
4. Haz clic en **"Confirm"**

---

## Paso 4: Obtener Connection String

### 4.1 Obtener el String de Conexión
1. En el menú izquierdo, ve a **Database**
2. Haz clic en **"Connect"** en tu cluster
3. Selecciona **"Drivers"**
4. **Driver:** Node.js
5. **Version:** 5.5 or later
6. Copia el connection string que aparece, se verá algo así:

```
mongodb+srv://admin:<password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
```

7. **Reemplaza `<password>`** con la contraseña que creaste en el paso 3.1

8. **Agrega el nombre de la base de datos** al final:

```
mongodb+srv://admin:RoyalPrestige2026!@cluster0.xxxxx.mongodb.net/paginawebfunel?retryWrites=true&w=majority
```

---

## Paso 5: Actualizar Configuración del Backend

### 5.1 Actualizar archivo .env
Abre el archivo `backend/.env` y actualiza la línea de `MONGO_URI`:

```env
# Antes (MongoDB local):
# MONGO_URI=mongodb://localhost:27017/paginawebfunel

# Después (MongoDB Atlas):
MONGO_URI=mongodb+srv://admin:RoyalPrestige2026!@cluster0.xxxxx.mongodb.net/paginawebfunel?retryWrites=true&w=majority
```

**Reemplaza:**
- `admin` con tu usuario de Atlas
- `RoyalPrestige2026!` con tu contraseña
- `cluster0.xxxxx.mongodb.net` con tu cluster real
- `paginawebfunel` con el nombre que quieras para tu base de datos

### 5.2 Verificar Configuración
Asegúrate de que el archivo `backend/config/db.js` esté usando la variable de entorno:

```javascript
import mongoose from 'mongoose';

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`MongoDB Conectado: ${conn.connection.host}`);
  } catch (error) {
    console.error('Error conectando a MongoDB:', error);
    process.exit(1);
  }
};

export default connectDB;
```

---

## Paso 6: Migrar Datos Locales a Atlas

### 6.1 Hacer Backup de Datos Locales (Opcional pero Recomendado)
```bash
# Si tienes MongoDB local corriendo:
mongodump --db paginawebfunel --out ./backup-local
```

### 6.2 Crear Script de Migración
Voy a crear un script que exportará los datos de tu base de datos local y los importará a Atlas.

### 6.3 Importar a Atlas
```bash
# Usando mongosh o MongoDB Compass
mongorestore --uri="mongodb+srv://admin:RoyalPrestige2026!@cluster0.xxxxx.mongodb.net/paginawebfunel" ./backup-local/paginawebfunel
```

---

## Paso 7: Verificar Conexión

### 7.1 Probar Conexión Local
```bash
cd backend
pnpm dev
```

Deberías ver en la consola:
```
MongoDB Conectado: cluster0.xxxxx.mongodb.net
🚀 Servidor en http://localhost:5000
```

### 7.2 Verificar en Atlas
1. Ve a **MongoDB Atlas** → **Database** → **Browse Collections**
2. Deberías ver todas tus colecciones: `usuarios`, `reclutamientos`, `tareas`, `prospectos`
3. Verifica que los datos estén correctos

---

## Paso 8: Actualizar Documentación

### 8.1 Actualizar Contexto del Proyecto
Actualizaré el archivo `context.md` con la nueva configuración de base de datos.

### 8.2 Actualizar README
Agregaré instrucciones de configuración de MongoDB Atlas al README del proyecto.

---

## ⚠️ Consideraciones Importantes

### Seguridad
- **Nunca** compartas tu connection string completo con contraseña
- Usa variables de entorno (`.env`) para credenciales
- Para producción, restringe el acceso de red a IPs específicas

### Costos
- **M0 Sandbox (Free):** 512 MB, suficiente para desarrollo
- **M2/M5:** Para producción, según necesidades

### Backup
- MongoDB Atlas hace backups automáticos en planes pagos
- Para plan gratuito, haz backups manuales regularmente

### Performance
- El cluster gratuito tiene limitaciones de throughput
- Para producción, considera un cluster M10 o superior

---

## 🚀 Próximos Pasos

Una vez que tengas:
1. ✅ Cuenta de MongoDB Atlas creada
2. ✅ Cluster M0 creado
3. ✅ Usuario y contraseña configurados
4. ✅ Connection string obtenido

**Comparte conmigo:**
- Tu connection string (sin la contraseña por seguridad)
- La contraseña que elegiste (por canal seguro)

Y procederé a:
1. Actualizar el archivo `.env`
2. Crear script de migración
3. Migrar los datos
4. Verificar que todo funcione

---

## 📞 Soporte

Si tienes problemas en algún paso, compárteme:
- Capturas de pantalla de la configuración
- El connection string (sin contraseña)
- Cualquier error que aparezca

Estoy aquí para ayudarte en cada paso del proceso.