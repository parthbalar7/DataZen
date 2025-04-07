// src/components/Register.js
import React, { useState } from "react";
import axios from "axios";
import { useToast } from "@chakra-ui/react";
import { useNavigate, Link as RouterLink } from "react-router-dom";
import {
  Box,
  Heading,
  Input,
  Button,
  Text,
  Stack,
  Link,
} from "@chakra-ui/react";

const Register = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const toast = useToast();
  const navigate = useNavigate();

  const handleRegister = async () => {
    if (!username || !password) {
      toast({
        title: "Missing credentials",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      return;
    }
    try {
      await axios.post("http://127.0.0.1:8008/api/register", {
        username,
        password,
      });
      toast({
        title: "Registration successful",
        description: "You can now log in.",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
      navigate("/login");
    } catch (err) {
      toast({
        title: "Registration Failed",
        description: err?.response?.data?.error || err.message,
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  return (
    <Box
      maxW="400px"
      mx="auto"
      mt={10}
      p={6}
      bg="#2c2c2c"
      borderRadius="md"
      boxShadow="lg"
      textAlign="center"
      color="gray.200"
    >
      <Heading mb={4}>Register</Heading>
      <Stack spacing={3}>
        <Input
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          bg="gray.700"
        />
        <Input
          placeholder="Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          bg="gray.700"
        />
        <Button colorScheme="teal" onClick={handleRegister}>
          Sign Up
        </Button>
      </Stack>
      <Text mt={4} fontSize="sm" color="gray.400">
        Already have an account?{" "}
        <Link as={RouterLink} to="/login" color="teal.300">Log In</Link>
      </Text>
    </Box>
  );
};

export default Register;