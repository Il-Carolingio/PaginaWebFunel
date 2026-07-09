// frontend/src/pages/AdminReclutamiento.jsx
// Página de administración de reclutamiento (HU-020)
import { useState, useEffect } from 'react';
import {
  Box,
  Heading,
  Text,
  VStack,
  HStack,
  Badge,
  Button,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
  FormControl,
  FormLabel,
  Input,
  Select,
  useToast,
  Container,
  Spinner,
  Alert,
  AlertIcon,
  AlertDescription,
  Divider
} from '@chakra-ui/react';
import { EmailIcon, CheckIcon } from '@chakra-ui/icons';
import { useAuth } from '../context/AuthContext';
import { obtenerTodosRegistros, enviarCorreoRegistro } from '../services/reclutamientoService.js';

function AdminReclutamiento() {
  const [registros, setRegistros] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [enviando, setEnviando] = useState(false);
  const { usuario } = useAuth();
  const toast = useToast();

  // Estado para el diálogo de envío de correo
  const { isOpen: isOpenEnviar, onOpen: onOpenEnviar, onClose: onCloseEnviar } = useDisclosure();
  const [registroSeleccionado, setRegistroSeleccionado] = useState(null);
  const [formEnvio, setFormEnvio] = useState({
    nombre: '',
    rol: 'vendedor'
  });

  useEffect(() => {
    cargarRegistros();
  }, []);

  const cargarRegistros = async () => {
    try {
      const data = await obtenerTodosRegistros();
      if (data.success) {
        setRegistros(data.data);
      }
    } catch (error) {
      toast({
        title: 'Error al cargar registros',
        description: error.message || 'Error desconocido',
        status: 'error',
        duration: 5000,
        isClosable: true,
        position: 'top',
      });
    } finally {
      setCargando(false);
    }
  };

  const abrirDialogoEnviarCorreo = (registro) => {
    setRegistroSeleccionado(registro);
    setFormEnvio({
      nombre: registro.nombre,
      rol: 'vendedor'
    });
    onOpenEnviar();
  };

  const handleEnviarCorreo = async () => {
    if (!registroSeleccionado) return;

    setEnviando(true);
    try {
      const data = await enviarCorreoRegistro(registroSeleccionado._id, formEnvio);
      
      toast({
        title: 'Correo enviado exitosamente',
        description: `Se envió el correo de registro a ${formEnvio.nombre}`,
        status: 'success',
        duration: 5000,
        isClosable: true,
        position: 'top',
      });

      // Recargar registros para actualizar el estado
      await cargarRegistros();
      onCloseEnviar();
    } catch (error) {
      toast({
        title: 'Error al enviar correo',
        description: error.message || 'Error desconocido',
        status: 'error',
        duration: 5000,
        isClosable: true,
        position: 'top',
      });
    } finally {
      setEnviando(false);
    }
  };

  const getColorStatus = (status) => {
    const colores = {
      pendiente: 'yellow',
      contratado: 'green',
      cancelado: 'red'
    };
    return colores[status] || 'gray';
  };

  const getLabelStatus = (status) => {
    const labels = {
      pendiente: 'Pendiente',
      contratado: 'Contratado',
      cancelado: 'Cancelado'
    };
    return labels[status] || status;
  };

  // Si no hay usuario o no es admin, mostrar mensaje
  if (!usuario || usuario.rol !== 'admin') {
    return (
      <Box minH="100vh" bg="gray.50" display="flex" alignItems="center" justifyContent="center" p={4}>
        <Container maxW="md">
          <Box bg="white" p={8} borderRadius="xl" boxShadow="2xl" textAlign="center">
            <Heading as="h1" size="xl" color="red.500" mb={4}>
              ⚠️ Acceso Denegado
            </Heading>
            <Text color="gray.600" mb={4}>
              No tienes permisos para acceder a esta página.
            </Text>
            <Text fontSize="sm" color="gray.500">
              Solo los administradores pueden gestionar el reclutamiento.
            </Text>
          </Box>
        </Container>
      </Box>
    );
  }

  return (
    <Box minH="100vh" bg="gray.50" p={{ base: 4, md: 8 }}>
      <Container maxW="1200px">
        {/* Encabezado */}
        <Box mb={8}>
          <Heading as="h1" size="xl" color="orange.500" mb={2}>
            🤝 Gestión de Reclutamiento
          </Heading>
          <Text color="gray.600">
            Administra los candidatos y envía correos de registro
          </Text>
        </Box>

        {/* Estadísticas */}
        <HStack spacing={4} mb={8} flexWrap="wrap">
          <Box flex="1" minW="200px" bg="white" p={6} borderRadius="xl" boxShadow="md">
            <Text color="gray.600" fontSize="sm" mb={1}>Total Candidatos</Text>
            <Heading as="h2" size="2xl" color="blue.500">{registros.length}</Heading>
          </Box>
          <Box flex="1" minW="200px" bg="white" p={6} borderRadius="xl" boxShadow="md">
            <Text color="gray.600" fontSize="sm" mb={1}>Pendientes</Text>
            <Heading as="h2" size="2xl" color="yellow.500">
              {registros.filter(r => r.status === 'pendiente').length}
            </Heading>
          </Box>
          <Box flex="1" minW="200px" bg="white" p={6} borderRadius="xl" boxShadow="md">
            <Text color="gray.600" fontSize="sm" mb={1}>Contratados</Text>
            <Heading as="h2" size="2xl" color="green.500">
              {registros.filter(r => r.status === 'contratado').length}
            </Heading>
          </Box>
        </HStack>

        {/* Lista de candidatos */}
        {cargando ? (
          <Box textAlign="center" py={12}>
            <Spinner size="xl" color="orange.500" thickness="4px" />
            <Text mt={4} color="gray.600">Cargando candidatos...</Text>
          </Box>
        ) : registros.length === 0 ? (
          <Box bg="white" p={8} borderRadius="xl" textAlign="center">
            <Text color="gray.500">No hay candidatos registrados aún.</Text>
          </Box>
        ) : (
          <VStack spacing={4} align="stretch">
            {registros.map((registro) => (
              <Box key={registro._id} bg="white" p={6} borderRadius="xl" boxShadow="md">
                <HStack justify="space-between" align="start">
                  <VStack align="start" spacing={2} flex="1">
                    <HStack>
                      <Badge colorScheme={getColorStatus(registro.status)}>
                        {getLabelStatus(registro.status)}
                      </Badge>
                      {registro.registroCompletado && (
                        <Badge colorScheme="green">Registro Completado</Badge>
                      )}
                    </HStack>
                    <Heading as="h3" size="md">{registro.nombre}</Heading>
                    <Text fontSize="sm" color="gray.600">
                      📧 {registro.email}
                    </Text>
                    <Text fontSize="sm" color="gray.600">
                      📱 {registro.telefono}
                    </Text>
                    <Text fontSize="sm" color="gray.500">
                      Experiencia: {registro.experiencia === 'si' ? 'Sí' : 'No'} | 
                      Disponibilidad: {registro.disponibilidad}
                    </Text>
                    {registro.motivacion && (
                      <Text fontSize="sm" color="gray.500" fontStyle="italic">
                        "{registro.motivacion}"
                      </Text>
                    )}
                    <Text fontSize="xs" color="gray.400">
                      Registrado: {new Date(registro.fechaRegistro).toLocaleDateString('es-MX')}
                    </Text>
                  </VStack>
                  <VStack spacing={2}>
                    {!registro.registroCompletado && (
                      <Button
                        colorScheme="blue"
                        variant="outline"
                        size="sm"
                        leftIcon={<EmailIcon />}
                        onClick={() => abrirDialogoEnviarCorreo(registro)}
                      >
                        Enviar Correo
                      </Button>
                    )}
                  </VStack>
                </HStack>
              </Box>
            ))}
          </VStack>
        )}

        {/* Modal de envío de correo */}
        <Modal isOpen={isOpenEnviar} onClose={onCloseEnviar} size="lg">
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>Enviar Correo de Registro</ModalHeader>
            <ModalBody>
              <VStack spacing={4}>
                <Alert status="info" borderRadius="md">
                  <AlertIcon />
                  <AlertDescription>
                    Se enviará un correo con un enlace de registro al candidato. El enlace expirará en 24 horas.
                  </AlertDescription>
                </Alert>

                <FormControl isRequired>
                  <FormLabel>Nombre</FormLabel>
                  <Input
                    value={formEnvio.nombre}
                    onChange={(e) => setFormEnvio({...formEnvio, nombre: e.target.value})}
                    placeholder="Nombre del candidato"
                  />
                </FormControl>

                <FormControl isRequired>
                  <FormLabel>Rol</FormLabel>
                  <Select
                    value={formEnvio.rol}
                    onChange={(e) => setFormEnvio({...formEnvio, rol: e.target.value})}
                  >
                    <option value="vendedor">Vendedor</option>
                    <option value="admin">Administrador</option>
                    <option value="invitado">Invitado</option>
                  </Select>
                </FormControl>

                {registroSeleccionado && (
                  <Box p={4} bg="gray.50" borderRadius="md" w="100%">
                    <Text fontSize="sm" color="gray.600" mb={2}>
                      <strong>Correo destino:</strong> {registroSeleccionado.email}
                    </Text>
                  </Box>
                )}
              </VStack>
            </ModalBody>
            <ModalFooter>
              <Button variant="ghost" onClick={onCloseEnviar} mr={3}>
                Cancelar
              </Button>
              <Button
                colorScheme="blue"
                onClick={handleEnviarCorreo}
                isLoading={enviando}
                loadingText="Enviando..."
                leftIcon={<EmailIcon />}
              >
                Enviar Correo
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      </Container>
    </Box>
  );
}

export default AdminReclutamiento;