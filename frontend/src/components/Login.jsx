import { useState } from "react";
import { Link as RouterLink } from "react-router-dom";
import {
  Box,
  Heading,
  Text,
  Input,
  Button,
  VStack,
  useToast,
  Container,
  Image,
  Link
} from "@chakra-ui/react";
import { useAuth } from "../context/AuthContext";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [cargando, setCargando] = useState(false);
  const { login } = useAuth();
  const toast = useToast();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setCargando(true);

    const resultado = await login(email, password);

    if (resultado.success) {
      toast({
        title: "Inicio de sesión exitoso",
        status: "success",
        duration: 3000,
      });
    } else {
      toast({
        title: resultado.message,
        status: "error",
        duration: 5000,
      });
    }

    setCargando(false);
  };

  return (
    <Box
      minH="100vh"
      bg="gray.50"
      display="flex"
      alignItems="center"
      justifyContent="center"
      p={4}
    >
      <Container maxW="md">
        <Box bg="white" p={8} borderRadius="xl" boxShadow="2xl">
          <VStack spacing={6}>
            <Box textAlign="center">
              <Link as={RouterLink} to="/" display="flex" alignItems="center" justifyContent="center">
                <Image
                  src="/homeImages/FullLogo_Transparent.png"
                  borderRadius="20%"
                  alt="Casa Pleroma"
                  position="center"
                  height={{ base: "30px", md: "50px", lg: "150px" }} // Móvil: 30px, Tablet: 50px, Escritorio: 60px
                  width="auto"
                  objectFit="contain"
                  _hover={{ opacity: 0.8 }}
                  transition="opacity 0.2s"
                />
              </Link>
              <Text color="gray.600">
                Inicia sesión para acceder al panel de vendedores
              </Text>
            </Box>

            <form onSubmit={handleSubmit} style={{ width: "100%" }}>
              <VStack spacing={4}>
                <Input
                  type="email"
                  placeholder="Correo electrónico"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  size="lg"
                />
                <Input
                  type="password"
                  placeholder="Contraseña"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  size="lg"
                />
                <Button
                  type="submit"
                  colorScheme="orange"
                  size="lg"
                  width="100%"
                  isLoading={cargando}
                  _hover={{ transform: "scale(1.02)" }}
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

export default Login;
