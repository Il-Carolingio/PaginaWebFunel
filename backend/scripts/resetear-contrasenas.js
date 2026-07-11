#!/usr/bin/env node

/**
 * Script para resetear contraseñas de usuarios a valores conocidos
 * Útil después de migraciones o cuando se pierden las credenciales
 */

import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import bcrypt from 'bcryptjs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Cargar variables de entorno
dotenv.config({ path: path.join(__dirname, '..', '.env') });

const MONGO_ATLAS = process.env.MONGO_URI;

const colores = {
  reset: '\x1b[0m',
  verde: '\x1b[32m',
  amarillo: '\x1b[33m',
  azul: '\x1b[36m',
  rojo: '\x1b[31m',
};

const log = (mensaje, color = 'reset') => {
  console.log(`${colores[color]}${mensaje}${colores.reset}`);
};

// Nuevas contraseñas (CAMBIAR ESTAS CONTRASEÑAS DESPUÉS DEL PRIMER LOGIN)
const NUEVAS_CONTRASEÑAS = {
  'admin@casapleroma.com': 'Admin2026!',
  'copaduceo@gmail.com': 'Vendedor2026!'
};

const resetearContraseñas = async () => {
  let conexion = null;

  try {
    log('\n=== RESETEANDO CONTRASEÑAS DE USUARIOS ===\n', 'azul');

    log('📡 Conectando a MongoDB Atlas...', 'amarillo');
    conexion = await mongoose.createConnection(MONGO_ATLAS);
    log('✅ Conexión establecida', 'verde');

    const Usuario = conexion.model('Usuario', new mongoose.Schema({
      email: String,
      password: String,
      nombre: String,
      rol: String,
      activo: Boolean
    }), 'usuarios');

    let actualizados = 0;
    let errores = 0;

    for (const [email, nuevaPassword] of Object.entries(NUEVAS_CONTRASEÑAS)) {
      try {
        log(`\n🔍 Procesando: ${email}`, 'amarillo');

        const usuario = await Usuario.findOne({ email: email.toLowerCase() });

        if (!usuario) {
          log(`  ⚠️  Usuario no encontrado, saltando...`, 'amarillo');
          continue;
        }

        // Hashear la nueva contraseña
        const salt = await bcrypt.genSalt(10);
        const passwordHash = await bcrypt.hash(nuevaPassword, salt);

        // Actualizar en la base de datos
        usuario.password = passwordHash;
        await usuario.save();

        log(`  ✅ Contraseña actualizada`, 'verde');
        log(`  📧 Email: ${email}`, 'reset');
        log(`  🔑 Nueva contraseña: ${nuevaPassword}`, 'amarillo');
        log(`  🔒 Hash: ${passwordHash.substring(0, 20)}...`, 'reset');

        actualizados++;
      } catch (error) {
        log(`  ❌ Error: ${error.message}`, 'rojo');
        errores++;
      }
    }

    log('\n=== RESUMEN ===', 'azul');
    log(`  ✅ Actualizados: ${actualizados}`, 'verde');
    if (errores > 0) {
      log(`  ❌ Errores: ${errores}`, 'rojo');
    }

    log('\n✅ PROCESO COMPLETADO', 'verde');
    log('\n⚠️  IMPORTANTE:', 'amarillo');
    log('  1. Usa las nuevas credenciales para hacer login', 'reset');
    log('  2. Después de login, cambia las contraseñas desde el perfil', 'reset');
    log('  3. Este script debe eliminarse o protegerse después de usarlo', 'reset');
    log('\n📋 Credenciales actualizadas:', 'azul');
    
    for (const [email, password] of Object.entries(NUEVAS_CONTRASEÑAS)) {
      log(`  ${email}: ${password}`, 'reset');
    }

  } catch (error) {
    log(`\n❌ ERROR: ${error.message}`, 'rojo');
    console.error(error);
  } finally {
    if (conexion) {
      await conexion.close();
      log('\n🔌 Conexión cerrada', 'amarillo');
    }
  }
};

resetearContraseñas().catch((error) => {
  console.error('Error fatal:', error);
  process.exit(1);
});