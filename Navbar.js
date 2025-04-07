// src/components/Navbar.js
import React from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Box,
  Flex,
  HStack,
  IconButton,
  useDisclosure,
  Stack,
  Button,
  Text,
} from "@chakra-ui/react";
import { HamburgerIcon, CloseIcon } from "@chakra-ui/icons";

function isAuthenticated() {
  return !!localStorage.getItem("token");
}

const Navbar = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const navigate = useNavigate();
  const auth = isAuthenticated();

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <Box
      bgGradient="linear(to-r, teal.900, black)"
      px={4}
      boxShadow="md"
      position="sticky"
      top="0"
      zIndex="999"
    >
      <Flex h={16} alignItems="center" justifyContent="space-between">
        <IconButton
          size="md"
          icon={isOpen ? <CloseIcon /> : <HamburgerIcon />}
          aria-label="Open Menu"
          display={{ base: "block", md: "none" }}
          onClick={isOpen ? onClose : onOpen}
          colorScheme="teal"
          variant="outline"
        />

        <HStack spacing={8} alignItems="center">
          {/* Brand / Logo */}
          <Text
            as={Link}
            to="/"
            fontWeight="bold"
            fontSize="xl"
            color="teal.200"
            _hover={{ textDecoration: "none", color: "teal.300" }}
          >
            DataZen
          </Text>

          {/* Desktop Menu */}
          <HStack
            as="nav"
            spacing={4}
            display={{ base: "none", md: "flex" }}
            fontWeight="bold"
            color="gray.200"
          >
            <Link to="/">Home</Link>
            <Link to="/analyze">Analyze</Link>
            <Link to="/pricing">Pricing</Link>
            <Link to="/about">About</Link>
            <Link to="/inventory">Inventory</Link> {/* NEW */}
          </HStack>
        </HStack>

        {/* Right side: Login/Logout */}
        <Flex alignItems="center">
          {!auth && (
            <>
              <Button
                as={Link}
                to="/login"
                colorScheme="teal"
                size="sm"
                variant="outline"
                mr={2}
              >
                Login
              </Button>
              <Button
                as={Link}
                to="/register"
                colorScheme="teal"
                size="sm"
                variant="solid"
              >
                Sign Up
              </Button>
            </>
          )}
          {auth && (
            <Button colorScheme="teal" size="sm" variant="solid" onClick={handleLogout}>
              Logout
            </Button>
          )}
        </Flex>
      </Flex>

      {/* Mobile Nav */}
      {isOpen && (
        <Box pb={4} display={{ md: "none" }}>
          <Stack as="nav" spacing={4} fontWeight="bold" color="gray.200">
            <Link to="/" onClick={onClose}>
              Home
            </Link>
            <Link to="/analyze" onClick={onClose}>
              Analyze
            </Link>
            <Link to="/inventory" onClick={onClose}>
              Inventory
            </Link>
            <Link to="/pricing" onClick={onClose}>
              Pricing
            </Link>
            <Link to="/about" onClick={onClose}>
              About
            </Link>

            {!auth && (
              <>
                <Link to="/login" onClick={onClose}>
                  Login
                </Link>
                <Link to="/register" onClick={onClose}>
                  Sign Up
                </Link>
              </>
            )}
            {auth && (
              <Text
                cursor="pointer"
                onClick={() => {
                  handleLogout();
                  onClose();
                }}
              >
                Logout
              </Text>
            )}
          </Stack>
        </Box>
      )}
    </Box>
  );
};

export default Navbar;