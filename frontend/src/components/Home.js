// src/components/Home.js

import React from "react";
import { Link } from "react-router-dom";
import {
  Box,
  Heading,
  Text,
  Button,
  Flex,
  Stack,
  SimpleGrid,
  Icon,
  Image,
  keyframes,
} from "@chakra-ui/react";
import { CheckIcon } from "@chakra-ui/icons";

const Home = () => {
  // Subtle floating animation
  const floatAnimation = keyframes`
    0% { transform: translateY(0px); }
    50% { transform: translateY(10px); }
    100% { transform: translateY(0px); }
  `;
  const floatAnimationStr = `${floatAnimation} 4s ease-in-out infinite`;

  return (
    <Box color="gray.200">
      {/* Hero Section with subtle animation */}
      <Flex
        direction={{ base: "column", md: "row" }}
        align="center"
        justify="center"
        py={{ base: 10, md: 20 }}
        px={{ base: 4, md: 8 }}
        bgGradient="linear(to-r, #2c2c2c, #1e1e1e)"
        position="relative"
      >
        <Box
          flex="1"
          textAlign={{ base: "center", md: "left" }}
          mb={{ base: 8, md: 0 }}
          animation={floatAnimationStr}
        >
          <Heading as="h1" size="2xl" fontWeight="bold" mb={4}>
            Welcome to DataZen
          </Heading>
          <Text fontSize="lg" mb={6} color="gray.300" maxW="600px" mx={{ base: "auto", md: 0 }}>
            Harness the power of interactive data analytics and get actionable
            insights instantly. Simplify decision-making with our intuitive
            visualizations.
          </Text>
          <Link to="/analyze">
            <Button colorScheme="teal" variant="solid" size="lg">
              Get Started
            </Button>
          </Link>
        </Box>
      </Flex>

      {/* Features Section */}
      <Box py={{ base: 10, md: 16 }} px={{ base: 4, md: 8 }}>
        <Heading as="h2" size="xl" textAlign="center" mb={10}>
          Why DataZen?
        </Heading>
        <SimpleGrid columns={{ base: 1, md: 3 }} spacing={8}>
          <FeatureCard
            title="Interactive Visualizations"
            text="Make sense of your data at a glance. From line charts to heatmaps, DataZen presents your metrics in a clear, visually appealing way."
          />
          <FeatureCard
            title="Actionable Insights"
            text="Our rule-based engine highlights best-selling products, underperforming categories, and provides promotional recommendations."
          />
          <FeatureCard
            title="Quick & Easy Setup"
            text="Upload your CSV, apply date filters, and instantly see your data come to life. No complicated setup or coding required."
          />
        </SimpleGrid>
      </Box>

      {/* Live Stats with microanimation */}
      <Box
        py={{ base: 10, md: 16 }}
        px={{ base: 4, md: 8 }}
        bg="#1e1e1e"
        textAlign="center"
      >
        <Heading as="h2" size="xl" mb={6}>
          DataZen at a Glance
        </Heading>
        <Text fontSize="lg" mb={12} color="gray.300" maxW="800px" mx="auto">
          Trusted by small businesses and enterprises alike to drive data-driven decisions.
        </Text>

        <SimpleGrid columns={{ base: 1, md: 3 }} spacing={8}>
          <StatsCard label="Avg. Analysis Time" value="1 min" />
          <StatsCard label="Revenue Growth" value="35%" />
          <StatsCard label="Avg. Setup Time" value="2 min" />
        </SimpleGrid>
      </Box>

      {/* CTA Section */}
      <Box textAlign="center" py={{ base: 10, md: 16 }} px={{ base: 4, md: 8 }}>
        <Heading as="h3" size="lg" mb={4}>
          Ready to Transform Your Sales Data?
        </Heading>
        <Text fontSize="md" mb={6} color="gray.300">
          Join thousands of businesses using DataZen to gain real-time insights and grow faster.
        </Text>
        <Link to="/analyze">
          <Button colorScheme="teal" size="lg">
            Start Analyzing
          </Button>
        </Link>
      </Box>
    </Box>
  );
};

/* Reuse your existing FeatureCard, StatsCard definitions, etc. */

const FeatureCard = ({ title, text }) => {
  return (
    <Box
      bg="#2c2c2c"
      p={6}
      borderRadius="md"
      boxShadow="md"
      textAlign="left"
      transition="transform 0.2s"
      _hover={{ transform: "translateY(-5px)" }}
    >
      <Flex align="center" mb={4}>
        <Icon as={CheckIcon} boxSize={6} color="teal.300" mr={2} />
        <Heading as="h4" size="md">
          {title}
        </Heading>
      </Flex>
      <Text color="gray.300">{text}</Text>
    </Box>
  );
};

const StatsCard = ({ label, value }) => {
  return (
    <Box
      bg="#2c2c2c"
      p={6}
      borderRadius="md"
      boxShadow="md"
      transition="transform 0.2s"
      _hover={{ transform: "translateY(-5px)" }}
    >
      <Heading as="h4" size="xl" color="teal.300" mb={2}>
        {value}
      </Heading>
      <Text color="gray.100">{label}</Text>
    </Box>
  );
};

export default Home;
