#!/usr/bin/env node

/**
 * Script de migración de datos desde MongoDB local a MongoDB Atlas
 * Uso: node scripts/migrar-a-atlas.js
 */

import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath, pathToFileURL } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Cargar variables de entorno
dotenv.config({ path: path.join(__dirname, '..', '.env') });

// Configuración
const MONGO_LOCAL = 'mongodb://localhost:27017/royal_prestige';
const MONGO_ATLAS = process.env.MONGO_URI;

// Colores para consola
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

// Función para cargar y registrar modelo
const cargarYRegistrarModelo = async (rutaModelo, nombreModelo, conexion) => {
  const rutaCompleta = path.join(__dirname, '..', rutaModelo);
  const rutaURL = pathToFileURL(rutaCompleta).href;
  const modulo = await import(rutaURL);
  const esquema = modulo.default || modulo;
  
  // Registrar el modelo en la conexión específica
  const Modelo = conexion.model(nombreModelo, esquema.schema || esquema);
  return Modelo;
};

// Función principal de migración
const migrarDatos = async () => {
  let conexionLocal = null;
  let conexionAtlas = null;

  try {
    log('\n=== INICIANDO MIGRACIÓN A MONGODB ATLAS ===\n', 'azul');

    // Paso 1: Conectar a MongoDB local
    log('📡 Conectando a MongoDB local...', 'amarillo');
    conexionLocal = await mongoose.createConnection(MONGO_LOCAL);
    log('✅ Conexión local establecida', 'verde');

    // Paso 2: Conectar a MongoDB Atlas
    log('📡 Conectando a MongoDB Atlas...', 'amarillo');
    conexionAtlas = await mongoose.createConnection(MONGO_ATLAS);
    log('✅ Conexión Atlas establecida', 'verde');

    // Paso 3: Definir modelos a migrar
    const modelos = [
      { nombre: 'Usuario', archivo: './models/Usuario.js' },
      { nombre: 'Prospecto', archivo: './models/Prospecto.js' },
      { nombre: 'Reclutamiento', archivo: './models/Reclutamiento.js' },
      { nombre: 'Tarea', archivo: './models/Tarea.js' },
    ];

    const resultados = {};

    // Paso 4: Migrar cada modelo
    for (const { nombre, archivo } of modelos) {
      try {
        log(`\n📦 Migrando colección: ${nombre}...`, 'amarillo');

        // Cargar modelo desde local
        const ModeloLocal = await cargarYRegistrarModelo(archivo, nombre, conexionLocal);
        
        // Obtener datos de local
        const datos = await ModeloLocal.find({}).lean();
        const total = datos.length;

        if (total === 0) {
          log(`  ⚠️  No hay datos en ${nombre}`, 'amarillo');
          resultados[nombre] = { total: 0, migrados: 0, errores: 0 };
          continue;
        }

        log(`  📊 Encontrados: ${total} documentos`, 'azul');

        // Cargar modelo en Atlas
        const ModeloAtlas = await cargarYRegistrarModelo(archivo, nombre, conexionAtlas);

        // Limpiar datos en Atlas
        await ModeloAtlas.deleteMany({});
        log(`  🗑️  Datos anteriores eliminados en Atlas`, 'amarillo');

        // Migrar datos a Atlas
        let migrados = 0;
        let errores = 0;

        for (const dato of datos) {
          try {
            // Eliminar _id para que MongoDB genere uno nuevo
            const { _id, ...datoSinId } = dato;
            
            await ModeloAtlas.create(datoSinId);
            migrados++;
            
            // Mostrar progreso cada 10 documentos
            if (migrados % 10 === 0) {
              log(`  ⏳ Progreso: ${migrados}/${total}`, 'azul');
            }
          } catch (error) {
            errores++;
            console.error(`  ❌ Error migrando documento:`, error.message);
          }
        }

        log(`  ✅ Migrados: ${migrados}/${total}`, 'verde');
        if (errores > 0) {
          log(`  ⚠️  Errores: ${errores}`, 'amarillo');
        }

        resultados[nombre] = { total, migrados, errores };
      } catch (error) {
        log(`  ❌ Error en ${nombre}: ${error.message}`, 'rojo');
        console.error(error);
        resultados[nombre] = { total: 0, migrados: 0, errores: 1 };
      }
    }

    // Paso 5: Resumen
    log('\n=== RESUMEN DE MIGRACIÓN ===\n', 'azul');
    
    let totalGeneral = 0;
    let totalMigrados = 0;
    let totalErrores = 0;

    for (const [coleccion, stats] of Object.entries(resultados)) {
      log(`${coleccion}:`, 'azul');
      log(`  Total: ${stats.total}`, 'reset');
      log(`  Migrados: ${stats.migrados}`, 'verde');
      if (stats.errores > 0) {
        log(`  Errores: ${stats.errores}`, 'rojo');
      }
      totalGeneral += stats.total;
      totalMigrados += stats.migrados;
      totalErrores += stats.errores;
    }

    log('\n📊 Totales:', 'azul');
    log(`  Documentos totales: ${totalGeneral}`, 'reset');
    log(`  Migrados exitosamente: ${totalMigrados}`, 'verde');
    if (totalErrores > 0) {
      log(`  Errores: ${totalErrores}`, 'rojo');
    }

    // Paso 6: Verificar conexión
    log('\n🔍 Verificando conexión a Atlas...', 'amarillo');
    const dbAtlas = conexionAtlas.db;
    const colecciones = await dbAtlas.listCollections().toArray();
    log(`✅ Colecciones en Atlas: ${colecciones.map(c => c.name).join(', ')}`, 'verde');

    log('\n✅ MIGRACIÓN COMPLETADA', 'verde');
    log('\n📝 Próximos pasos:', 'azul');
    log('  1. Verifica los datos en MongoDB Atlas', 'reset');
    log('  2. El archivo .env ya está actualizado con la nueva URI', 'reset');
    log('  3. Reinicia el servidor backend', 'reset');
    log('  4. Prueba la aplicación\n', 'reset');

  } catch (error) {
    log(`\n❌ ERROR EN LA MIGRACIÓN: ${error.message}`, 'rojo');
    console.error(error);
    process.exit(1);
  } finally {
    // Cerrar conexiones
    if (conexionLocal) {
      await conexionLocal.close();
      log('🔌 Conexión local cerrada', 'amarillo');
    }
    if (conexionAtlas) {
      await conexionAtlas.close();
      log('🔌 Conexión Atlas cerrada', 'amarillo');
    }
  }
};

// Ejecutar migración
migrarDatos().catch((error) => {
  console.error('Error fatal:', error);
  process.exit(1);
});