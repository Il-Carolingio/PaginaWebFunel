// backend/controllers/prospectoController.js
import Prospecto from '../models/Prospecto.js';
import { enviarReporteConfianza } from '../services/emailService.js';

const ESTADOS_CIVIL_VALIDOS = ['soltero', 'casado', 'union_libre'];
const NIVELES_ESTUDIO_VALIDOS = ['primaria', 'secundaria', 'preparatoria', 'licenciatura', 'posgrado'];
const MARCAS_VALIDAS = ['royal_prestige', 't_fal', 'oster', 'tupperware', 'other', 'none'];

const generarNumeroProceso = () => {
  // Genera un número de 8 dígitos para identificar el proceso de registro
  return String(Math.floor(Math.random() * 90000000) + 10000000);
};

const generarNumeroProcesoUnico = async () => {
  let numero;
  let existe;

  do {
    numero = generarNumeroProceso();
    existe = await Prospecto.findOne({ numeroRifa: numero });
  } while (existe);

  return numero;
};

const obtenerIngresoEstimado = (nivelEstudios, marcasPrefiere) => {
  const NIVELES_ESTUDIO = {
    primaria: { base: 10000, rango: '8,000 - 12,000' },
    secundaria: { base: 15000, rango: '12,000 - 18,000' },
    preparatoria: { base: 24000, rango: '18,000 - 30,000' },
    licenciatura: { base: 37500, rango: '30,000 - 45,000' },
    posgrado: { base: 52500, rango: '45,000 - 60,000' },
  };

  const nivelData = NIVELES_ESTUDIO[nivelEstudios];
  if (!nivelData) return 15000;

  let base = nivelData.base;
  let mejorMultiplicador = 1.0;

  if (Array.isArray(marcasPrefiere) && marcasPrefiere.length > 0) {
    for (const marca of marcasPrefiere) {
      const multiplicadores = {
        royal_prestige: 1.30,
        t_fal: 1.15,
        oster: 1.15,
        tupperware: 1.10,
        other: 1.00,
        none: 1.00,
      };
      const mult = multiplicadores[marca] || 1.00;
      if (mult > mejorMultiplicador) {
        mejorMultiplicador = mult;
      }
    }
  }

  let ingreso = Math.round(base * mejorMultiplicador);
  ingreso = Math.round(ingreso / 1000) * 1000;
  return ingreso;
};

const obtenerRangoIngreso = (nivelEstudios) => {
  const NIVELES_ESTUDIO = {
    primaria: { base: 10000, rango: '8,000 - 12,000' },
    secundaria: { base: 15000, rango: '12,000 - 18,000' },
    preparatoria: { base: 24000, rango: '18,000 - 30,000' },
    licenciatura: { base: 37500, rango: '30,000 - 45,000' },
    posgrado: { base: 52500, rango: '45,000 - 60,000' },
  };
  const nivelData = NIVELES_ESTUDIO[nivelEstudios];
  return nivelData ? nivelData.rango : 'No especificado';
};

const construirStatusProspect = ({ validaciones, reglasCumplidas }) => {
  if (validaciones.length > 0) {
    return validaciones.join('; ');
  }

  if (reglasCumplidas === 3) {
    return 'Genial';
  }

  return `No ideal: cumple ${reglasCumplidas} de 3 filtros`;
};

// @desc    Registrar un nuevo prospecto (funnel)
// @route   POST /api/rifa/registro-olla-sarten-salud
// @access  Public
export const registrarProspecto = async (req, res) => {
  try {
    const {
      nombre,
      telefono,
      estadoCivil,
      nivelEstudios,
      marcasPrefiere,
      gustaCocinar,
    } = req.body;

    const numeroRifa = await generarNumeroProcesoUnico();

    // Verificar si ya existe el teléfono
    const existeProspecto = await Prospecto.findOne({ telefono });

    if (existeProspecto) {
      return res.status(400).json({
        success: false,
        error: 'Este teléfono ya fue registrado',
      });
    }

    const validaciones = [];
    const validEstadoCivil = ESTADOS_CIVIL_VALIDOS.includes(estadoCivil);
    const validNivelEstudios = NIVELES_ESTUDIO_VALIDOS.includes(nivelEstudios);
    const validMarcasPrefiere = Array.isArray(marcasPrefiere) && marcasPrefiere.length > 0;

    if (!validEstadoCivil) {
      validaciones.push(`estadoCivil: \`${estadoCivil}\` no es un valor válido`);
    }

    if (!validNivelEstudios) {
      validaciones.push(`nivelEstudios: \`${nivelEstudios}\` no es un valor válido`);
    }

    if (!validMarcasPrefiere) {
      validaciones.push('marcasPrefiere debe contener al menos una marca');
    } else {
      const invalidMarcas = marcasPrefiere.filter(marca => !MARCAS_VALIDAS.includes(marca));
      if (invalidMarcas.length > 0) {
        validaciones.push(`marcasPrefiere inválidas: ${invalidMarcas.join(', ')}`);
      }
    }

    const ingresoEstimado = obtenerIngresoEstimado(nivelEstudios, marcasPrefiere || []);
    const rangoIngreso = obtenerRangoIngreso(nivelEstudios);
    const cumpleEstadoCivil = estadoCivil === 'casado';
    const cumpleIngreso = ingresoEstimado >= 25000;
    const cumpleGustaCocinar = gustaCocinar === true;
    const reglasCumplidas = [cumpleEstadoCivil, cumpleIngreso, cumpleGustaCocinar].filter(Boolean).length;

    if (reglasCumplidas < 2) {
      return res.status(400).json({
        success: false,
        error: 'El prospecto no cumple al menos 2 de las reglas necesarias para el registro',
      });
    }

    const statusProspect = construirStatusProspect({
      validaciones,
      reglasCumplidas,
    });

    const nuevoProspecto = new Prospecto({
      nombre,
      telefono,
      estadoCivil,
      nivelEstudios,
      marcasPrefiere: marcasPrefiere || [],
      gustaCocinar,
      numeroRifa,
      ingresoEstimado,
      rangoIngreso,
      statusProspect,
      cumpleFiltros: cumpleEstadoCivil && cumpleIngreso && cumpleGustaCocinar,
    });

    await nuevoProspecto.save();

    // HU-008: Verificar si hay 5+ prospectos de confianza para notificar
    if (nuevoProspecto.cumpleFiltros) {
      const prospectosConfianza = await Prospecto.countDocuments({
        cumpleFiltros: true,
        reporteEnviado: false,
      });

      if (prospectosConfianza >= 5) {
        console.log(`[ProspectoController] Se alcanzaron ${prospectosConfianza} prospectos de confianza. Enviando notificación...`);
        
        const prospectos = await Prospecto.find({
          cumpleFiltros: true,
          reporteEnviado: false,
        })
          .sort({ createdAt: -1 })
          .limit(5)
          .lean();

        try {
          await enviarReporteConfianza(prospectos);
          
          await Prospecto.updateMany(
            { _id: { $in: prospectos.map(p => p._id) } },
            { $set: { reporteEnviado: true } }
          );
          
          console.log(`[ProspectoController] Notificación enviada exitosamente para ${prospectos.length} prospectos`);
        } catch (error) {
          console.error('[ProspectoController] Error al enviar notificación:', error);
        }
      }
    }

    res.status(201).json({
      success: true,
      message: `¡Tu registro fue exitoso! Tu número de proceso es ${nuevoProspecto.numeroRifa}. Conserva este número para reclamar tu premio en caso de resultar ganador/a. Te deseamos mucha suerte en la rifa.`,
      numeroRifa: nuevoProspecto.numeroRifa,
    });
  } catch (error) {
    console.error('Error:', error);
    
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        error: 'El teléfono o número de rifa ya está registrado',
      });
    }

    res.status(500).json({
      success: false,
      error: error.message || 'Error interno del servidor',
    });
  }
};

// @desc    Obtener estadísticas de ingresos estimados
// @route   GET /api/funnel/estadisticas/ingresos
export const obtenerEstadisticasIngresos = async (req, res) => {
  try {
    const stats = await Prospecto.aggregate([
      {
        $group: {
          _id: '$nivelEstudios',
          count: { $sum: 1 },
          ingresoPromedio: { $avg: '$ingresoEstimado' },
          ingresoMin: { $min: '$ingresoEstimado' },
          ingresoMax: { $max: '$ingresoEstimado' },
        }
      },
      { $sort: { ingresoPromedio: -1 } }
    ]);
    
    res.json({ success: true, data: stats });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};