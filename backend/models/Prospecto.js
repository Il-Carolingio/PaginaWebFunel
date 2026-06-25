// backend/models/Prospecto.js
import mongoose from 'mongoose';

// Configuración de niveles de estudio y sus ingresos base
const NIVELES_ESTUDIO = {
  primaria: { base: 10000, rango: '8,000 - 12,000' },
  secundaria: { base: 15000, rango: '12,000 - 18,000' },
  preparatoria: { base: 24000, rango: '18,000 - 30,000' },
  licenciatura: { base: 37500, rango: '30,000 - 45,000' },
  posgrado: { base: 52500, rango: '45,000 - 60,000' },
};

// Configuración de marcas y sus multiplicadores
const MARCAS_MULTIPLICADOR = {
  royal_prestige: 1.30,   // +30%
  t_fal: 1.15,            // +15%
  oster: 1.15,            // +15%
  tupperware: 1.10,       // +10%
  other: 1.00,            // +0%
  none: 1.00,             // +0%
};

// Función para calcular ingreso estimado
const calcularIngresoEstimado = (nivelEstudios, marcasPrefiere) => {
  // Obtener base según nivel de estudios
  const nivelData = NIVELES_ESTUDIO[nivelEstudios];
  if (!nivelData) return 15000; // Default si no hay nivel
  
  let base = nivelData.base;
  
  // Calcular el mejor multiplicador de las marcas que prefiere
  let mejorMultiplicador = 1.00;
  if (marcasPrefiere && marcasPrefiere.length > 0) {
    for (const marca of marcasPrefiere) {
      const mult = MARCAS_MULTIPLICADOR[marca] || 1.00;
      if (mult > mejorMultiplicador) {
        mejorMultiplicador = mult;
      }
    }
  }
  
  // Aplicar multiplicador
  let ingresoEstimado = Math.round(base * mejorMultiplicador);
  
  // Redondear a múltiplos de 1000
  ingresoEstimado = Math.round(ingresoEstimado / 1000) * 1000;
  
  return ingresoEstimado;
};

// Función para obtener rango de ingreso
const obtenerRangoIngreso = (nivelEstudios) => {
  const nivelData = NIVELES_ESTUDIO[nivelEstudios];
  return nivelData ? nivelData.rango : 'No especificado';
};

const prospectoSchema = new mongoose.Schema(
  {
    // Datos personales
    nombre: {
      type: String,
      required: [true, 'El nombre es requerido'],
      trim: true,
    },
    telefono: {
      type: String,
      required: [true, 'El teléfono es requerido'],
      unique: true,
      trim: true,
      match: [/^[0-9]{10}$/, 'Teléfono debe tener 10 dígitos'],
    },
    
    // Datos para inferir ingreso
    estadoCivil: {
      type: String,
      required: [true, 'El estado civil es requerido'],
      trim: true,
    },
    nivelEstudios: {
      type: String,
      required: [true, 'El nivel de estudios es requerido'],
      trim: true,
    },
    marcasPrefiere: {
      type: [String],
      required: [true, 'Selecciona al menos una marca'],
      validate: {
        validator: function(v) {
          return v && v.length > 0;
        },
        message: 'Debes seleccionar al menos una marca de utensilios',
      },
    },
    statusProspect: {
      type: String,
      default: 'Genial',
      trim: true,
    },
    
    // Campos calculados automáticamente
    ingresoEstimado: {
      type: Number,
      default: 0,
    },
    rangoIngreso: {
      type: String,
      default: '',
    },
    
    // Gusto por cocinar (pregunta directa)
    gustaCocinar: {
      type: Boolean,
      required: [true, 'Indicar si gusta cocinar es requerido'],
    },
    
    // Datos de la rifa
    numeroRifa: {
      type: String,
      required: [true, 'El número de rifa es requerido'],
      unique: true,
      uppercase: true,
      trim: true,
    },
    
    // Campo calculado (si cumple filtros: casado + ingreso >= 25000 + gusta cocinar)
    cumpleFiltros: {
      type: Boolean,
      default: false,
    },
    
    // Estado del prospecto para el CRM
    estadoProspecto: {
      type: String,
      enum: ['nuevo', 'contactado', 'cita_agendada', 'cita_realizada', 'compra_realizada', 'no_interesado'],
      default: 'nuevo',
    },

    // Control de envío de reporte (HU-005)
    reporteEnviado: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

// Middleware: ANTES de guardar, calcular ingreso y evaluar filtros
prospectoSchema.pre('save', async function() {
  // Calcular ingreso estimado
  this.ingresoEstimado = calcularIngresoEstimado(this.nivelEstudios, this.marcasPrefiere);
  this.rangoIngreso = obtenerRangoIngreso(this.nivelEstudios);
  
  // Evaluar si cumple filtros (casado + ingreso >= 25000 + gusta cocinar)
  const cumpleEstadoCivil = this.estadoCivil === 'casado';
  const cumpleIngreso = this.ingresoEstimado >= 25000;
  const cumpleGustaCocinar = this.gustaCocinar === true;
  this.cumpleFiltros = cumpleEstadoCivil && cumpleIngreso && cumpleGustaCocinar;
  
  // Mantener `statusProspect` en caso de evaluación previa del controller
  if (!this.statusProspect) {
    this.statusProspect = this.cumpleFiltros ? 'Genial' : 'No ideal';
  }
});

const Prospecto = mongoose.model('Prospecto', prospectoSchema);

export default Prospecto;