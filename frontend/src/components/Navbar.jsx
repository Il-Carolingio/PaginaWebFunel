// frontend/src/components/Navbar.jsx
import { Link as RouterLink, useLocation } from "react-router-dom";
import {
  Box,
  Flex,
  Heading,
  Link,
  Stack,
  IconButton,
  useDisclosure,
  Collapse,
  Image,
} from "@chakra-ui/react";
import { HamburgerIcon, CloseIcon } from "@chakra-ui/icons";
import { useState } from "react";

function Navbar() {
  const { isOpen, onToggle } = useDisclosure();
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  const navLinks = [
    { path: "/", label: "Home" },
    { path: "/rifa", label: "🎁 Rifa" },
    { path: "/catalogo", label: "📦 Catálogo" },
    { path: "/reclutamiento", label: "🤝 Únete al equipo" },
    { path: "/crm", label: "📋 CRM" },
  ];

  return (
    <Box
      bg="rgba(97, 136, 177, 0.8)"
      color="white"
      px={{ base: 4, md: 8 }}
      py={1}
      boxShadow="lg"
      zIndex={1000}
      position="fixed"
      top="0"
      left="0"
      right="0"
      width="100%"
      backdropFilter="blur(12px)"
      borderBottom="1px solid"
      borderColor="rgba(255, 255, 255, 0.1)"
      transition="all 0.3s ease"
    >
      <Flex
        align="center"
        justify="space-between"
        maxW="container.xl"
        mx="auto"
      >
        <Link as={RouterLink} to="/" display="flex" alignItems="center">
          <Image
            src="/homeImages/FullLogo_Transparent_NoBufferH.png"
            ml={10}
            borderRadius="10%"
            alt="Casa Pleroma"
            position="overlay"
            height={{ base: "30px", md: "50px", lg: "100px" }} // Móvil: 30px, Tablet: 50px, Escritorio: 60px
            width="auto"
            objectFit="contain"
            _hover={{ opacity: 0.8 }}
            transition="opacity 0.2s"
          />
        </Link>

        {/* Desktop Menu */}
        <Stack
          direction={{ base: "none", md: "row" }}
          spacing={6}
          align="center"
          flex="1"
          justify="flex-end"
          display={{ base: "none", md: "flex" }}
        >
          {navLinks.map((link) => (
            <Link
              key={link.path}
              as={RouterLink}
              to={link.path}
              position="relative"
              fontWeight={isActive(link.path) ? "bold" : "medium"}
              color={isActive(link.path) ? "white" : "rgba(255,255,255,0.85)"}
              _hover={{
                textDecoration: "none",
                color: "white",
                transform: "translateY(-2px)",
                _after: {
                  transform: "scaleX(1)",
                },
              }}
              transition="all 0.2s"
              _after={{
                content: '""',
                position: "absolute",
                bottom: "-4px",
                left: 0,
                right: 0,
                height: "2px",
                bg: "white",
                transform: isActive(link.path) ? "scaleX(1)" : "scaleX(0)",
                transition: "transform 0.2s ease",
                borderRadius: "full",
              }}
            >
              {link.label}
            </Link>
          ))}
        </Stack>

        {/* Mobile Menu Button */}
        <IconButton
          display={{ base: "flex", md: "none" }}
          onClick={onToggle}
          icon={isOpen ? <CloseIcon /> : <HamburgerIcon />}
          variant="ghost"
          color="white"
          _hover={{ bg: "rgba(255,255,255,0.1)" }}
          aria-label="Toggle Navigation"
        />
      </Flex>

      {/* Mobile Menu */}
      <Collapse in={isOpen} animateOpacity>
        <Stack
          direction="column"
          spacing={3}
          mt={4}
          pb={4}
          display={{ base: "flex", md: "none" }}
          align="center"
        >
          {navLinks.map((link) => (
            <Link
              key={link.path}
              as={RouterLink}
              to={link.path}
              onClick={onToggle}
              fontWeight={isActive(link.path) ? "bold" : "medium"}
              color={isActive(link.path) ? "white" : "rgba(255,255,255,0.85)"}
              _hover={{
                textDecoration: "none",
                color: "red",
                transform: "translateX(5px)",
              }}
              transition="all 0.2s"
            >
              {link.label}
            </Link>
          ))}
        </Stack>
      </Collapse>
    </Box>
  );
}

export default Navbar;
