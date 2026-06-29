import mongoose from 'mongoose';
import Prospecto from '../models/Prospecto.js';

const consultarProspectos = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/royal_prestige');
    console.log('✅ Conectado a MongoDB\n');

    // Contar prospectos que cumplen filtros y no han sido reportados
    const pendientes = await Prospecto.countDocuments({
      cumpleFiltros: true,
      reporteEnviado: false,
    });

    console.log(`📊 Prospectos de confianza pendientes de notificar: ${pendientes}`);
    console.log(`   (cumpleFiltros: true, reporteEnviado: false)\n`);

    // Mostrar los prospectos pendientes
    if (pendientes > 0) {
      const prospectos = await Prospecto.find({
        cumpleFiltros: true,
        reporteEnviado: false,
      })
        .sort({ createdAt: -1 })
        .limit(10)
        .lean();

      console.log('📋 Lista de prospectos pendientes (últimos 10):\n');
      prospectos.forEach((p, index) => {
        console.log(`${index + 1}. ${p.nombre}`);
        console.log(`   Teléfono: ${p.telefono}`);
        console.log(`   Email: ${p.email || 'N/A'}`);
        console.log(`   Estado Civil: ${p.estadoCivil}`);
        console.log(`   Nivel Estudios: ${p.nivelEstudios}`);
        console.log(`   Ingreso Estimado: $${p.ingresoEstimado?.toLocaleString() || 'N/A'}`);
        console.log(`   Status: ${p.statusProspect}`);
        console.log(`   Registrado: ${p.createdAt?.toLocaleDateString('es-MX') || 'N/A'}`);
        console.log('');
      });
    }

    // Mostrar todos los prospectos (para debugging)
    const total = await Prospecto.countDocuments({});
    const conFiltros = await Prospecto.countDocuments({ cumpleFiltros: true });
    const reportados = await Prospecto.countDocuments({ reporteEnviado: true });

    console.log('📈 Estadísticas generales:');
    console.log(`   Total de prospectos: ${total}`);
    console.log(`   Con cumpleFiltros: true: ${conFiltros}`);
    console.log(`   Ya reportados (reporteEnviado: true): ${reportados}`);
    console.log(`   Pendientes de reportar: ${pendientes}`);

    await mongoose.connection.close();
    console.log('\n✅ Conexión cerrada');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
};

consultarProspectos();