import { useState, useEffect } from 'react';
import { Box, Container, Heading, Text, VStack, FormControl, FormLabel, Input, Select, Button, Alert, AlertIcon, AlertDescription, useToast, Spinner, Center } from '@chakra-ui/react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { validarTokenRegistro, completarRegistro } from '../services/reclutamientoService.js';

// Esquema de validación
const schema = yup.object().shape({
  password: yup.string()
    .required('La contraseña es requerida')
    .min(6, 'Mínimo 6 caracteres')
    .matches(/[A-Z]/, 'Debe contener al menos una mayúscula')
    .matches(/[a-z]/, 'Debe contener al menos una minúscula')
    .matches(/[0-9]/, 'Debe contener al menos un número'),
  confirmarPassword: yup.string()
    .required('Confirma tu contraseña')
    .oneOf([yup.ref('password')], 'Las contraseñas no coinciden'),
  nombre: yup.string().required('El nombre es requerido'),
  telefono: yup.string().required('El teléfono es requerido'),
  direccion: yup.string()
});

function RegistroVendedor() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  const navigate = useNavigate();
  const toast = useToast();

  const [cargando, setCargando] = useState(true);
  const [validando, setValidando] = useState(true);
  const [datosCandidato, setDatosCandidato] = useState(null);
  const [error, setError] = useState(null);
  const [enviando, setEnviando] = useState(false);

  const { register: registerForm, handleSubmit: handleSubmitForm, formState: { errors: errorsForm } } = useForm({
    resolver: yupResolver(schema)
  });

  // Validar token al cargar la página
  useEffect(() => {
    const validarToken = async () => {
      if (!token) {
        setError('No se proporcionó un token de registro');
        setValidando(false);
        setCargando(false);
        return;
      }

      try {
        const resultado = await validarTokenRegistro(token);
        
        if (resultado.success) {
          setDatosCandidato(resultado.data);
        } else {
          setError(resultado.message || 'Token inválido');
        }
      } catch (error) {
        setError('Error al validar el token. Por favor, intenta de nuevo.');
        console.error('Error validando token:', error);
      } finally {
        setValidando(false);
        setCargando(false);
      }
    };

    validarToken();
  }, [token]);

  const onSubmit = async (data) => {
    setEnviando(true);
    try {
      const resultado = await completarRegistro({
        token: token,
        password: data.password,
        nombre: data.nombre,
        telefono: data.telefono,
        direccion: data.direccion || ''
      });

      if (resultado.success) {
        toast({
          title: '¡Registro exitoso!',
          description: 'Tu cuenta ha sido creada. Ahora puedes iniciar sesión.',
          status: 'success',
          duration: 5000,
          isClosable: true,
          position: 'top'
        });

        // Redirigir al login después de 2 segundos
        setTimeout(() => {
          navigate('/crm');
        }, 2000);
      } else {
        toast({
          title: 'Error en el registro',
          description: resultado.message || 'Error al completar el registro',
          status: 'error',
          duration: 5000,
          isClosable: true,
          position: 'top'
        });
      }
    } catch (error) {
      toast({
        title: 'Error al completar el registro',
        description: error.message || 'Error desconocido',
        status: 'error',
        duration: 5000,
        isClosable: true,
        position: 'top'
      });
    } finally {
      setEnviando(false);
    }
  };

  // Pantalla de carga
  if (cargando || validando) {
    return (
      <Box minH="100vh" bg="gray.50" display="flex" alignItems="center" justifyContent="center">
        <Center>
          <VStack spacing={4}>
            <Spinner size="xl" color="orange.500" thickness="4px" />
            <Text color="gray.600">Validando tu enlace de registro...</Text>
          </VStack>
        </Center>
      </Box>
    );
  }

  // Pantalla de error
  if (error) {
    return (
      <Box minH="100vh" bg="gray.50" display="flex" alignItems="center" justifyContent="center" p={4}>
        <Container maxW="md">
          <Box bg="white" p={8} borderRadius="xl" boxShadow="2xl">
            <VStack spacing={6}>
              <Heading as="h1" size="xl" color="red.500" textAlign="center">
                ⚠️ Error
              </Heading>
              <Alert status="error" borderRadius="md">
                <AlertIcon />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
              <Text color="gray.600" textAlign="center" fontSize="sm">
                Si crees que esto es un error, contacta al administrador.
              </Text>
              <Button
                colorScheme="orange"
                onClick={() => navigate('/crm')}
                width="100%"
              >
                Ir al Inicio
              </Button>
            </VStack>
          </Box>
        </Container>
      </Box>
    );
  }

  // Pantalla de registro
  return (
    <Box minH="100vh" bg="gray.50" py={12} px={4}>
      <Container maxW="md">
        <Box bg="white" p={8} borderRadius="xl" boxShadow="2xl">
          <VStack spacing={6}>
            <Box textAlign="center">
              <Heading as="h1" size="xl" color="orange.500" mb={2}>
                Royal Prestige
              </Heading>
              <Text color="gray.600" fontSize="lg">
                Completa tu Registro
              </Text>
            </Box>

            <Alert status="info" borderRadius="md">
              <AlertIcon />
              <AlertDescription fontSize="sm">
                Bienvenido/a <strong>{datosCandidato?.nombre}</strong>. Completa el formulario para crear tu cuenta.
              </AlertDescription>
            </Alert>

            <form onSubmit={handleSubmitForm(onSubmit)} style={{ width: '100%' }}>
              <VStack spacing={4}>
                <FormControl isRequired isInvalid={errorsForm.nombre}>
                  <FormLabel>Nombre completo</FormLabel>
                  <Input
                    {...registerForm('nombre')}
                    defaultValue={datosCandidato?.nombre}
                    placeholder="Tu nombre completo"
                    size="lg"
                  />
                  {errorsForm.nombre && (
                    <Text color="red.500" fontSize="sm" mt={1}>
                      {errorsForm.nombre.message}
                    </Text>
                  )}
                </FormControl>

                <FormControl isRequired isInvalid={errorsForm.email}>
                  <FormLabel>Correo electrónico</FormLabel>
                  <Input
                    type="email"
                    value={datosCandidato?.email}
                    isReadOnly
                    bg="gray.100"
                    size="lg"
                  />
                  <Text fontSize="xs" color="gray.500" mt={1}>
                    Este correo no se puede modificar
                  </Text>
                </FormControl>

                <FormControl isRequired isInvalid={errorsForm.telefono}>
                  <FormLabel>Teléfono</FormLabel>
                  <Input
                    {...registerForm('telefono')}
                    defaultValue={datosCandidato?.telefono}
                    placeholder="Ej: 4421234567"
                    size="lg"
                  />
                  {errorsForm.telefono && (
                    <Text color="red.500" fontSize="sm" mt={1}>
                      {errorsForm.telefono.message}
                    </Text>
                  )}
                </FormControl>

                <FormControl isInvalid={errorsForm.direccion}>
                  <FormLabel>Dirección (opcional)</FormLabel>
                  <Input
                    {...registerForm('direccion')}
                    placeholder="Tu dirección completa"
                    size="lg"
                  />
                  {errorsForm.direccion && (
                    <Text color="red.500" fontSize="sm" mt={1}>
                      {errorsForm.direccion.message}
                    </Text>
                  )}
                </FormControl>

                <FormControl isRequired isInvalid={errorsForm.password}>
                  <FormLabel>Contraseña</FormLabel>
                  <Input
                    type="password"
                    {...registerForm('password')}
                    placeholder="Mínimo 6 caracteres"
                    size="lg"
                  />
                  {errorsForm.password && (
                    <Text color="red.500" fontSize="sm" mt={1}>
                      {errorsForm.password.message}
                    </Text>
                  )}
                </FormControl>

                <FormControl isRequired isInvalid={errorsForm.confirmarPassword}>
                  <FormLabel>Confirmar contraseña</FormLabel>
                  <Input
                    type="password"
                    {...registerForm('confirmarPassword')}
                    placeholder="Repite tu contraseña"
                    size="lg"
                  />
                  {errorsForm.confirmarPassword && (
                    <Text color="red.500" fontSize="sm" mt={1}>
                      {errorsForm.confirmarPassword.message}
                    </Text>
                  )}
                </FormControl>

                <Button
                  type="submit"
                  colorScheme="orange"
                  size="lg"
                  width="100%"
                  isLoading={enviando}
                  _hover={{ transform: 'scale(1.02)' }}
                  transition="all 0.2s"
                >
                  Completar Registro
                </Button>
              </VStack>
            </form>

            <Text fontSize="xs" color="gray.500" textAlign="center" mt={4}>
              Al completar el registro, aceptas nuestros términos y condiciones.
            </Text>
          </VStack>
        </Box>
      </Container>
    </Box>
  );
}

export default RegistroVendedor;