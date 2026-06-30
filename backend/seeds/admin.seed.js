import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import Usuario from '../models/Usuario.js';

const crearAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/royal_prestige');
    console.log('✅ Conectado a MongoDB\n');

    // Verificar si ya existe el admin
    const adminExistente = await Usuario.findOne({ email: 'admin@cosinatech.com' });
    
    if (adminExistente) {
      console.log('⚠️  El usuario admin ya existe:');
      console.log(`   Email: ${adminExistente.email}`);
      console.log(`   Nombre: ${adminExistente.nombre}`);
      console.log(`   Rol: ${adminExistente.rol}`);
      console.log(`   Activo: ${adminExistente.activo}\n`);
      
      // Preguntar si desea actualizar la contraseña
      console.log('💡 Si deseas actualizar la contraseña, ejecuta:');
      console.log('   node backend/seeds/crear-admin.js --reset\n');
      
      await mongoose.connection.close();
      process.exit(0);
    }

    // Crear usuario admin
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash('admin', salt);

    const admin = new Usuario({
      email: 'admin@cosinatech.com',
      password: passwordHash,
      nombre: 'Administrador',
      telefono: '',
      direccion: '',
      contrato: '',
      rol: 'admin',
      activo: true
    });

    await admin.save();

    console.log('✅ Usuario administrador creado exitosamente:\n');
    console.log('   📧 Email: admin@cosinatech.com');
    console.log('   🔑 Contraseña: admin');
    console.log('   👤 Nombre: Administrador');
    console.log('   🔐 Rol: admin');
    console.log('   ✅ Activo: true\n');
    console.log('💡 Ahora puedes iniciar sesión en /crm con estas credenciales\n');

    await mongoose.connection.close();
    console.log('✅ Conexión cerrada');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
};

// Si se pasa el parámetro --reset, actualizar la contraseña
if (process.argv.includes('--reset')) {
  (async () => {
    try {
      await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/royal_prestige');
      console.log('🔄 Reseteando contraseña de admin...\n');

      const salt = await bcrypt.genSalt(10);
      const passwordHash = await bcrypt.hash('admin', salt);

      const admin = await Usuario.findOneAndUpdate(
        { email: 'admin@cosinatech.com' },
        { password: passwordHash },
        { new: true }
      );

      if (admin) {
        console.log('✅ Contraseña actualizada exitosamente\n');
        console.log('   📧 Email: admin@cosinatech.com');
        console.log('   🔑 Contraseña: admin\n');
      } else {
        console.log('❌ Usuario admin no encontrado. Ejecuta el script sin --reset primero.\n');
      }

      await mongoose.connection.close();
      process.exit(0);
    } catch (error) {
      console.error('❌ Error:', error);
      process.exit(1);
    }
  })();
} else {
  crearAdmin();
}