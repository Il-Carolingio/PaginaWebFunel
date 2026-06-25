// frontend/src/pages/Crm.jsx
import { Box, Heading, Text } from '@chakra-ui/react';

function Crm() {
  return (
    <Box bg="white" p={8} borderRadius="lg" boxShadow="md">
      <Heading as="h2" size="lg" mb={4}>
        📋 CRM de citas
      </Heading>
      <Text fontSize="md" color="gray.600">
        Próximamente: gestión de citas con prospectos
      </Text>
    </Box>
  );
}

export default Crm;