import { useState, useEffect } from 'react';
import { Box, Heading, Text, VStack, HStack, Badge, Tabs, TabList, TabPanels, Tab, TabPanel, Button, Modal, ModalOverlay, ModalContent, ModalHeader, ModalBody, ModalFooter, useDisclosure, FormControl, FormLabel, Input, Select, Textarea, useToast } from '@chakra-ui/react';
import { AddIcon } from '@chakra-ui/icons';
import { useAuth } from '../context/AuthContext';

function Dashboard() {
  const [tareas, setTareas] = useState([]);
  const [cargando, setCargando] = useState(true);
  const { usuario } = useAuth();
  const toast = useToast();
  const { isOpen, onOpen, onClose } = useDisclosure();

  const [formTarea, setFormTarea] = useState({
    tipo: 'cita',
    titulo: '',
    descripcion: '',
    fecha: '',
    hora: '',
    prospectoId: '',
    ubicacion: ''
  });

  useEffect(() => {
    cargarTareas();
  }, []);

  const cargarTareas = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch('http://localhost:5000/api/tareas', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.success) {
        setTareas(data.data);
      }
    } catch (error) {
      toast({
        title: 'Error al cargar tareas',
        status: 'error',
        duration: 3000
      });
    } finally {
      setCargando(false);
    }
  };

  const handleSubmitTarea = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const res = await fetch('http://localhost:5000/api/tareas', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formTarea)
      });

      const data = await res.json();
      if (data.success) {
        toast({
          title: 'Tarea creada exitosamente',
          status: 'success',
          duration: 3000
        });
        onClose();
        setFormTarea({
          tipo: 'cita',
          titulo: '',
          descripcion: '',
          fecha: '',
          hora: '',
          prospectoId: '',
          ubicacion: ''
        });
        cargarTareas();
      }
    } catch (error) {
      toast({
        title: 'Error al crear tarea',
        status: 'error',
        duration: 3000
      });
    }
  };

  const tareasPendientes = tareas.filter(t => t.estado === 'pendiente');
  const tareasCompletadas = tareas.filter(t => t.estado === 'completada');

  const getColorTipo = (tipo) => {
    const colores = {
      cita: 'blue',
      llamada: 'green',
      seguimiento: 'purple',
      evento: 'orange'
    };
    return colores[tipo] || 'gray';
  };

  const getLabelTipo = (tipo) => {
    const labels = {
      cita: 'Cita',
      llamada: 'Llamada',
      seguimiento: 'Seguimiento',
      evento: 'Evento'
    };
    return labels[tipo] || tipo;
  };

  return (
    <Box minH="100vh" bg="gray.50" p={{ base: 4, md: 8 }}>
      <Box maxW="1200px" mx="auto">
        {/* Encabezado */}
        <Box mb={8}>
          <Heading as="h1" size="xl" color="orange.500" mb={2}>
            Dashboard CRM
          </Heading>
          <Text color="gray.600">
            Bienvenido, {usuario?.nombre}
          </Text>
        </Box>

        {/* Estadísticas */}
        <HStack spacing={4} mb={8} flexWrap="wrap">
          <Box flex="1" minW="200px" bg="white" p={6} borderRadius="xl" boxShadow="md">
            <Text color="gray.600" fontSize="sm" mb={1}>Pendientes</Text>
            <Heading as="h2" size="2xl" color="orange.500">{tareasPendientes.length}</Heading>
          </Box>
          <Box flex="1" minW="200px" bg="white" p={6} borderRadius="xl" boxShadow="md">
            <Text color="gray.600" fontSize="sm" mb={1}>Completadas</Text>
            <Heading as="h2" size="2xl" color="green.500">{tareasCompletadas.length}</Heading>
          </Box>
          <Box flex="1" minW="200px" bg="white" p={6} borderRadius="xl" boxShadow="md">
            <Text color="gray.600" fontSize="sm" mb={1}>Total</Text>
            <Heading as="h2" size="2xl" color="blue.500">{tareas.length}</Heading>
          </Box>
        </HStack>

        {/* Tabs */}
        <Tabs colorScheme="orange" variant="enclosed">
          <TabList>
            <Tab>Mis Tareas</Tab>
            <Tab>Perfil</Tab>
          </TabList>

          <TabPanels>
            {/* Panel de Tareas */}
            <TabPanel>
              <Box mb={4} display="flex" justifyContent="flex-end">
                <Button
                  colorScheme="orange"
                  leftIcon={<AddIcon />}
                  onClick={onOpen}
                >
                  Nueva Tarea
                </Button>
              </Box>

              {cargando ? (
                <Text>Cargando...</Text>
              ) : (
                <VStack spacing={4} align="stretch">
                  {tareas.length === 0 ? (
                    <Box bg="white" p={8} borderRadius="xl" textAlign="center">
                      <Text color="gray.500">No tienes tareas aún. Crea tu primera tarea.</Text>
                    </Box>
                  ) : (
                    tareas.map(tarea => (
                      <Box key={tarea._id} bg="white" p={6} borderRadius="xl" boxShadow="md">
                        <HStack justify="space-between" align="start">
                          <VStack align="start" spacing={2}>
                            <HStack>
                              <Badge colorScheme={getColorTipo(tarea.tipo)}>
                                {getLabelTipo(tarea.tipo)}
                              </Badge>
                              <Badge colorScheme={tarea.estado === 'pendiente' ? 'yellow' : 'green'}>
                                {tarea.estado}
                              </Badge>
                            </HStack>
                            <Heading as="h3" size="md">{tarea.titulo}</Heading>
                            {tarea.descripcion && (
                              <Text color="gray.600" fontSize="sm">{tarea.descripcion}</Text>
                            )}
                            <Text fontSize="sm" color="gray.500">
                              📅 {new Date(tarea.fecha).toLocaleDateString('es-MX')}
                              {tarea.hora && ` - 🕐 ${tarea.hora}`}
                            </Text>
                            {tarea.prospectoId && (
                              <Text fontSize="sm" color="blue.600">
                                👤 {tarea.prospectoId.nombre} - {tarea.prospectoId.telefono}
                              </Text>
                            )}
                          </VStack>
                        </HStack>
                      </Box>
                    ))
                  )}
                </VStack>
              )}
            </TabPanel>

            {/* Panel de Perfil */}
            <TabPanel>
              <Box bg="white" p={8} borderRadius="xl" boxShadow="md">
                <VStack spacing={4} align="stretch">
                  <Heading as="h3" size="lg" mb={4}>Mi Perfil</Heading>
                  <Box>
                    <Text fontWeight="bold">Nombre:</Text>
                    <Text>{usuario?.nombre}</Text>
                  </Box>
                  <Box>
                    <Text fontWeight="bold">Email:</Text>
                    <Text>{usuario?.email}</Text>
                  </Box>
                  <Box>
                    <Text fontWeight="bold">Teléfono:</Text>
                    <Text>{usuario?.telefono || 'No especificado'}</Text>
                  </Box>
                  <Box>
                    <Text fontWeight="bold">Dirección:</Text>
                    <Text>{usuario?.direccion || 'No especificada'}</Text>
                  </Box>
                  <Box>
                    <Text fontWeight="bold">Contrato:</Text>
                    <Text>{usuario?.contrato || 'No especificado'}</Text>
                  </Box>
                </VStack>
              </Box>
            </TabPanel>
          </TabPanels>
        </Tabs>

        {/* Modal para crear tarea */}
        <Modal isOpen={isOpen} onClose={onClose} size="lg">
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>Nueva Tarea</ModalHeader>
            <form onSubmit={handleSubmitTarea}>
              <ModalBody>
                <VStack spacing={4}>
                  <FormControl isRequired>
                    <FormLabel>Tipo</FormLabel>
                    <Select
                      value={formTarea.tipo}
                      onChange={(e) => setFormTarea({...formTarea, tipo: e.target.value})}
                    >
                      <option value="cita">Cita</option>
                      <option value="llamada">Llamada</option>
                      <option value="seguimiento">Seguimiento</option>
                      <option value="evento">Evento</option>
                    </Select>
                  </FormControl>

                  <FormControl isRequired>
                    <FormLabel>Título</FormLabel>
                    <Input
                      value={formTarea.titulo}
                      onChange={(e) => setFormTarea({...formTarea, titulo: e.target.value})}
                      placeholder="Ej: Llamar a Juan Pérez"
                    />
                  </FormControl>

                  <FormControl>
                    <FormLabel>Descripción</FormLabel>
                    <Textarea
                      value={formTarea.descripcion}
                      onChange={(e) => setFormTarea({...formTarea, descripcion: e.target.value})}
                      placeholder="Detalles adicionales..."
                    />
                  </FormControl>

                  <HStack w="100%">
                    <FormControl isRequired>
                      <FormLabel>Fecha</FormLabel>
                      <Input
                        type="date"
                        value={formTarea.fecha}
                        onChange={(e) => setFormTarea({...formTarea, fecha: e.target.value})}
                      />
                    </FormControl>

                    <FormControl>
                      <FormLabel>Hora</FormLabel>
                      <Input
                        type="time"
                        value={formTarea.hora}
                        onChange={(e) => setFormTarea({...formTarea, hora: e.target.value})}
                      />
                    </FormControl>
                  </HStack>

                  <FormControl>
                    <FormLabel>Ubicación</FormLabel>
                    <Input
                      value={formTarea.ubicacion}
                      onChange={(e) => setFormTarea({...formTarea, ubicacion: e.target.value})}
                      placeholder="Ej: Oficina central, Casa del cliente..."
                    />
                  </FormControl>
                </VStack>
              </ModalBody>
              <ModalFooter>
                <Button variant="ghost" mr={3} onClick={onClose}>
                  Cancelar
                </Button>
                <Button type="submit" colorScheme="orange">
                  Crear Tarea
                </Button>
              </ModalFooter>
            </form>
          </ModalContent>
        </Modal>
      </Box>
    </Box>
  );
}

export default Dashboard;