// frontend/src/pages/Reclutamiento.jsx
import { Box, Heading, Text } from '@chakra-ui/react';

function Reclutamiento() {
  return (
    <Box bg="white" p={8} borderRadius="lg" boxShadow="md">
      <Heading as="h2" size="lg" mb={4}>
        🤝 Únete al equipo
      </Heading>
      <Text fontSize="md" color="gray.600">
        Próximamente: formulario para reclutar vendedores
      </Text>
    </Box>
  );
}

export default Reclutamiento;