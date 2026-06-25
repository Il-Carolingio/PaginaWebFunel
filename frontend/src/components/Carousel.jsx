// frontend/src/components/Carousel.jsx
import { useState, useEffect } from 'react';
import {
  Box,
  Image,
  IconButton,
  HStack,
  VStack,
  Text,
  Badge,
} from '@chakra-ui/react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeftIcon, ChevronRightIcon } from '@chakra-ui/icons';
import gourmetImg from '../assets/images/carousel/Gourmet.png';
import pressureImg from '../assets/images/carousel/OllaPresion.png';
import accessoriesImg from '../assets/images/carousel/Accesorios.png';
import juegoOllasImg from '../assets/images/carousel/JuegoOllas.png';

const MotionBox = motion(Box);

const productos = [
  {
    id: 1,
    nombre: 'Sartenes gourmet',
    descripcion: 'Tecnología de 5 capas para cocción uniforme',
    imagen: gourmetImg,
    badge: 'Más vendido',
  },
  {
    id: 2,
    nombre: 'Olla a Presión Premium',
    descripcion: 'Cocina rápida y segura con sistema de seguridad',
    imagen: pressureImg,
    badge: 'Oferta',
  },
  {
    id: 3,
    nombre: 'Juego de Ollas Royal',
    descripcion: 'Set completo con 5 piezas de acero inoxidable',
    imagen: juegoOllasImg,
    badge: 'Premium',
  },
  {
    id: 4,
    nombre: 'Accesorios de Cocina',
    descripcion: 'Utensilios profesionales para chefs',
    imagen: accessoriesImg,
    badge: 'Nuevo',
  },
];

function Carousel({ currentIndex: externalIndex, onIndexChange }) {
  // Si viene externalIndex, úsalo; si no, usa el estado interno
  const [internalIndex, setInternalIndex] = useState(0);
  const index = externalIndex !== undefined ? externalIndex : internalIndex;
  const setIndex = onIndexChange || setInternalIndex;

  const nextSlide = () => {
    setIndex((prev) => (prev + 1) % productos.length);
  };

  const prevSlide = () => {
    setIndex((prev) => (prev - 1 + productos.length) % productos.length);
  };

  // Auto-play solo si no está controlado externamente
  useEffect(() => {
    if (externalIndex === undefined) {
      const interval = setInterval(nextSlide, 5000);
      return () => clearInterval(interval);
    }
  }, [externalIndex]);

  const currentProduct = productos[index];

  return (
    <Box position="relative" w="100%" maxW="900px" mx="auto">
      <AnimatePresence mode="wait">
        <MotionBox
          key={index}
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -50 }}
          transition={{ duration: 0.5 }}
          borderRadius="lg"
          overflow="hidden"
          boxShadow="lg"
          bg="white"
        >
          <Box position="relative">
            <Image
              src={currentProduct.imagen}
              alt={currentProduct.nombre}
              w="100%"
              h="300px"
              objectFit="cover"
            />
            <Badge
              position="absolute"
              top={4}
              right={4}
              colorScheme="orange"
              fontSize="md"
              px={3}
              py={1}
              borderRadius="full"
            >
              {currentProduct.badge}
            </Badge>
          </Box>
          
          <VStack p={6} spacing={2} align="flex-start">
            <Text fontSize="xl" fontWeight="bold">
              {currentProduct.nombre}
            </Text>
            <Text color="gray.600" fontSize="sm">
              {currentProduct.descripcion}
            </Text>
            <Text fontSize="2xl" fontWeight="bold" color="blue.600">
              {currentProduct.precio}
            </Text>
          </VStack>
        </MotionBox>
      </AnimatePresence>

      {/* Controles */}
      <IconButton
        icon={<ChevronLeftIcon />}
        position="absolute"
        left={-4}
        top="50%"
        transform="translateY(-50%)"
        onClick={prevSlide}
        colorScheme="blue"
        rounded="full"
        size="lg"
        zIndex={2}
        boxShadow="lg"
        aria-label="Anterior"
      />
      <IconButton
        icon={<ChevronRightIcon />}
        position="absolute"
        right={-4}
        top="50%"
        transform="translateY(-50%)"
        onClick={nextSlide}
        colorScheme="blue"
        rounded="full"
        size="lg"
        zIndex={2}
        boxShadow="lg"
        aria-label="Siguiente"
      />

      {/* Indicadores */}
      <HStack spacing={2} justify="center" mt={4}>
        {productos.map((_, i) => (
          <Box
            key={i}
            w={i === index ? "24px" : "8px"}
            h="8px"
            borderRadius="full"
            bg={i === index ? "blue.500" : "gray.300"}
            transition="all 0.3s"
            cursor="pointer"
            onClick={() => setIndex(i)}
          />
        ))}
      </HStack>
    </Box>
  );
}

export default Carousel;