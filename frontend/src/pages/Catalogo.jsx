// frontend/src/pages/Catalogo.jsx
import { Box, Heading, Text, VStack, Button, Icon } from '@chakra-ui/react';
import { MdDownload } from 'react-icons/md';
import multipan from '../assets/images/multiPan.png';

const PDF_URL = '/catalogo/Novel Catalog_DIGITAL.pdf';

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
        pointerEvents="none"
      />

      {/* Contenido con overlay blanco */}
      <Box
        position="relative"
        minH="100vh"
        w="100%"
        mx="auto"
        maxW="1200px"
        zIndex={1}
        p={{ base: 2, md: 8 }}
      >
        <Box 
          bg="rgba(255,255,255,0.95)" 
          p={{ base: 4, md: 8 }} 
          borderRadius="xl" 
          boxShadow="2xl"
          backdropFilter="blur(10px)"
        >
          <VStack spacing={6} align="stretch">
            {/* Encabezado */}
            <Box textAlign="center">
              <Heading as="h2" size="lg" mb={2} color="blue.800">
                📦 Catálogo de Productos
              </Heading>
              <Text fontSize="md" color="gray.600" mb={4}>
                Explora nuestra colección completa de productos Royal Prestige
              </Text>
            </Box>

            {/* Visor de PDF */}
            <Box
              w="100%"
              h={{ base: '70vh', md: '85vh' }}
              borderRadius="lg"
              overflow="hidden"
              border="1px solid"
              borderColor="gray.200"
              boxShadow="md"
            >
              <iframe
                src={PDF_URL}
                title="Catálogo Royal Prestige"
                width="100%"
                height="100%"
                style={{ border: 'none' }}
              />
            </Box>

            {/* Botón de descarga */}
            <Button
              as="a"
              href={PDF_URL}
              download="Catalogo_Royal_Prestige.pdf"
              colorScheme="blue"
              size="lg"
              leftIcon={<Icon as={MdDownload} />}
              alignSelf="center"
            >
              Descargar Catálogo PDF
            </Button>

            {/* Pie */}
            <Text fontSize="sm" color="gray.500" textAlign="center">
              Catálogo digital Royal Prestige - Todos los derechos reservados
            </Text>
          </VStack>
        </Box>
      </Box>
    </>
  );
}

export default Catalogo;
