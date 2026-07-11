#!/usr/bin/env node

/**
 * Script para probar el login con los usuarios migrados
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

const probarLogin = async () => {
  let conexion = null;

  try {
    log('\n=== PROBANDO LOGIN CON USUARIOS MIGRADOS ===\n', 'azul');

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

    // Probar con el usuario admin
    const email = 'admin@casapleroma.com';
    const password = 'casaPleroma$1'; // Contraseña proporcionada por el usuario

    log(`\n🔍 Buscando usuario: ${email}`, 'amarillo');
    const usuario = await Usuario.findOne({ email: email.toLowerCase() });

    if (!usuario) {
      log(`❌ Usuario no encontrado`, 'rojo');
      return;
    }

    log(`✅ Usuario encontrado: ${usuario.nombre}`, 'verde');
    log(`  Password hash en BD: ${usuario.password.substring(0, 20)}...`, 'reset');
    log(`  Longitud del hash: ${usuario.password.length} caracteres`, 'reset');

    // Probar comparación de password
    log(`\n🔐 Comparando password...`, 'amarillo');
    const passwordValido = await bcrypt.compare(password, usuario.password);
    
    if (passwordValido) {
      log(`✅ Password correcto!`, 'verde');
    } else {
      log(`❌ Password incorrecto`, 'rojo');
      log(`\n💡 Posibles causas:`, 'amarillo');
      log(`  1. La contraseña ingresada no es correcta`, 'reset');
      log(`  2. El hash se corrompió durante la migración`, 'reset');
      log(`  3. El método compararPassword no funciona correctamente`, 'reset');
    }

    // Probar con el método del modelo
    log(`\n🔍 Probando método compararPassword del modelo...`, 'amarillo');
    const passwordValido2 = await usuario.compararPassword(password);
    
    if (passwordValido2) {
      log(`✅ Método compararPassword funciona correctamente`, 'verde');
    } else {
      log(`❌ Método compararPassword falló`, 'rojo');
    }

    log('\n✅ PRUEBA COMPLETADA', 'verde');

  } catch (error) {
    log(`\n❌ ERROR: ${error.message}`, 'rojo');
    console.error(error);
  } finally {
    if (conexion) {
      await conexion.close();
      log('🔌 Conexión cerrada', 'amarillo');
    }
  }
};

probarLogin().catch((error) => {
  console.error('Error fatal:', error);
  process.exit(1);
});