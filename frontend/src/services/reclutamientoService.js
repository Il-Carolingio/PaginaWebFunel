// Servicio para gestionar reclutamiento y tareas de llamada (HU-017)
import api from './api.js';

// Obtener todas las tareas de llamada de reclutamiento
export const obtenerTareasLlamada = async () => {
  try {
    const response = await api.get('/api/reclutamiento/tareas-llamada');
    return response.data;
  } catch (error) {
    console.error('Error al obtener tareas de llamada:', error);
    throw error;
  }
};

// Marcar registro como tarea generada
export const marcarTareaGenerada = async (id) => {
  try {
    const response = await api.put(`/api/reclutamiento/${id}/marcar-tarea-generada`);
    return response.data;
  } catch (error) {
    console.error('Error al marcar tarea generada:', error);
    throw error;
  }
};

// Obtener todos los registros de reclutamiento (para admin)
export const obtenerTodosRegistros = async () => {
  try {
    const response = await api.get('/api/reclutamiento');
    return response.data;
  } catch (error) {
    console.error('Error al obtener registros:', error);
    throw error;
  }
};

// Obtener registro por ID
export const obtenerRegistroPorId = async (id) => {
  try {
    const response = await api.get(`/api/reclutamiento/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error al obtener registro:', error);
    throw error;
  }
};

// Actualizar status del candidato
export const actualizarStatusCandidato = async (id, status) => {
  try {
    const response = await api.put(`/api/reclutamiento/${id}/status`, { status });
    return response.data;
  } catch (error) {
    console.error('Error al actualizar status:', error);
    throw error;
  }
};

// Eliminar registro
export const eliminarRegistro = async (id) => {
  try {
    const response = await api.delete(`/api/reclutamiento/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error al eliminar registro:', error);
    throw error;
  }
};

// Enviar correo de registro a candidato
export const enviarCorreoRegistro = async (id, datos) => {
  try {
    const response = await api.post(`/api/reclutamiento/enviar-correo/${id}`, datos);
    return response.data;
  } catch (error) {
    console.error('Error al enviar correo de registro:', error);
    throw error;
  }
};

// Validar token de registro
export const validarTokenRegistro = async (token) => {
  try {
    const response = await api.get(`/api/reclutamiento/validar-token`, {
      params: { token }
    });
    return response.data;
  } catch (error) {
    console.error('Error al validar token:', error);
    throw error;
  }
};

// Completar registro con token
export const completarRegistro = async (datos) => {
  try {
    const response = await api.post('/api/reclutamiento/completar-registro', datos);
    return response.data;
  } catch (error) {
    console.error('Error al completar registro:', error);
    throw error;
  }
};
