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
import { motion } from 'framer-motion';
import api from '../services/api.js';

// Esquema de validación con Yup
const schema = yup.object().shape({
  nombre: yup.string().required('El nombre completo es obligatorio').min(3, 'Ingresa al menos 3 caracteres (ej: Juan Pérez)'),
  telefono: yup.string().required('El teléfono es obligatorio').matches(/^[0-9]{10}$/, 'Ingresa 10 dígitos sin espacios ni guiones (ej: 5512345678)'),
  email: yup.string().required('El correo electrónico es obligatorio').email('Ingresa un correo válido (ej: nombre@dominio.com)'),
  experiencia: yup.string().required('Selecciona si tienes experiencia en ventas'),
  disponibilidad: yup.string().required('Selecciona tu disponibilidad de horario'),
  motivacion: yup.string().max(500, 'La motivación no puede exceder 500 caracteres'),
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
      const response = await api.post('/api/reclutamiento/registro', data);
      
      if (response.data) {
        toast({
          title: '¡Registro exitoso!',
          description: response.data.message || 'Nos pondremos en contacto contigo pronto.',
          status: 'success',
          duration: 5000,
          isClosable: true,
          position: 'top',
        });
        
        reset();
      }
    } catch (error) {
      console.error('Error:', error);
      toast({
        title: 'Error al registrar',
        description: error.response?.data?.message || 'Por favor intenta de nuevo.',
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
      bg="whitesmoke" 
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
              🤝 Únete al Equipo Casa Pleroma
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
                  isDisabled={isSubmitting}
                  _hover={{ transform: 'scale(1.02)' }}
                  transition="all 0.2s"
                  boxShadow="0 4px 20px rgba(237, 137, 54, 0.4)"
                >
                  {isSubmitting ? (
                    <HStack spacing={2}>
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                      >
                        <MdCheckCircle size={24} />
                      </motion.div>
                      <Text>Enviando...</Text>
                    </HStack>
                  ) : (
                    <HStack spacing={2}>
                      <MdCheckCircle size={24} />
                      <Text>Enviar Registro</Text>
                    </HStack>
                  )}
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