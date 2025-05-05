// src/components/Login.js
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

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const toast = useToast();
  const navigate = useNavigate();

  const handleLogin = async () => {
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
      const res = await axios.post("http://127.0.0.1:8008/api/login", {
        username,
        password,
      });
      // If successful, store token in localStorage
      localStorage.setItem("token", res.data.token);

      toast({
        title: "Logged in",
        description: "Welcome back!",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
      navigate("/analyze");
    } catch (err) {
      toast({
        title: "Login Failed",
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
      <Heading mb={4}>Log In</Heading>
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
        <Button colorScheme="teal" onClick={handleLogin}>
          Login
        </Button>
      </Stack>
      <Text mt={4} fontSize="sm" color="gray.400">
        Or <Link as={RouterLink} to="/register" color="teal.300">Register</Link> a new account
      </Text>
    </Box>
  );
};

export default Login;