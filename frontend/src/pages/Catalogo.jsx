// frontend/src/pages/Catalogo.jsx
import { Box, Heading, Text } from '@chakra-ui/react';
import multipan from '../assets/images/multiPan.png';

function Catalogo() {
  return (
    <>
      {/* Fondo fullscreen con pointerEvents: none */}
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

      {/* Contenido con overlay blanco */}
      <Box
        position="relative"
        minH="100vh"
        w="100%"
        mx="auto"
        maxW="1200px"
        zIndex={1}
        p={8}
      >
        <Box 
          bg="rgba(255,255,255,0.92)" 
          p={10} 
          borderRadius="xl" 
          boxShadow="2xl"
          backdropFilter="blur(10px)"
        >
          <Heading as="h2" size="lg" mb={4}>
            📦 Catálogo de productos
          </Heading>
          <Text fontSize="md" color="gray.600">
            Próximamente: precios de lista Royal Prestige
          </Text>
        </Box>
      </Box>
    </>
  );
}

export default Catalogo;