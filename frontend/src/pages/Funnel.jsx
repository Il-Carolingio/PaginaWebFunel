// frontend/src/pages/Funnel.jsx
import { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  Select,
  Checkbox,
  CheckboxGroup,
  Stack,
  useToast,
  Heading,
  Text,
  VStack,
  Grid,
  Image,
  HStack,
  Badge,
} from '@chakra-ui/react';
import api from '../services/api';
import multipan from '../assets/images/multiPan.png';

const validationSchema = yup.object({
  nombre: yup.string().required('El nombre es obligatorio'),
  telefono: yup
    .string()
    .required('El teléfono es obligatorio')
    .matches(/^[0-9]{10}$/, 'Ingresa un teléfono válido de 10 dígitos'),
  estadoCivil: yup.string().required('Selecciona tu estado civil'),
  nivelEstudios: yup.string().required('Selecciona tu nivel de estudios'),
  marcasPrefiere: yup.array().of(yup.string()).min(1, 'Por favor selecciona al menos una marca para continuar'),
  gustaCocinar: yup.string().required('Selecciona una opción'),
});

function Funnel() {
  const { register, handleSubmit, reset, control, formState: { isSubmitting, errors } } = useForm({
    resolver: yupResolver(validationSchema),
    defaultValues: {
      marcasPrefiere: [],
    },
    mode: 'onSubmit',
  });
  const toast = useToast();
  const [registroInfo, setRegistroInfo] = useState(null);

  const onSubmit = async (data) => {
    const payload = {
      nombre: data.nombre,
      telefono: data.telefono,
      estadoCivil: data.estadoCivil,
      nivelEstudios: data.nivelEstudios,
      marcasPrefiere: data.marcasPrefiere || [],
      gustaCocinar: data.gustaCocinar === 'true',
    };

    try {
      const response = await api.post('/api/rifa/registro-olla-sarten-salud', payload);
      // Custom surprise toast centered on screen
      toast({
        duration: 9000,
        isClosable: true,
        render: ({ onClose }) => (
          <Box
            position="fixed"
            top="50%"
            left="50%"
            transform="translate(-50%, -50%)"
            bgGradient="linear(to-r, pink.400, purple.500)"
            color="white"
            p={5}
            borderRadius="lg"
            boxShadow="2xl"
            minW="320px"
            zIndex={9999}
          >
            <VStack align="start" spacing={2}>
              <Heading size="sm">🎉 ¡Sorpresa!</Heading>
              <Text fontWeight="bold">{response.data.success ? 'Registro exitoso' : 'Registro recibido'}</Text>
              <Text fontSize="sm">{response.data.message || 'Gracias por participar. Conserva tu número de proceso.'}</Text>
              {response.data.numeroRifa && (
                <Text mt={2} fontSize="lg" fontWeight="extrabold">#{response.data.numeroRifa}</Text>
              )}
              <Text fontSize="sm" opacity={0.95} mt={1}>¡Te deseamos la mejor de las suertes en la rifa!</Text>
            </VStack>
            <Button variant="ghost" color="white" onClick={onClose} position="absolute" top="8px" right="10px">✖</Button>
          </Box>
        ),
      });
      setRegistroInfo({
        numeroRifa: response.data.numeroRifa,
      });
      reset();
    } catch (error) {
      toast({
        title: 'Error',
        description: error.response?.data?.error || 'Ocurrió un error al registrar',
        status: 'error',
        duration: 6000,
        isClosable: true,
      });
    }
  };

  return (
    <>
      <Box
        position="fixed"
        top="0"
        left="0"
        w="100vw"
        h="100vh"
        bgImage={`url(${multipan})`}
        bgPosition="center"
        bgRepeat="no-repeat"
        bgSize="cover"
        zIndex={0}
        pointerEvents="none"  // ✅ Permite interactuar con el menú
      />
      <Box
        position="relative"
        minH="100vh"
        w="100%"
        mx="auto"
        maxW="1200px"
        zIndex={1}
      >
        <VStack spacing={0} align="stretch" bg="transparent" position="relative">
          {/* Hero Banner */}
          <Box
            bgImage="url('https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=1200&h=400&fit=crop')"
            bgSize="cover"
            backgroundColor="rgba(255, 255, 255, 0.15)"
            bgPosition="center"
            h="600px"
            display="flex"
            alignItems="center"
            justifyContent="center"
            pos="relative"
            borderRadius="2xl"
            _before={{
              content: '""',
              pos: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              bg: 'linear-gradient(135deg, rgba(59, 130, 246, 0.85) 0%, rgba(147, 51, 234, 0.75) 100%)',
              borderRadius: '2xl',
            }}
          >
            <VStack spacing={6} textAlign="center" pos="relative" zIndex={1} color="white" px={4}>
              <Heading as="h1" size="3xl" fontWeight="extrabold">
                🎁 Rifa Royal Prestige
              </Heading>
              <Text fontSize="xl" fontWeight="medium" maxW="600px" opacity={0.95}>
                Participa y gana premios exclusivos de cocina premium
              </Text>
              <HStack spacing={4} mt={2}>
                <Badge bg="white" color="purple.600" fontSize="md" px={4} py={2} borderRadius="full" fontWeight="bold">
                  🏆 Premios Premium
                </Badge>
                <Badge bg="white" color="blue.600" fontSize="md" px={4} py={2} borderRadius="full" fontWeight="bold">
                  ✨ 50+ Ganadores
                </Badge>
              </HStack>
            </VStack>
          </Box>

          {/* Content Grid */}
          <Box bg="rgba(255, 255, 255, 0.60)" py={12}>
            <Grid templateColumns={{ base: '1fr', lg: 'repeat(2, 1fr)' }} gap={8} maxW="container.xl" mx="auto" px={4}>
              {/* Información sobre la rifa */}
              <VStack align="flex-start" spacing={8} justify="flex-start">
                <VStack align="flex-start" spacing={4}>
                  <Heading as="h2" size="lg" color="gray">
                    ¿Por qué participar?
                  </Heading>
                  <Text fontSize="md" color="gray.700" lineHeight="1.8">
                    Registra tus datos en nuestro formulario y recibe un número de proceso generado automáticamente para participar en la rifa más
                    grande de Royal Prestige.
                  </Text>
                </VStack>

                {/* Premios */}
                <VStack align="flex-start" spacing={4} bg="rgba(255,255,255,0.80)" p={8} borderRadius="2xl" boxShadow="xl" w="100%">
                  <Heading as="h3" size="lg" bgGradient="linear(to-r, blue.600, purple.600)" bgClip="text">
                    Premios Destacados 🏆
                  </Heading>
                  <HStack w="100%" justify="space-between" pb={3} borderBottom="2px solid" borderColor="gray.200">
                    <Text fontWeight="bold" color="gray.800">🥇 Primer Premio</Text>
                    <Badge colorScheme="yellow" fontSize="sm">
                      Juego completo Royal Prestige
                    </Badge>
                  </HStack>
                  <HStack w="100%" justify="space-between" pb={3} borderBottom="2px solid" borderColor="gray.200">
                    <Text fontWeight="bold" color="gray.800">🥈 Segundo Premio</Text>
                    <Badge colorScheme="gray" fontSize="sm">
                      Set de Ollas Premium
                    </Badge>
                  </HStack>
                  <HStack w="100%" justify="space-between" pb={3} borderBottom="2px solid" borderColor="gray.200">
                    <Text fontWeight="bold" color="gray.800">🥉 Tercer Premio</Text>
                    <Badge colorScheme="orange" fontSize="sm">
                      Accesorios Exclusivos
                    </Badge>
                  </HStack>
                  <Text fontSize="sm" color="gray.600" mt={2}>
                    + 50 premios sorpresa valorados en miles de pesos
                  </Text>
                </VStack>

                {/* Imagen */}
                <Image
                  src="https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=500&h=350&fit=crop"
                  alt="Productos Royal Prestige"
                  borderRadius="lg"
                  boxShadow="lg"
                  w="100%"
                  bg="rgba(255,255,255,0.7)"
                />
              </VStack>

              {/* Formulario */}
              <Box bg="rgba(255,255,255,0.70)" p={10} borderRadius="2xl" boxShadow="2xl" h="fit-content" backdropFilter="blur(10px)">
                <VStack spacing={6} align="stretch">
                  <Box>
                    <Heading as="h3" size="lg" mb={2} bgGradient="linear(to-r, blue.600, purple.600)" bgClip="text">
                      Regístrate Ahora
                    </Heading>
                    <Text color="gray.600">Completa el formulario para participar</Text>
                  </Box>

                  <form onSubmit={handleSubmit(onSubmit)} noValidate style={{ width: '100%' }}>
                    <VStack spacing={5} align="stretch">
                      {/* Nombre */}
                      <FormControl isRequired>
                        <FormLabel fontWeight="bold">Nombre completo</FormLabel>
                        <Input
                          {...register('nombre', { required: 'El nombre es obligatorio' })}
                          placeholder="Ej: Mariana Moreno Sánchez"
                          size="md"
                          focusBorderColor="blue.500"
                        />
                        {errors.nombre && (
                          <Text fontSize="sm" color="red.500" mt={1}>
                            {errors.nombre.message}
                          </Text>
                        )}
                      </FormControl>

                      {/* Teléfono */}
                      <FormControl isRequired>
                        <FormLabel fontWeight="bold">Teléfono (10 dígitos)</FormLabel>
                        <Input
                          {...register('telefono', {
                            required: 'El teléfono es obligatorio',
                            pattern: {
                              value: /^[0-9]{10}$/,
                              message: 'Ingresa un teléfono válido de 10 dígitos'
                            }
                          })}
                          placeholder="5512345678"
                          size="md"
                          focusBorderColor="blue.500"
                        />
                        {errors.telefono && (
                          <Text fontSize="sm" color="red.500" mt={1}>
                            {errors.telefono.message}
                          </Text>
                        )}
                      </FormControl>

                      {/* Estado civil */}
                      <FormControl isRequired>
                        <FormLabel fontWeight="bold">Estado civil</FormLabel>
                        <Select
                          {...register('estadoCivil', { required: 'Selecciona tu estado civil' })}
                          placeholder="Selecciona..."
                        >
                          <option value="soltero">Soltero/a</option>
                          <option value="casado">Casado/a</option>
                          <option value="union_libre">Unión libre</option>
                        </Select>
                        {errors.estadoCivil && (
                          <Text fontSize="sm" color="red.500" mt={1}>
                            {errors.estadoCivil.message}
                          </Text>
                        )}
                      </FormControl>

                      {/* Nivel de estudios */}
                      <FormControl isRequired>
                        <FormLabel fontWeight="bold">Nivel de estudios</FormLabel>
                        <Select
                          {...register('nivelEstudios', { required: 'Selecciona tu nivel de estudios' })}
                          placeholder="Selecciona..."
                        >
                          <option value="primaria">Primaria</option>
                          <option value="secundaria">Secundaria</option>
                          <option value="preparatoria">Preparatoria / Bachillerato</option>
                          <option value="licenciatura">Licenciatura / Profesional</option>
                          <option value="posgrado">Posgrado (Maestría/Doctorado)</option>
                        </Select>
                        {errors.nivelEstudios && (
                          <Text fontSize="sm" color="red.500" mt={1}>
                            {errors.nivelEstudios.message}
                          </Text>
                        )}
                      </FormControl>

                      {/* ✅ SECCIÓN CORREGIDA - Usando required en lugar de validate */}
                      <FormControl isInvalid={!!errors.marcasPrefiere}>
                        <FormLabel fontWeight="bold">¿Qué marcas de utensilios prefieres?</FormLabel>

                        <Controller
                          name="marcasPrefiere"
                          control={control}
                          rules={{
                            required: {
                              value: true,
                              message: '⚠️ Por favor selecciona al menos una marca para continuar'
                            }
                          }}
                          render={({ field }) => (
                            <CheckboxGroup
                              value={field.value || []}
                              onChange={(values) => {
                                field.onChange(values);
                              }}
                            >
                              <Stack spacing={2} bg="gray.50" p={3} borderRadius="md">
                                <Checkbox value="royal_prestige">
                                  ⭐ Royal Prestige
                                </Checkbox>
                                <Checkbox value="t_fal">
                                  🍳 T-fal
                                </Checkbox>
                                <Checkbox value="oster">
                                  🔌 Oster
                                </Checkbox>
                                <Checkbox value="tupperware">
                                  📦 Tupperware
                                </Checkbox>
                                <Checkbox value="other">
                                  🏠 Otras marcas
                                </Checkbox>
                              </Stack>
                            </CheckboxGroup>
                          )}
                        />

                        <Text fontSize="xs" color="gray.500" mt={2}>
                          Puedes seleccionar varias opciones
                        </Text>
                        {errors.marcasPrefiere && (
                          <Text fontSize="sm" color="red.500" mt={1}>
                            {errors.marcasPrefiere.message}
                          </Text>
                        )}
                      </FormControl>

                      {/* Gusta cocinar */}
                      <FormControl isRequired>
                        <FormLabel fontWeight="bold">¿Te gusta cocinar?</FormLabel>
                        <Select
                          {...register('gustaCocinar', { required: 'Selecciona una opción' })}
                          placeholder="Selecciona..."
                        >
                          <option value="true">¡Sí, me encanta!</option>
                          <option value="false">No mucho, prefiero comer fuera</option>
                        </Select>
                        {errors.gustaCocinar && (
                          <Text fontSize="sm" color="red.500" mt={1}>
                            {errors.gustaCocinar.message}
                          </Text>
                        )}
                      </FormControl>

                      {/* Mensaje de seguridad */}
                      <Box bg="blue.50" p={3} borderRadius="md" borderLeft="4px solid" borderColor="blue.500">
                        <Text fontSize="sm" color="gray.700">
                          🔒 Tus datos están seguros y encriptados. No compartimos tu información.
                        </Text>
                      </Box>

                      {/* Botón */}
                      <Button
                        type="submit"
                        bgGradient="linear(to-r, blue.600, purple.600)"
                        size="lg"
                        isLoading={isSubmitting}
                        loadingText="Registrando..."
                        fontSize="md"
                        fontWeight="bold"
                      >
                        ✓ Participar en la Rifa
                      </Button>

                      {registroInfo && (
                        <Box bg="green.50" border="1px solid" borderColor="green.200" p={4} borderRadius="md" mt={4}>
                          <Text fontWeight="bold">Registro guardado</Text>
                          <Text>¡Gracias por participar! Guarda este número de proceso para reclamar tu premio si resultas ganador/a:</Text>
                          <Text fontWeight="bold" fontSize="xl" mt={2}>#{registroInfo.numeroRifa}</Text>
                          <Text mt={3}>Nos pondremos en contacto contigo si tu número resulta ganador. Te deseamos la mejor de las suertes en la rifa.</Text>
                        </Box>
                      )}
                    </VStack>
                  </form>
                </VStack>
              </Box>
            </Grid>
          </Box>
        </VStack>
      </Box>
    </>
  );
}

export default Funnel;