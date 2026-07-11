// frontend/src/pages/SolicitarReset.jsx
import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Box,
  Button,
  Container,
  FormControl,
  FormLabel,
  Input,
  VStack,
  Text,
  useToast,
  Heading
} from '@chakra-ui/react';
import { solicitarReset } from '../services/authService';

const SolicitarReset = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [enviado, setEnviado] = useState(false);
  const toast = useToast();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await solicitarReset(email);
      setEnviado(true);
      toast({
        title: 'Correo enviado',
        description: 'Si el email existe, recibirás un enlace de recuperación.',
        status: 'success',
        duration: 5000,
        isClosable: true
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: error.response?.data?.message || 'Error al procesar la solicitud',
        status: 'error',
        duration: 5000,
        isClosable: true
      });
    } finally {
      setLoading(false);
    }
  };

  if (enviado) {
    return (
      <Container maxW="md" py={20}>
        <Box textAlign="center">
          <Heading mb={4}>Correo Enviado</Heading>
          <Text mb={6}>
            Si el email existe en nuestra base de datos, recibirás un enlace de recuperación en los próximos minutos.
          </Text>
          <Text mb={6} color="gray.600">
            Por favor revisa tu bandeja de entrada y spam.
          </Text>
          <Link to="/login">
            <Button colorScheme="blue">Volver al Login</Button>
          </Link>
        </Box>
      </Container>
    );
  }

  return (
    <Container maxW="md" py={20}>
      <Box textAlign="center" mb={8}>
        <Heading>Recuperar Contraseña</Heading>
        <Text mt={2} color="gray.600">
          Ingresa tu correo electrónico y te enviaremos un enlace para restablecer tu contraseña
        </Text>
      </Box>

      <Box as="form" onSubmit={handleSubmit}>
        <VStack spacing={4}>
          <FormControl isRequired>
            <FormLabel>Correo Electrónico</FormLabel>
            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="tu@email.com"
            />
          </FormControl>

          <Button
            type="submit"
            colorScheme="blue"
            width="full"
            isLoading={loading}
            loadingText="Enviando..."
          >
            Enviar Enlace de Recuperación
          </Button>

          <Link to="/login" style={{ width: '100%' }}>
            <Button variant="ghost" width="full">
              Cancelar
            </Button>
          </Link>
        </VStack>
      </Box>
    </Container>
  );
};

export default SolicitarReset;