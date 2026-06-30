// frontend/src/pages/Catalogo.jsx
import { Box, Heading, Text, Button, VStack, Icon } from '@chakra-ui/react';
import { DownloadIcon } from '@chakra-ui/icons';
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
              <Heading as="h2" size="lg" mb={2}>
                📦 Catálogo de Productos
              </Heading>
              <Text fontSize="md" color="gray.600" mb={4}>
                Explora nuestra colección completa de productos Royal Prestige
              </Text>
              <Button
                as="a"
                href={PDF_URL}
                download="Catalogo-Royal-Prestige.pdf"
                colorScheme="orange"
                size="lg"
                leftIcon={<DownloadIcon />}
                _hover={{ transform: 'scale(1.05)' }}
                transition="all 0.2s"
                boxShadow="0 4px 20px rgba(237, 137, 54, 0.4)"
              >
                Descargar Catálogo PDF
              </Button>
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
                src={`${PDF_URL}#view=FitH&toolbar=1`}
                title="Catálogo Royal Prestige"
                width="100%"
                height="100%"
                style={{ border: 'none' }}
              />
            </Box>

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