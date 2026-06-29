// frontend/src/pages/Reclutamiento.jsx
import { useState } from 'react';
import {
  Box,
  Heading,
  Text,
  FormControl,
  FormLabel,
  Input,
  Textarea,
  Select,
  Button,
  VStack,
  HStack,
  useToast,
  Container,
  FormErrorMessage,
} from '@chakra-ui/react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { MdCheckCircle } from 'react-icons/md';

// Esquema de validación con Yup
const schema = yup.object().shape({
  nombre: yup.string().required('El nombre es requerido').min(3, 'Mínimo 3 caracteres'),
  telefono: yup.string().required('El teléfono es requerido').matches(/^[0-9]{10}$/, 'Debe tener 10 dígitos'),
  email: yup.string().required('El correo es requerido').email('Correo inválido'),
  experiencia: yup.string().required('Selecciona una opción'),
  disponibilidad: yup.string().required('Selecciona una opción'),
  motivacion: yup.string().max(500, 'Máximo 500 caracteres'),
});

function Reclutamiento() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const toast = useToast();
  
  const { register, handleSubmit, formState: { errors }, reset } = useForm({
    resolver: yupResolver(schema),
  });

  const onSubmit = async (data) => {
    setIsSubmitting(true);
    
    try {
      // Aquí irá la llamada al backend cuando esté listo
      // const response = await fetch('/api/reclutamiento/registro', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(data),
      // });
      
      // Simulación de envío exitoso
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast({
        title: '¡Registro exitoso!',
        description: 'Nos pondremos en contacto contigo pronto.',
        status: 'success',
        duration: 5000,
        isClosable: true,
        position: 'top',
      });
      
      reset();
    } catch (error) {
      toast({
        title: 'Error al registrar',
        description: 'Por favor intenta de nuevo.',
        status: 'error',
        duration: 5000,
        isClosable: true,
        position: 'top',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Box 
      bg="linear-gradient(135deg, #667eea 0%, #764ba2 100%)" 
      minH="100vh" 
      py={12}
      px={4}
    >
      <Container maxW="container.md">
        <Box
          bg="white"
          borderRadius="xl"
          boxShadow="2xl"
          overflow="hidden"
        >
          {/* Header con gradiente */}
          <Box
            bgGradient="linear(to-r, orange.400, orange.600)"
            p={8}
            textAlign="center"
          >
            <Heading as="h1" size="2xl" color="white" mb={2}>
              🤝 Únete al Equipo Royal Prestige
            </Heading>
            <Text fontSize="lg" color="white">
              ¿Quieres ser parte de nuestro equipo de ventas? ¡Regístrate ahora!
            </Text>
          </Box>

          {/* Formulario */}
          <Box p={8}>
            <form onSubmit={handleSubmit(onSubmit)}>
              <VStack spacing={5}>
                {/* Nombre completo */}
                <FormControl isInvalid={errors.nombre}>
                  <FormLabel fontWeight="bold" color="gray.700">
                    Nombre Completo *
                  </FormLabel>
                  <Input
                    {...register('nombre')}
                    placeholder="Juan Pérez García"
                    size="lg"
                    focusBorderColor="orange.400"
                  />
                  <FormErrorMessage>
                    {errors.nombre?.message}
                  </FormErrorMessage>
                </FormControl>

                {/* Teléfono */}
                <FormControl isInvalid={errors.telefono}>
                  <FormLabel fontWeight="bold" color="gray.700">
                    Teléfono *
                  </FormLabel>
                  <Input
                    {...register('telefono')}
                    placeholder="5512345678"
                    size="lg"
                    focusBorderColor="orange.400"
                  />
                  <FormErrorMessage>
                    {errors.telefono?.message}
                  </FormErrorMessage>
                </FormControl>

                {/* Correo electrónico */}
                <FormControl isInvalid={errors.email}>
                  <FormLabel fontWeight="bold" color="gray.700">
                    Correo Electrónico *
                  </FormLabel>
                  <Input
                    {...register('email')}
                    type="email"
                    placeholder="correo@ejemplo.com"
                    size="lg"
                    focusBorderColor="orange.400"
                  />
                  <FormErrorMessage>
                    {errors.email?.message}
                  </FormErrorMessage>
                </FormControl>

                {/* Experiencia en ventas */}
                <FormControl isInvalid={errors.experiencia}>
                  <FormLabel fontWeight="bold" color="gray.700">
                    ¿Tienes experiencia en ventas? *
                  </FormLabel>
                  <Select
                    {...register('experiencia')}
                    placeholder="Selecciona una opción"
                    size="lg"
                    focusBorderColor="orange.400"
                  >
                    <option value="si">Sí, tengo experiencia</option>
                    <option value="no">No, pero quiero aprender</option>
                  </Select>
                  <FormErrorMessage>
                    {errors.experiencia?.message}
                  </FormErrorMessage>
                </FormControl>

                {/* Disponibilidad */}
                <FormControl isInvalid={errors.disponibilidad}>
                  <FormLabel fontWeight="bold" color="gray.700">
                    Disponibilidad de Horario *
                  </FormLabel>
                  <Select
                    {...register('disponibilidad')}
                    placeholder="Selecciona una opción"
                    size="lg"
                    focusBorderColor="orange.400"
                  >
                    <option value="mañana">Mañana (8am - 2pm)</option>
                    <option value="tarde">Tarde (2pm - 8pm)</option>
                    <option value="noche">Noche (8pm - 12am)</option>
                    <option value="flexible">Flexible</option>
                  </Select>
                  <FormErrorMessage>
                    {errors.disponibilidad?.message}
                  </FormErrorMessage>
                </FormControl>

                {/* Motivación */}
                <FormControl isInvalid={errors.motivacion}>
                  <FormLabel fontWeight="bold" color="gray.700">
                    ¿Por qué quieres unirte a Royal Prestige?
                  </FormLabel>
                  <Textarea
                    {...register('motivacion')}
                    placeholder="Cuéntanos tu motivación..."
                    size="lg"
                    focusBorderColor="orange.400"
                    rows={4}
                  />
                  <FormErrorMessage>
                    {errors.motivacion?.message}
                  </FormErrorMessage>
                </FormControl>

                {/* Botón de envío */}
                <Button
                  type="submit"
                  colorScheme="orange"
                  size="lg"
                  width="full"
                  isLoading={isSubmitting}
                  loadingText="Enviando..."
                  _hover={{ transform: 'scale(1.02)' }}
                  transition="all 0.2s"
                  boxShadow="0 4px 20px rgba(237, 137, 54, 0.4)"
                >
                  <MdCheckCircle style={{ marginRight: '8px' }} />
                  Enviar Registro
                </Button>

                <Text fontSize="sm" color="gray.500" textAlign="center">
                  * Campos obligatorios
                </Text>
              </VStack>
            </form>
          </Box>
        </Box>
      </Container>
    </Box>
  );
}

export default Reclutamiento;