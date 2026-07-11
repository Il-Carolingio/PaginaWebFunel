// frontend/src/pages/ResetearPassword.jsx
import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  Box,
  Button,
  Container,
  FormControl,
  FormLabel,
  Input,
  InputGroup,
  InputRightElement,
  IconButton,
  VStack,
  Text,
  useToast,
  Heading,
  Alert,
  AlertIcon
} from '@chakra-ui/react';
import { ViewIcon, ViewOffIcon } from '@chakra-ui/icons';
import { validarTokenReset, resetearPassword } from '../services/authService';

const ResetearPassword = () => {
  const { token } = useParams();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [tokenValido, setTokenValido] = useState(null);
  const [email, setEmail] = useState('');
  const toast = useToast();

  useEffect(() => {
    const validarToken = async () => {
      try {
        const response = await validarTokenReset(token);
        setTokenValido(true);
        setEmail(response.email);
      } catch (error) {
        setTokenValido(false);
      }
    };

    if (token) {
      validarToken();
    }
  }, [token]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      toast({
        title: 'Error',
        description: 'Las contraseñas no coinciden',
        status: 'error',
        duration: 5000,
        isClosable: true
      });
      return;
    }

    if (password.length < 6) {
      toast({
        title: 'Error',
        description: 'La contraseña debe tener al menos 6 caracteres',
        status: 'error',
        duration: 5000,
        isClosable: true
      });
      return;
    }

    setLoading(true);

    try {
      await resetearPassword(token, password);
      toast({
        title: 'Éxito',
        description: 'Tu contraseña ha sido actualizada. Ahora puedes iniciar sesión.',
        status: 'success',
        duration: 5000,
        isClosable: true
      });
      // Redirigir al login del CRM después de 2 segundos
      setTimeout(() => {
        window.location.href = '/crm';
      }, 2000);
    } catch (error) {
      toast({
        title: 'Error',
        description: error.response?.data?.message || 'Error al actualizar la contraseña',
        status: 'error',
        duration: 5000,
        isClosable: true
      });
    } finally {
      setLoading(false);
    }
  };

  if (tokenValido === null) {
    return (
      <Container maxW="md" py={20}>
        <Box textAlign="center">
          <Heading mb={4}>Validando Token...</Heading>
          <Text>Por favor espera un momento.</Text>
        </Box>
      </Container>
    );
  }

  if (tokenValido === false) {
    return (
      <Container maxW="md" py={20}>
        <Box textAlign="center">
          <Heading mb={4} color="red.500">Token Inválido o Expirado</Heading>
          <Text mb={6}>
            Este enlace de recuperación ha expirado o ya ha sido utilizado.
          </Text>
          <Text mb={6} color="gray.600">
            Por favor solicita un nuevo enlace de recuperación.
          </Text>
          <Link to="/solicitar-reset">
            <Button colorScheme="blue">Solicitar Nuevo Enlace</Button>
          </Link>
        </Box>
      </Container>
    );
  }

  return (
    <Container maxW="md" py={20}>
      <Box textAlign="center" mb={8}>
        <Heading>Restablecer Contraseña</Heading>
        <Text mt={2} color="gray.600">
          Ingresa tu nueva contraseña para la cuenta {email}
        </Text>
      </Box>

      <Box as="form" onSubmit={handleSubmit}>
        <VStack spacing={4}>
          <FormControl isRequired>
            <FormLabel>Nueva Contraseña</FormLabel>
            <InputGroup>
              <Input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Mínimo 6 caracteres"
                minLength={6}
                pr="4.5rem"
              />
              <InputRightElement>
                <IconButton
                  variant="ghost"
                  size="sm"
                  icon={showPassword ? <ViewOffIcon /> : <ViewIcon />}
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
                />
              </InputRightElement>
            </InputGroup>
          </FormControl>

          <FormControl isRequired>
            <FormLabel>Confirmar Contraseña</FormLabel>
            <InputGroup>
              <Input
                type={showConfirmPassword ? "text" : "password"}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Repite tu contraseña"
                minLength={6}
                pr="4.5rem"
              />
              <InputRightElement>
                <IconButton
                  variant="ghost"
                  size="sm"
                  icon={showConfirmPassword ? <ViewOffIcon /> : <ViewIcon />}
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  aria-label={showConfirmPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
                />
              </InputRightElement>
            </InputGroup>
          </FormControl>

          <Alert status="info" borderRadius="md">
            <AlertIcon />
            <Text fontSize="sm">
              La contraseña debe tener al menos 6 caracteres.
            </Text>
          </Alert>

          <Button
            type="submit"
            colorScheme="blue"
            width="full"
            isLoading={loading}
            loadingText="Actualizando..."
          >
            Actualizar Contraseña
          </Button>

          <Link to="/crm" style={{ width: '100%' }}>
            <Button variant="ghost" width="full">
              Cancelar
            </Button>
          </Link>
        </VStack>
      </Box>
    </Container>
  );
};

export default ResetearPassword;