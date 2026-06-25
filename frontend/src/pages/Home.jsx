// frontend/src/pages/Home.jsx
import { useEffect, useState, useRef } from 'react';
import {
  Box,
  Button,
  Container,
  Grid,
  Heading,
  Image,
  Stack,
  Text,
  VStack,
  HStack,
  Icon,
} from '@chakra-ui/react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link as RouterLink } from 'react-router-dom';
import { MdCheckCircle } from 'react-icons/md';
import Carousel from '../components/Carousel';
import easyReleaseImg from '../assets/images/carousel/easyRelease.jpg';
import novelImg from '../assets/images/carousel/Novel.png';
import heroVideoMp4 from '../assets/images/carousel/easyrelease_glass_darkened.mp4';
import ollaNovelMp4 from '../assets/images/carousel/OllaNovel.mp4';
import multipan from '../assets/images/multiPan.png';

const MotionBox = motion(Box);
const MotionHeading = motion(Heading);
const MotionText = motion(Text);

function Home() {
  const heroSlides = [
    {
      type: 'video',
      src: heroVideoMp4,
      label: 'Expertos en tecnología de alta cocina',
    },
    {
      type: 'image',
      src: novelImg,
      label: 'Ahorra tiempo y dinero',
    },
    {
      type: 'image',
      src: easyReleaseImg,
      label: 'Mejora tu salud',
    },
    {
      type: 'video',
      src: ollaNovelMp4,
      label: 'Innovación que transforma tu cocina',
    },
  ];
  
  const [heroIndex, setHeroIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const videoRefs = useRef({});

  // ✅ Sincronizar el cambio del hero con el carrusel
  useEffect(() => {
    const interval = setInterval(() => {
      setIsTransitioning(true);
      setTimeout(() => {
        setHeroIndex((prev) => (prev + 1) % heroSlides.length);
        setIsTransitioning(false);
      }, 1500);
    }, 6000);
    return () => clearInterval(interval);
  }, [heroSlides.length]);

  // ✅ Función para cambiar el índice del hero (también usado por el carrusel)
  const handleIndexChange = (newIndex) => {
    if (newIndex !== heroIndex) {
      setIsTransitioning(true);
      setTimeout(() => {
        setHeroIndex(newIndex);
        setIsTransitioning(false);
      }, 100);
    }
  };

  const currentSlide = heroSlides[heroIndex];
  const nextIndex = (heroIndex + 1) % heroSlides.length;
  const nextSlide = heroSlides[nextIndex];

  return (
    <>
      {/* Fondo fijo */}
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

      {/* Contenido */}
      <Box position="relative"
          zIndex={1}>
        <VStack spacing={0} align="stretch">
          {/* Hero Section - Crossfade perfecto */}
          <Box
            pos="relative"
            h={{ base: '320px', md: '520px' }}
            overflow="hidden"
            borderRadius="xl"
            mt={0}
          >
            {/* Slide actual */}
            <AnimatePresence mode="wait">
              {currentSlide.type === 'video' ? (
                <MotionBox
                  key={`video-current-${heroIndex}`}
                  pos="absolute"
                  inset={0}
                  initial={{ opacity: 1 }}
                  animate={{ 
                    opacity: isTransitioning ? 0 : 1,
                    transition: { 
                      duration: 1.5,
                      ease: "easeInOut"
                    }
                  }}
                  exit={{ 
                    opacity: 0,
                    transition: { 
                      duration: 1.5,
                      ease: "easeInOut"
                    }
                  }}
                >
                  <video
                    ref={el => videoRefs.current[`video-${heroIndex}`] = el}
                    style={{
                      position: 'absolute',
                      inset: 0,
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                    }}
                    autoPlay
                    muted
                    loop
                    playsInline
                  >
                    <source src={currentSlide.src} type="video/mp4" />
                  </video>
                </MotionBox>
              ) : (
                <MotionBox
                  key={`image-current-${heroIndex}`}
                  pos="absolute"
                  inset={0}
                  initial={{ opacity: 1 }}
                  animate={{ 
                    opacity: isTransitioning ? 0 : 1,
                    transition: { 
                      duration: 1.5,
                      ease: "easeInOut"
                    }
                  }}
                  exit={{ 
                    opacity: 0,
                    transition: { 
                      duration: 1.5,
                      ease: "easeInOut"
                    }
                  }}
                  style={{
                    backgroundImage: `url('${currentSlide.src}')`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                  }}
                />
              )}
            </AnimatePresence>

            {/* Slide siguiente */}
            <AnimatePresence mode="wait">
              {nextSlide.type === 'video' ? (
                <MotionBox
                  key={`video-next-${nextIndex}`}
                  pos="absolute"
                  inset={0}
                  initial={{ opacity: 0 }}
                  animate={{ 
                    opacity: isTransitioning ? 1 : 0,
                    transition: { 
                      duration: 1.5,
                      ease: "easeInOut"
                    }
                  }}
                  exit={{ 
                    opacity: 0,
                    transition: { 
                      duration: 0.3,
                      ease: "easeInOut"
                    }
                  }}
                >
                  <video
                    ref={el => videoRefs.current[`video-${nextIndex}`] = el}
                    style={{
                      position: 'absolute',
                      inset: 0,
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                    }}
                    autoPlay
                    muted
                    loop
                    playsInline
                  >
                    <source src={nextSlide.src} type="video/mp4" />
                  </video>
                </MotionBox>
              ) : (
                <MotionBox
                  key={`image-next-${nextIndex}`}
                  pos="absolute"
                  inset={0}
                  initial={{ opacity: 0 }}
                  animate={{ 
                    opacity: isTransitioning ? 1 : 0,
                    transition: { 
                      duration: 1.5,
                      ease: "easeInOut"
                    }
                  }}
                  exit={{ 
                    opacity: 0,
                    transition: { 
                      duration: 0.3,
                      ease: "easeInOut"
                    }
                  }}
                  style={{
                    backgroundImage: `url('${nextSlide.src}')`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                  }}
                />
              )}
            </AnimatePresence>

            {/* Overlay oscuro */}
            <Box
              pos="absolute"
              inset={0}
              bg="rgba(0, 0, 0, 0.5)"
              zIndex={1}
            />

            {/* Contenido del texto */}
            <VStack
              spacing={4}
              textAlign="center"
              pos="relative"
              zIndex={2}
              color="white"
              px={4}
              justify="center"
              h="full"
            >
              <MotionHeading
                as="h1"
                size="2xl"
                fontWeight="bold"
                fontFamily="var(--serif-contrast)"
                initial={{ y: -20, opacity: 0 }}
                animate={{ 
                  y: 0, 
                  opacity: 1,
                  transition: { 
                    duration: 0.8,
                    ease: "easeOut"
                  }
                }}
                exit={{ 
                  y: 20, 
                  opacity: 0,
                  transition: { 
                    duration: 0.5,
                    ease: "easeIn"
                  }
                }}
              >
                ROYAL PRESTIGE
              </MotionHeading>

              <AnimatePresence mode="wait">
                <MotionText
                  key={`label-${heroIndex}`}
                  fontSize={{ base: 'lg', md: '2xl' }}
                  maxW="700px"
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ 
                    y: 0, 
                    opacity: 1,
                    transition: { 
                      duration: 0.7,
                      delay: 0.2,
                      ease: "easeOut"
                    }
                  }}
                  exit={{ 
                    y: -20, 
                    opacity: 0,
                    transition: { 
                      duration: 0.5,
                      ease: "easeIn"
                    }
                  }}
                >
                  {currentSlide.label}
                </MotionText>
              </AnimatePresence>

              <MotionBox
                initial={{ y: 30, opacity: 0 }}
                animate={{ 
                  y: 0, 
                  opacity: 1,
                  transition: { 
                    duration: 0.7,
                    delay: 0.4,
                    ease: "easeOut"
                  }
                }}
                exit={{ 
                  y: -30, 
                  opacity: 0,
                  transition: { 
                    duration: 0.4,
                    ease: "easeIn"
                  }
                }}
              >
                <Button
                  as={RouterLink}
                  to="/rifa"
                  colorScheme="orange"
                  size="lg"
                  fontSize="lg"
                  _hover={{ transform: 'scale(1.05)' }}
                  transition="all 0.2s"
                  boxShadow="0 4px 20px rgba(237, 137, 54, 0.4)"
                >
                  Participa en la Rifa 🎁
                </Button>
              </MotionBox>
            </VStack>

            {/* Indicadores del hero */}
            <HStack
              position="absolute"
              bottom={4}
              left="50%"
              transform="translateX(-50%)"
              spacing={2}
              zIndex={3}
            >
              {heroSlides.map((_, index) => (
                <Box
                  key={index}
                  w={index === heroIndex ? "32px" : "8px"}
                  h="8px"
                  borderRadius="full"
                  bg={index === heroIndex ? "white" : "rgba(255,255,255,0.4)"}
                  transition="all 0.6s ease"
                  cursor="pointer"
                  onClick={() => handleIndexChange(index)}
                  _hover={{ bg: "white", opacity: 0.8 }}
                />
              ))}
            </HStack>
          </Box>

          {/* Carrusel de Productos - Sincronizado con el hero */}
          <Box bgColor="rgba(255, 255, 255, 0.50)" py={12}>
            <Container maxW="container.xl">
              <VStack spacing={6} align="stretch">
                <Box textAlign="center">
                  <Heading as="h2" size="xl" color="gray" mb={2}>
                    Explora Nuestros Productos Estrella
                  </Heading>
                  <Text fontSize="md" color="gray.600">
                    Desliza para ver la mejor selección de Royal Prestige
                  </Text>
                </Box>
                {/* ✅ Carrusel sincronizado con el hero */}
                <Carousel 
                  currentIndex={heroIndex % 4} // 👈 4 es el número de productos en el carrusel
                  onIndexChange={handleIndexChange}
                />
              </VStack>
            </Container>
          </Box>

          {/* Productos Destacados */}
          <Box bg="rgba(255, 255, 255, 0.50)" py={12}>
            <Container maxW="container.xl">
              <VStack spacing={8} align="stretch">
                <Box textAlign="center">
                  <Heading as="h2" size="xl" color="gray" mb={3}>
                    Nuestros Productos Premium
                  </Heading>
                  <Text fontSize="lg" color="gray.600" maxW="600px" mx="auto">
                    Descubre la combinación perfecta de tradición italiana y tecnología moderna
                  </Text>
                </Box>

                <Grid
                  templateColumns={{ base: '1fr', md: 'repeat(3, 1fr)' }}
                  gap={6}
                >
                  <Box
                    bg="white"
                    borderRadius="lg"
                    overflow="hidden"
                    boxShadow="lg"
                    _hover={{ transform: 'translateY(-8px)', boxShadow: 'xl' }}
                    transition="all 0.3s"
                  >
                    <Image
                      src="../../public/homeImages/SartenesEasyRelease.png"
                      alt="Sartenes Royal Prestige"
                      w="100%"
                      h="250px"
                      objectFit="cover"
                    />
                    <VStack p={6} spacing={3} align="flex-start">
                      <Heading as="h3" size="md">
                        Sartenes Premium
                      </Heading>
                      <Text color="gray.600" fontSize="sm">
                        Tecnología de 5 capas para distribución uniforme del calor
                      </Text>
                      <HStack spacing={1}>
                        <Icon as={MdCheckCircle} color="green.500" />
                        <Text fontSize="sm">Apta para todo tipo de cocina</Text>
                      </HStack>
                    </VStack>
                  </Box>

                  <Box
                    bg="white"
                    borderRadius="lg"
                    overflow="hidden"
                    boxShadow="lg"
                    _hover={{ transform: 'translateY(-8px)', boxShadow: 'xl' }}
                    transition="all 0.3s"
                  >
                    <Image
                      src="https://images.unsplash.com/photo-1584982751601-97d9301a41b6?w=400&h=300&fit=crop"
                      alt="Olla a presión"
                      w="100%"
                      h="250px"
                      objectFit="cover"
                    />
                    <VStack p={6} spacing={3} align="flex-start">
                      <Heading as="h3" size="md">
                        Ollas a Presión
                      </Heading>
                      <Text color="gray.600" fontSize="sm">
                        Cocción rápida y segura para tus recetas favoritas
                      </Text>
                      <HStack spacing={1}>
                        <Icon as={MdCheckCircle} color="green.500" />
                        <Text fontSize="sm">Durables y hermosas</Text>
                      </HStack>
                    </VStack>
                  </Box>

                  <Box
                    bg="white"
                    borderRadius="lg"
                    overflow="hidden"
                    boxShadow="lg"
                    _hover={{ transform: 'translateY(-8px)', boxShadow: 'xl' }}
                    transition="all 0.3s"
                  >
                    <Image
                      src="https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&h=300&fit=crop"
                      alt="Accesorios de cocina"
                      w="100%"
                      h="250px"
                      objectFit="cover"
                    />
                    <VStack p={6} spacing={3} align="flex-start">
                      <Heading as="h3" size="md">
                        Accesorios Premium
                      </Heading>
                      <Text color="gray.600" fontSize="sm">
                        Incremente el potencial de su cocina con herramientas de calidad profesional
                      </Text>
                      <HStack spacing={1}>
                        <Icon as={MdCheckCircle} color="green.500" />
                        <Text fontSize="sm">Diseño ergonómico</Text>
                      </HStack>
                    </VStack>
                  </Box>
                </Grid>
              </VStack>
            </Container>
          </Box>

          {/* Por qué elegir Royal Prestige */}
          <Box bg="rgba(235, 248, 255, 0.92)" py={12} backdropFilter="blur(10px)">
            <Container maxW="container.xl">
              <Grid
                templateColumns={{ base: '1fr', md: 'repeat(2, 1fr)' }}
                gap={10}
                alignItems="center"
              >
                <Image
                  src="https://images.unsplash.com/photo-1507100115567-cc5400161f65?w=500&h=400&fit=crop"
                  alt="Cocina profesional"
                  borderRadius="lg"
                  boxShadow="lg"
                />
                <VStack align="flex-start" spacing={6}>
                  <Heading as="h2" size="xl">
                    ¿Por qué elegir Royal Prestige?
                  </Heading>
                  <HStack spacing={4}>
                    <Box
                      bg="blue.600"
                      color="white"
                      w="12"
                      h="12"
                      borderRadius="full"
                      display="flex"
                      alignItems="center"
                      justifyContent="center"
                      fontWeight="bold"
                      fontSize="lg"
                    >
                      ✓
                    </Box>
                    <VStack align="flex-start" spacing={0}>
                      <Text fontWeight="bold" fontSize="lg">
                        65+ años de experiencia
                      </Text>
                      <Text color="gray.600">Tradición y confianza en cada producto</Text>
                    </VStack>
                  </HStack>

                  <HStack spacing={4}>
                    <Box
                      bg="blue.600"
                      color="white"
                      w="12"
                      h="12"
                      borderRadius="full"
                      display="flex"
                      alignItems="center"
                      justifyContent="center"
                      fontWeight="bold"
                      fontSize="lg"
                    >
                      ✓
                    </Box>
                    <VStack align="flex-start" spacing={0}>
                      <Text fontWeight="bold" fontSize="lg">
                        50 años de garantía
                      </Text>
                      <Text color="gray.600">Respaldamos nuestros productos</Text>
                    </VStack>
                  </HStack>

                  <HStack spacing={4}>
                    <Box
                      bg="blue.600"
                      color="white"
                      w="12"
                      h="12"
                      borderRadius="full"
                      display="flex"
                      alignItems="center"
                      justifyContent="center"
                      fontWeight="bold"
                      fontSize="lg"
                    >
                      ✓
                    </Box>
                    <VStack align="flex-start" spacing={0}>
                      <Text fontWeight="bold" fontSize="lg">
                        Tecnología patentada
                      </Text>
                      <Text color="gray.600">Sistema de distribución de calor revolucionario</Text>
                    </VStack>
                  </HStack>

                  <HStack spacing={4}>
                    <Box
                      bg="blue.600"
                      color="white"
                      w="12"
                      h="12"
                      borderRadius="full"
                      display="flex"
                      alignItems="center"
                      justifyContent="center"
                      fontWeight="bold"
                      fontSize="lg"
                    >
                      ✓
                    </Box>
                    <VStack align="flex-start" spacing={0}>
                      <Text fontWeight="bold" fontSize="lg">
                        Sostenible y ético
                      </Text>
                      <Text color="gray.600">Compromiso con el medio ambiente</Text>
                    </VStack>
                  </HStack>
                </VStack>
              </Grid>
            </Container>
          </Box>

          {/* CTA Final */}
          <Box bg="rgba(255, 255, 255, 0.92)" py={12} backdropFilter="blur(10px)">
            <Container maxW="container.xl">
              <VStack
                bgGradient="linear(to-r, blue.600, blue.800)"
                color="white"
                p={12}
                borderRadius="lg"
                spacing={6}
                textAlign="center"
              >
                <Heading as="h2" size="xl">
                  Participa en nuestra Rifa Exclusiva
                </Heading>
                <Text fontSize="lg" maxW="600px">
                  Registra tus datos y date la oportunidad de ganar premios increíbles valorados en cientos de miles de pesos.
                </Text>
                <Text fontSize="lg" fontWeight="bold">
                  ¡No te lo pierdas!
                </Text>
                <Button
                  as={RouterLink}
                  to="/rifa"
                  bg="orange.400"
                  color="white"
                  size="lg"
                  fontSize="lg"
                  _hover={{ bg: 'orange.500' }}
                >
                  Quiero Participar 🎉
                </Button>
              </VStack>
            </Container>
          </Box>
        </VStack>
      </Box>
    </>
  );
}

export default Home;