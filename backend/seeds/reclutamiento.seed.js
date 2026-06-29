const mongoose = require('mongoose');
const Reclutamiento = require('../models/Reclutamiento');

const seedReclutamiento = async () => {
  try {
    // Conectar a MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/royal_prestige');
    console.log('✅ Conectado a MongoDB');

    // Datos de prueba
    const datos = [
      {
        nombre: 'Juan Carlos Pérez García',
        telefono: '5512345678',
        email: 'juan.perez@example.com',
        experiencia: 'si',
        disponibilidad: 'mañana',
        motivacion: 'Tengo 5 años de experiencia en ventas y me gustaría crecer en una empresa reconocida como Royal Prestige.',
        status: 'pendiente'
      },
      {
        nombre: 'María Elena Rodríguez López',
        telefono: '5598765432',
        email: 'maria.rodriguez@example.com',
        experiencia: 'no',
        disponibilidad: 'tarde',
        motivacion: 'Soy una persona emprendedora y quiero aprender sobre ventas de productos de alta calidad.',
        status: 'pendiente'
      },
      {
        nombre: 'Roberto Martínez Hernández',
        telefono: '5545678901',
        email: 'roberto.martinez@example.com',
        experiencia: 'si',
        disponibilidad: 'flexible',
        motivacion: 'He trabajado en ventas de productos de cocina y conozco el mercado. Quiero aportar mi experiencia.',
        status: 'contratado'
      },
      {
        nombre: 'Ana Sofía García Ruiz',
        telefono: '5534567890',
        email: 'ana.garcia@example.com',
        experiencia: 'si',
        disponibilidad: 'noche',
        motivacion: 'Busco una oportunidad para demostrar mis habilidades en ventas y crecer profesionalmente.',
        status: 'pendiente'
      }
    ];

    // Limpiar colección
    await Reclutamiento.deleteMany({});
    console.log('🗑️  Colección limpiada');

    // Insertar datos
    await Reclutamiento.insertMany(datos);
    console.log('✅ Seeds de reclutamiento insertados:', datos.length, 'registros');

    // Mostrar registros insertados
    const registros = await Reclutamiento.find();
    console.log('\n📊 Registros en la base de datos:');
    registros.forEach((reg, index) => {
      console.log(`\n${index + 1}. ${reg.nombre}`);
      console.log(`   Email: ${reg.email}`);
      console.log(`   Teléfono: ${reg.telefono}`);
      console.log(`   Status: ${reg.status}`);
      console.log(`   Fecha: ${reg.fechaRegistro.toLocaleDateString()}`);
    });

    // Cerrar conexión
    await mongoose.connection.close();
    console.log('\n✅ Conexión cerrada');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error en seeds:', error);
    process.exit(1);
  }
};

// Ejecutar seeds
seedReclutamiento();