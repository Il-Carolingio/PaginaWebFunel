#!/usr/bin/env node

/**
 * Script para verificar el estado de los usuarios en MongoDB Atlas
 */

import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

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

const verificarUsuarios = async () => {
  let conexion = null;

  try {
    log('\n=== VERIFICANDO USUARIOS EN MONGODB ATLAS ===\n', 'azul');

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

    const usuarios = await Usuario.find({}).select('email nombre rol activo password');

    log(`\n📊 Total de usuarios: ${usuarios.length}\n`, 'azul');

    for (const usuario of usuarios) {
      log(`Email: ${usuario.email}`, 'reset');
      log(`  Nombre: ${usuario.nombre}`, 'reset');
      log(`  Rol: ${usuario.rol}`, 'reset');
      log(`  Activo: ${usuario.activo}`, 'reset');
      log(`  Password (hash): ${usuario.password ? usuario.password.substring(0, 20) + '...' : 'NO HAY PASSWORD'}`, usuario.password ? 'verde' : 'rojo');
      log(`  Longitud del hash: ${usuario.password ? usuario.password.length : 0} caracteres`, 'reset');
      
      // Verificar si el hash parece válido (bcrypt tiene 60 caracteres)
      if (usuario.password && usuario.password.length === 60) {
        log(`  ✅ Hash de bcrypt válido (60 caracteres)`, 'verde');
      } else if (usuario.password) {
        log(`  ⚠️  Hash inválido (debería tener 60 caracteres, tiene ${usuario.password.length})`, 'amarillo');
      } else {
        log(`  ❌ Sin password`, 'rojo');
      }
      log('');
    }

    log('✅ VERIFICACIÓN COMPLETADA', 'verde');

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

verificarUsuarios().catch((error) => {
  console.error('Error fatal:', error);
  process.exit(1);
});