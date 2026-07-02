// Seed para crear/actualizar el usuario administrador
// Ejecutar: node backend/seeds/admin.js
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Usuario from '../models/Usuario.js';

dotenv.config();

const crearAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/royalprestige');
    console.log('✅ Conectado a MongoDB');

    const adminData = {
      nombre: 'Admin Royal Prestige',
      email: 'admin@cosinatech.com',
      password: 'admin123',
      rol: 'admin',
      telefono: '4420000000'
    };

    const existente = await Usuario.findOne({ email: adminData.email });
    if (existente) {
      console.log('ℹ️  El admin ya existe, actualizando contraseña...');
      existente.password = adminData.password;
      await existente.save();
      console.log('✅ Admin actualizado');
    } else {
      await Usuario.create(adminData);
      console.log('✅ Admin creado exitosamente');
    }

    console.log('📧 Email:', adminData.email);
    console.log('🔑 Password:', adminData.password);

    await mongoose.disconnect();
    console.log('👋 Desconectado de MongoDB');
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
};

crearAdmin();