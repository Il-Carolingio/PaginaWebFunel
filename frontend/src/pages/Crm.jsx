import { useState, useEffect } from 'react';
import { Box, Heading, Text, VStack, HStack, Badge, Tabs, TabList, TabPanels, Tab, TabPanel, Button, Modal, ModalOverlay, ModalContent, ModalHeader, ModalBody, ModalFooter, useDisclosure, FormControl, FormLabel, Input, Select, Textarea, useToast, Container } from '@chakra-ui/react';
import { AddIcon } from '@chakra-ui/icons';
import { useAuth } from '../context/AuthContext';

function Crm() {
  const [tareas, setTareas] = useState([]);
  const [cargando, setCargando] = useState(true);
  const { usuario, login, logout, actualizarUsuario } = useAuth();
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

  const [formLogin, setFormLogin] = useState({
    email: '',
    password: ''
  });

  const [loginCargando, setLoginCargando] = useState(false);

  // Estado para edición de perfil
  const [modoEdicion, setModoEdicion] = useState(false);
  const [formPerfil, setFormPerfil] = useState({
    nombre: '',
    telefono: '',
    direccion: '',
    contrato: ''
  });
  const [guardandoPerfil, setGuardandoPerfil] = useState(false);

  useEffect(() => {
    if (usuario) {
      cargarTareas();
    }
  }, [usuario]);

  // Cargar datos del usuario en el formulario cuando se activa el modo edición
  useEffect(() => {
    if (modoEdicion && usuario) {
      setFormPerfil({
        nombre: usuario.nombre || '',
        telefono: usuario.telefono || '',
        direccion: usuario.direccion || '',
        contrato: usuario.contrato || ''
      });
    }
  }, [modoEdicion, usuario]);

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

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoginCargando(true);

    const resultado = await login(formLogin.email, formLogin.password);

    if (resultado.success) {
      toast({
        title: 'Inicio de sesión exitoso',
        status: 'success',
        duration: 3000
      });
      setFormLogin({ email: '', password: '' });
    } else {
      toast({
        title: resultado.message,
        status: 'error',
        duration: 5000
      });
    }

    setLoginCargando(false);
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

  const handleLogout = () => {
    logout();
    toast({
      title: 'Sesión cerrada',
      status: 'info',
      duration: 3000
    });
  };

  const handleEditarPerfil = () => {
    setModoEdicion(true);
  };

  const handleCancelarEdicion = () => {
    setModoEdicion(false);
    setFormPerfil({
      nombre: '',
      telefono: '',
      direccion: '',
      contrato: ''
    });
  };

  const handleGuardarPerfil = async () => {
    setGuardandoPerfil(true);
    try {
      const token = localStorage.getItem('token');
      const res = await fetch('http://localhost:5000/api/vendedor/perfil', {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formPerfil)
      });

      const data = await res.json();
      if (data.success) {
        toast({
          title: 'Perfil actualizado exitosamente',
          status: 'success',
          duration: 3000
        });
        // Actualizar el contexto sin recargar la página
        actualizarUsuario(data.usuario);
        setModoEdicion(false);
      } else {
        toast({
          title: data.message || 'Error al actualizar perfil',
          status: 'error',
          duration: 5000
        });
      }
    } catch (error) {
      toast({
        title: 'Error al actualizar perfil',
        status: 'error',
        duration: 3000
      });
    } finally {
      setGuardandoPerfil(false);
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

  // Si no hay usuario, mostrar login
  if (!usuario) {
    return (
      <Box minH="100vh" bg="gray.50" display="flex" alignItems="center" justifyContent="center" p={4}>
        <Container maxW="md">
          <Box bg="white" p={8} borderRadius="xl" boxShadow="2xl">
            <VStack spacing={6}>
              <Box textAlign="center">
                <Heading as="h1" size="xl" color="orange.500" mb={2}>
                  CRM Royal Prestige
                </Heading>
                <Text color="gray.600">Inicia sesión para acceder al panel de vendedores</Text>
              </Box>

              <form onSubmit={handleLogin} style={{ width: '100%' }}>
                <VStack spacing={4}>
                  <Input
                    type="email"
                    placeholder="Correo electrónico"
                    value={formLogin.email}
                    onChange={(e) => setFormLogin({...formLogin, email: e.target.value})}
                    required
                    size="lg"
                  />
                  <Input
                    type="password"
                    placeholder="Contraseña"
                    value={formLogin.password}
                    onChange={(e) => setFormLogin({...formLogin, password: e.target.value})}
                    required
                    size="lg"
                  />
                  <Button
                    type="submit"
                    colorScheme="orange"
                    size="lg"
                    width="100%"
                    isLoading={loginCargando}
                    _hover={{ transform: 'scale(1.02)' }}
                    transition="all 0.2s"
                  >
                    Iniciar Sesión
                  </Button>
                </VStack>
              </form>

              <Text fontSize="sm" color="gray.500" textAlign="center">
                ¿Problemas para acceder? Contacta al administrador
              </Text>
            </VStack>
          </Box>
        </Container>
      </Box>
    );
  }

  // Si hay usuario, mostrar dashboard
  return (
    <Box minH="100vh" bg="gray.50" p={{ base: 4, md: 8 }}>
      <Box maxW="1200px" mx="auto">
        {/* Encabezado */}
        <Box mb={8} display="flex" justifyContent="space-between" alignItems="center">
          <Box>
            <Heading as="h1" size="xl" color="orange.500" mb={2}>
              Dashboard CRM
            </Heading>
            <Text color="gray.600">
              Bienvenido, {usuario.nombre}
            </Text>
          </Box>
          <Button colorScheme="red" variant="outline" onClick={handleLogout}>
            Cerrar Sesión
          </Button>
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
                  <Box display="flex" justifyContent="space-between" alignItems="center">
                    <Heading as="h3" size="lg">Mi Perfil</Heading>
                    {!modoEdicion && (
                      <Button colorScheme="orange" size="sm" onClick={handleEditarPerfil}>
                        Editar
                      </Button>
                    )}
                  </Box>

                  {modoEdicion ? (
                    // Modo edición
                    <>
                      <FormControl isRequired>
                        <FormLabel>Nombre</FormLabel>
                        <Input
                          value={formPerfil.nombre}
                          onChange={(e) => setFormPerfil({...formPerfil, nombre: e.target.value})}
                          placeholder="Nombre completo"
                        />
                      </FormControl>

                      <FormControl>
                        <FormLabel>Email (no modificable)</FormLabel>
                        <Input
                          value={usuario.email}
                          isReadOnly
                          bg="gray.100"
                        />
                      </FormControl>

                      <FormControl>
                        <FormLabel>Teléfono</FormLabel>
                        <Input
                          value={formPerfil.telefono}
                          onChange={(e) => setFormPerfil({...formPerfil, telefono: e.target.value})}
                          placeholder="Ej: 4421234567"
                        />
                      </FormControl>

                      <FormControl>
                        <FormLabel>Dirección</FormLabel>
                        <Input
                          value={formPerfil.direccion}
                          onChange={(e) => setFormPerfil({...formPerfil, direccion: e.target.value})}
                          placeholder="Dirección completa"
                        />
                      </FormControl>

                      <FormControl>
                        <FormLabel>Contrato</FormLabel>
                        <Input
                          value={formPerfil.contrato}
                          onChange={(e) => setFormPerfil({...formPerfil, contrato: e.target.value})}
                          placeholder="Número de contrato (opcional)"
                        />
                      </FormControl>

                      <HStack spacing={3} pt={4}>
                        <Button
                          colorScheme="orange"
                          onClick={handleGuardarPerfil}
                          isLoading={guardandoPerfil}
                        >
                          Guardar
                        </Button>
                        <Button variant="ghost" onClick={handleCancelarEdicion}>
                          Cancelar
                        </Button>
                      </HStack>
                    </>
                  ) : (
                    // Modo visualización
                    <>
                      <Box>
                        <Text fontWeight="bold">Nombre:</Text>
                        <Text>{usuario.nombre}</Text>
                      </Box>
                      <Box>
                        <Text fontWeight="bold">Email:</Text>
                        <Text>{usuario.email}</Text>
                      </Box>
                      <Box>
                        <Text fontWeight="bold">Teléfono:</Text>
                        <Text>{usuario.telefono || 'No especificado'}</Text>
                      </Box>
                      <Box>
                        <Text fontWeight="bold">Dirección:</Text>
                        <Text>{usuario.direccion || 'No especificada'}</Text>
                      </Box>
                      <Box>
                        <Text fontWeight="bold">Contrato:</Text>
                        <Text>{usuario.contrato || 'No especificado'}</Text>
                      </Box>
                    </>
                  )}
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

export default Crm;