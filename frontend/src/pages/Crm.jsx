import { useState, useEffect } from 'react';
import { Box, Heading, Text, VStack, HStack, Badge, Tabs, TabList, TabPanels, Tab, TabPanel, Button, Modal, ModalOverlay, ModalContent, ModalHeader, ModalBody, ModalFooter, useDisclosure, FormControl, FormLabel, Input, Select, Textarea, useToast, Container, Progress, Alert, AlertIcon } from '@chakra-ui/react';
import { AddIcon, EditIcon } from '@chakra-ui/icons';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useAuth } from '../context/AuthContext';

function Crm() {
  const [tareas, setTareas] = useState([]); // lista completa para contadores
  const [tareasFiltradas, setTareasFiltradas] = useState([]); // lista a mostrar
  const [filtroEstado, setFiltroEstado] = useState('todas');
  const [cargando, setCargando] = useState(true);
  const { usuario, login, logout, actualizarUsuario } = useAuth();
  const toast = useToast();
  const { isOpen: isOpenCrear, onOpen: onOpenCrear, onClose: onCloseCrear } = useDisclosure();
  const { isOpen: isOpenEditar, onOpen: onOpenEditar, onClose: onCloseEditar } = useDisclosure();

  const [formTarea, setFormTarea] = useState({
    tipo: 'cita',
    titulo: '',
    descripcion: '',
    fecha: '',
    hora: '',
    prospectoId: '',
    ubicacion: ''
  });

  const [formEditar, setFormEditar] = useState({
    _id: '',
    tipo: 'cita',
    titulo: '',
    descripcion: '',
    fecha: '',
    hora: '',
    ubicacion: '',
    estado: 'pendiente'
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

  // Aplicar filtro cuando cambien tareas o el filtro
  useEffect(() => {
    if (filtroEstado === 'todas') {
      setTareasFiltradas(tareas);
    } else {
      setTareasFiltradas(tareas.filter(t => t.estado === filtroEstado));
    }
  }, [tareas, filtroEstado]);

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
        // Ordenar: pendientes más antiguas primero, luego las de hoy, luego completadas
        const ordenadas = ordenarTareas(data.data);
        setTareas(ordenadas);
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

  const ordenarTareas = (tareasList) => {
    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0);

    return [...tareasList].sort((a, b) => {
      const fechaA = new Date(a.fecha);
      const fechaB = new Date(b.fecha);
      fechaA.setHours(0, 0, 0, 0);
      fechaB.setHours(0, 0, 0, 0);

      // Pendientes primero
      if (a.estado === 'pendiente' && b.estado !== 'pendiente') return -1;
      if (a.estado !== 'pendiente' && b.estado === 'pendiente') return 1;

      // Si ambas son pendientes: las más antiguas primero
      if (a.estado === 'pendiente' && b.estado === 'pendiente') {
        return fechaA - fechaB;
      }

      // Si no son pendientes, ordenar por fecha descendente
      return fechaB - fechaA;
    });
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
        onCloseCrear();
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

  const handleEditarTarea = (tarea) => {
    const fechaLocal = new Date(tarea.fecha).toISOString().split('T')[0];
    setFormEditar({
      _id: tarea._id,
      tipo: tarea.tipo,
      titulo: tarea.titulo,
      descripcion: tarea.descripcion || '',
      fecha: fechaLocal,
      hora: tarea.hora || '',
      ubicacion: tarea.ubicacion || '',
      estado: tarea.estado
    });
    onOpenEditar();
  };

  const handleGuardarEdicion = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`http://localhost:5000/api/tareas/${formEditar._id}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          tipo: formEditar.tipo,
          titulo: formEditar.titulo,
          descripcion: formEditar.descripcion,
          fecha: formEditar.fecha,
          hora: formEditar.hora,
          ubicacion: formEditar.ubicacion,
          estado: formEditar.estado
        })
      });

      const data = await res.json();
      if (data.success) {
        toast({
          title: 'Tarea actualizada exitosamente',
          status: 'success',
          duration: 3000
        });
        onCloseEditar();
        cargarTareas();
      } else {
        toast({
          title: data.message || 'Error al actualizar tarea',
          status: 'error',
          duration: 5000
        });
      }
    } catch (error) {
      toast({
        title: 'Error al actualizar tarea',
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
  const tareasCanceladas = tareas.filter(t => t.estado === 'cancelada');

  const getColorTipo = (tipo) => {
    const colores = {
      cita: 'blue',
      llamada: 'green',
      seguimiento: 'purple',
      evento: 'orange',
      entrevista: 'pink',
      contrato: 'red'
    };
    return colores[tipo] || 'gray';
  };

  const getLabelTipo = (tipo) => {
    const labels = {
      cita: 'Cita',
      llamada: 'Llamada',
      seguimiento: 'Seguimiento',
      evento: 'Evento',
      entrevista: 'Entrevista',
      contrato: 'Contrato'
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
          <Box flex="1" minW="200px" bg="white" p={6} borderRadius="xl" boxShadow="md" cursor="pointer" onClick={() => setFiltroEstado('pendiente')}>
            <Text color="gray.600" fontSize="sm" mb={1}>Pendientes</Text>
            <Heading as="h2" size="2xl" color="orange.500">{tareasPendientes.length}</Heading>
          </Box>
          <Box flex="1" minW="200px" bg="white" p={6} borderRadius="xl" boxShadow="md" cursor="pointer" onClick={() => setFiltroEstado('completada')}>
            <Text color="gray.600" fontSize="sm" mb={1}>Completadas</Text>
            <Heading as="h2" size="2xl" color="green.500">{tareasCompletadas.length}</Heading>
          </Box>
          <Box flex="1" minW="200px" bg="white" p={6} borderRadius="xl" boxShadow="md" cursor="pointer" onClick={() => setFiltroEstado('cancelada')}>
            <Text color="gray.600" fontSize="sm" mb={1}>Canceladas</Text>
            <Heading as="h2" size="2xl" color="red.500">{tareasCanceladas.length}</Heading>
          </Box>
          <Box flex="1" minW="200px" bg="white" p={6} borderRadius="xl" boxShadow="md" cursor="pointer" onClick={() => setFiltroEstado('todas')}>
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
                  onClick={onOpenCrear}
                >
                  Nueva Tarea
                </Button>
              </Box>

              {cargando ? (
                <Text>Cargando...</Text>
              ) : (
                <VStack spacing={4} align="stretch">
                  {tareasFiltradas.length === 0 ? (
                    <Box bg="white" p={8} borderRadius="xl" textAlign="center">
                      <Text color="gray.500">No tienes tareas aún. Crea tu primera tarea.</Text>
                    </Box>
                  ) : (
                    tareasFiltradas.map(tarea => (
                      <Box key={tarea._id} bg="white" p={6} borderRadius="xl" boxShadow="md">
                        <HStack justify="space-between" align="start">
                          <VStack align="start" spacing={2} flex="1">
                            <HStack>
                              <Badge colorScheme={getColorTipo(tarea.tipo)}>
                                {getLabelTipo(tarea.tipo)}
                              </Badge>
                              <Badge colorScheme={tarea.estado === 'pendiente' ? 'yellow' : tarea.estado === 'completada' ? 'green' : 'red'}>
                                {tarea.estado === 'pendiente' ? 'Pendiente' : tarea.estado === 'completada' ? 'Completada' : 'Cancelada'}
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
                          <Button
                            colorScheme="orange"
                            variant="ghost"
                            size="sm"
                            leftIcon={<EditIcon />}
                            onClick={() => handleEditarTarea(tarea)}
                          >
                            Editar
                          </Button>
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

      {/* Modal de Crear Tarea */}
      <Modal isOpen={isOpenCrear} onClose={onCloseCrear} size="lg">
        <ModalOverlay />
        <ModalContent>
          <form onSubmit={handleSubmitTarea}>
            <ModalHeader>Nueva Tarea</ModalHeader>
            <ModalBody>
              <VStack spacing={4}>
                <FormControl isRequired>
                  <FormLabel>Tipo de tarea</FormLabel>
                  <Select
                    value={formTarea.tipo}
                    onChange={(e) => setFormTarea({...formTarea, tipo: e.target.value})}
                  >
                    <option value="llamada">📞 Llamada</option>
                    <option value="cita">📅 Cita</option>
                    <option value="evento">🎪 Evento</option>
                    <option value="entrevista">🎤 Entrevista</option>
                    <option value="contrato">📝 Contrato</option>
                    <option value="seguimiento">🔄 Seguimiento</option>
                  </Select>
                </FormControl>

                <FormControl isRequired>
                  <FormLabel>Título</FormLabel>
                  <Input
                    value={formTarea.titulo}
                    onChange={(e) => setFormTarea({...formTarea, titulo: e.target.value})}
                    placeholder="Título de la tarea"
                  />
                </FormControl>

                <FormControl>
                  <FormLabel>Descripción</FormLabel>
                  <Textarea
                    value={formTarea.descripcion}
                    onChange={(e) => setFormTarea({...formTarea, descripcion: e.target.value})}
                    placeholder="Descripción o comentarios"
                  />
                </FormControl>

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

                <FormControl>
                  <FormLabel>Ubicación</FormLabel>
                  <Input
                    value={formTarea.ubicacion}
                    onChange={(e) => setFormTarea({...formTarea, ubicacion: e.target.value})}
                    placeholder="Dirección o lugar"
                  />
                </FormControl>
              </VStack>
            </ModalBody>
            <ModalFooter>
              <Button type="submit" colorScheme="orange" mr={3}>
                Guardar
              </Button>
              <Button variant="ghost" onClick={onCloseCrear}>
                Cancelar
              </Button>
            </ModalFooter>
          </form>
        </ModalContent>
      </Modal>

      {/* Modal de Editar Tarea */}
      <Modal isOpen={isOpenEditar} onClose={onCloseEditar} size="lg">
        <ModalOverlay />
        <ModalContent>
          <form onSubmit={handleGuardarEdicion}>
            <ModalHeader>Editar Tarea</ModalHeader>
            <ModalBody>
              <VStack spacing={4}>
                <FormControl isRequired>
                  <FormLabel>Tipo de tarea (evolución)</FormLabel>
                  <Select
                    value={formEditar.tipo}
                    onChange={(e) => setFormEditar({...formEditar, tipo: e.target.value})}
                  >
                    <option value="llamada">📞 Llamada</option>
                    <option value="cita">📅 Cita</option>
                    <option value="evento">🎪 Evento</option>
                    <option value="entrevista">🎤 Entrevista</option>
                    <option value="contrato">📝 Contrato</option>
                    <option value="seguimiento">🔄 Seguimiento</option>
                  </Select>
                </FormControl>

                <FormControl isRequired>
                  <FormLabel>Título</FormLabel>
                  <Input
                    value={formEditar.titulo}
                    onChange={(e) => setFormEditar({...formEditar, titulo: e.target.value})}
                    placeholder="Título de la tarea"
                  />
                </FormControl>

                <FormControl>
                  <FormLabel>Descripción / Comentarios</FormLabel>
                  <Textarea
                    value={formEditar.descripcion}
                    onChange={(e) => setFormEditar({...formEditar, descripcion: e.target.value})}
                    placeholder="Descripción o comentarios"
                  />
                </FormControl>

                <FormControl isRequired>
                  <FormLabel>Fecha</FormLabel>
                  <Input
                    type="date"
                    value={formEditar.fecha}
                    onChange={(e) => setFormEditar({...formEditar, fecha: e.target.value})}
                  />
                </FormControl>

                <FormControl>
                  <FormLabel>Hora</FormLabel>
                  <Input
                    type="time"
                    value={formEditar.hora}
                    onChange={(e) => setFormEditar({...formEditar, hora: e.target.value})}
                  />
                </FormControl>

                <FormControl>
                  <FormLabel>Ubicación</FormLabel>
                  <Input
                    value={formEditar.ubicacion}
                    onChange={(e) => setFormEditar({...formEditar, ubicacion: e.target.value})}
                    placeholder="Dirección o lugar"
                  />
                </FormControl>

                <FormControl>
                  <FormLabel>Estado</FormLabel>
                  <Select
                    value={formEditar.estado}
                    onChange={(e) => setFormEditar({...formEditar, estado: e.target.value})}
                  >
                    <option value="pendiente">⏳ Pendiente</option>
                    <option value="cancelada">❌ Cancelada</option>
                  </Select>
                </FormControl>
              </VStack>
            </ModalBody>
            <ModalFooter>
              <Button type="submit" colorScheme="orange" mr={3}>
                Guardar Cambios
              </Button>
              <Button variant="ghost" onClick={onCloseEditar}>
                Cancelar
              </Button>
            </ModalFooter>
          </form>
        </ModalContent>
      </Modal>
    </Box>
  );
}

export default Crm;