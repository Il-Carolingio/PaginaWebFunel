// backend/server.js (versión más ordenada)
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import rateLimit from 'express-rate-limit';
import connectDB from './config/db.js';
import { registrarProspecto } from './controllers/ProspectoController.js';
import { enviarReporte } from './controllers/ReporteConfianzaController.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Ruta de prueba
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Servidor funcionando' });
});

// Registrar prospecto en la rifa
app.post('/api/rifa/registro-olla-sarten-salud', registrarProspecto);

// Rate limiter para el reporte de confianza (máx 1 cada 30 minutos)
const reporteLimiter = rateLimit({
  windowMs: 30 * 60 * 1000, // 30 minutos
  max: 1,
  message: {
    success: false,
    message: 'Demasiadas solicitudes. Solo se permite 1 envío cada 30 minutos.',
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// Enviar reporte de prospectos confiables (protegido con API Key + rate limiting)
app.post('/api/rifa/reporte-confianza/enviar', reporteLimiter, enviarReporte);

// Conectar a MongoDB y arrancar
connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`🚀 Servidor en http://localhost:${PORT}`);
  });
});
