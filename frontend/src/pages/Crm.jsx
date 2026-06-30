import { useState, useEffect } from 'react';
import { Box, Heading, Text, VStack, HStack, Badge, Tabs, TabList, TabPanels, Tab, TabPanel, Button, Modal, ModalOverlay, ModalContent, ModalHeader, ModalBody, ModalFooter, useDisclosure, FormControl, FormLabel, Input, Select, Textarea, useToast, Container, Progress, Alert, AlertIcon } from '@chakra-ui/react';
import { AddIcon } from '@chakra-ui/icons';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
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

  // Estado para cambio de contraseña
  const [modoCambioPassword, setModoCambioPassword] = useState(false);
  const [cambiandoPassword, setCambiandoPassword] = useState(false);

  const passwordSchema = yup.object().shape({
    passwordActual: yup.string().required('La contraseña actual es requerida'),
    passwordNuevo: yup.string()
      .required('La nueva contraseña es requerida')
      .min(8, 'Mínimo 8 caracteres')
      .matches(/[A-Z]/, 'Debe contener al menos una mayúscula')
      .matches(/[a-z]/, 'Debe contener al menos una minúscula')
      .matches(/[0-9]/, 'Debe contener al menos un número')
      .matches(/[^A-Za-z0-9]/, 'Debe contener al menos un carácter especial'),
    confirmarPassword: yup.string()
      .required('Confirma la nueva contraseña')
      .oneOf([yup.ref('passwordNuevo')], 'Las contraseñas no coinciden')
  });

  const { register: registerPassword, handleSubmit: handleSubmitPassword, formState: { errors: errorsPassword }, watch: watchPassword, reset: resetPassword } = useForm({
    resolver: yupResolver(passwordSchema)
  });

  const passwordNuevo = watchPassword('passwordNuevo');

  const getFortalezaPassword = (password) => {
    if (!password) return 0;
    let fortaleza = 0;
    if (password.length >= 8) fortaleza += 20;
    if (/[A-Z]/.test(password)) fortaleza += 20;
    if (/[a-z]/.test(password)) fortaleza += 20;
    if (/[0-9]/.test(password)) fortaleza += 20;
    if (/[^A-Za-z0-9]/.test(password)) fortaleza += 20;
    return fortaleza;
  };

  const getColorFortaleza = (fortaleza) => {
    if (fortaleza <= 20) return 'red';
    if (fortaleza <= 40) return 'orange';
    if (fortaleza <= 60) return 'yellow';
    if (fortaleza <= 80) return 'blue';
    return 'green';
  };

  const getLabelFortaleza = (fortaleza) => {
    if (fortaleza <= 20) return 'Muy débil';
    if (fortaleza <= 40) return 'Débil';
    if (fortaleza <= 60) return 'Regular';
    if (fortaleza <= 80) return 'Buena';
    return 'Excelente';
  };

  const handleCambiarPassword = async (data) => {
    setCambiandoPassword(true);
    try {
      const token = localStorage.getItem('token');
      const res = await fetch('http://localhost:5000/api/auth/cambiar-password', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          passwordActual: data.passwordActual,
          passwordNuevo: data.passwordNuevo
        })
      });

      const result = await res.json();
      if (result.success) {
        toast({
          title: 'Contraseña actualizada exitosamente',
          description: 'Por seguridad, deberás iniciar sesión nuevamente',
          status: 'success',
          duration: 5000
        });
        setModoCambioPassword(false);
        resetPassword();
        // Cerrar sesión después de cambiar contraseña
        setTimeout(() => {
          handleLogout();
        }, 2000);
      } else {
        toast({
          title: result.message || 'Error al cambiar contraseña',
          status: 'error',
          duration: 5000
        });
      }
    } catch (error) {
      toast({
        title: 'Error al cambiar contraseña',
        status: 'error',
        duration: 3000
      });
    } finally {
      setCambiandoPassword(false);
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

                      {/* Sección de cambio de contraseña */}
                      <Box mt={6} pt={6} borderTop="1px solid" borderColor="gray.200">
                        <Heading as="h4" size="md" mb={4}>Cambiar Contraseña</Heading>
                        {!modoCambioPassword ? (
                          <Button colorScheme="orange" onClick={() => setModoCambioPassword(true)}>
                            Cambiar Contraseña
                          </Button>
                        ) : (
                          <Box as="form" onSubmit={handleSubmitPassword(handleCambiarPassword)}>
                            <VStack spacing={4} align="stretch">
                              <FormControl isInvalid={!!errorsPassword.passwordActual}>
                                <FormLabel>Contraseña Actual</FormLabel>
                                <Input
                                  type="password"
                                  {...registerPassword('passwordActual')}
                                  placeholder="Ingresa tu contraseña actual"
                                />
                                {errorsPassword.passwordActual && (
                                  <Text color="red.500" fontSize="sm">{errorsPassword.passwordActual.message}</Text>
                                )}
                              </FormControl>

                              <FormControl isInvalid={!!errorsPassword.passwordNuevo}>
                                <FormLabel>Nueva Contraseña</FormLabel>
                                <Input
                                  type="password"
                                  {...registerPassword('passwordNuevo')}
                                  placeholder="Ingresa la nueva contraseña"
                                />
                                {errorsPassword.passwordNuevo && (
                                  <Text color="red.500" fontSize="sm">{errorsPassword.passwordNuevo.message}</Text>
                                )}
                                {passwordNuevo && (
                                  <Box mt={2}>
                                    <Text fontSize="sm" mb={1}>Fortaleza de la contraseña:</Text>
                                    <Progress
                                      value={getFortalezaPassword(passwordNuevo)}
                                      colorScheme={getColorFortaleza(getFortalezaPassword(passwordNuevo))}
                                      size="sm"
                                      borderRadius="md"
                                    />
                                    <Text fontSize="xs" color="gray.600" mt={1}>
                                      {getLabelFortaleza(getFortalezaPassword(passwordNuevo))}
                                    </Text>
                                  </Box>
                                )}
                              </FormControl>

                              <FormControl isInvalid={!!errorsPassword.confirmarPassword}>
                                <FormLabel>Confirmar Nueva Contraseña</FormLabel>
                                <Input
                                  type="password"
                                  {...registerPassword('confirmarPassword')}
                                  placeholder="Confirma la nueva contraseña"
                                />
                                {errorsPassword.confirmarPassword && (
                                  <Text color="red.500" fontSize="sm">{errorsPassword.confirmarPassword.message}</Text>
                                )}
                              </FormControl>

                              <Alert status="info" borderRadius="md">
                                <AlertIcon />
                                <Text fontSize="sm">
                                  La contraseña debe contener: 8 caracteres, una mayúscula, una minúscula, un número y un carácter especial.
                                </Text>
                              </Alert>

                              <HStack spacing={3} pt={2}>
                                <Button
                                  type="submit"
                                  colorScheme="orange"
                                  isLoading={cambiandoPassword}
                                >
                                  Cambiar Contraseña
                                </Button>
                                <Button
                                  variant="ghost"
                                  onClick={() => {
                                    setModoCambioPassword(false);
                                    resetPassword();
                                  }}
                                >
                                  Cancelar
                                </Button>
                              </HStack>
                            </VStack>
                          </Box>
                        )}
                      </Box>
                    </>
                  )}
                </VStack>
              </Box>
            </TabPanel>
          </TabPanels>
        </Tabs>
      </Box>
    </Box>
  );
}

export default Crm;