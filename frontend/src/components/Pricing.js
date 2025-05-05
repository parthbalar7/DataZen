// src/components/Pricing.js
import React from "react";
import {
  Box,
  Heading,
  Text,
  SimpleGrid,
  Button,
  VStack,
  Badge,
  useColorModeValue,
} from "@chakra-ui/react";

const Pricing = () => {
  const sectionBg = useColorModeValue("#2c2c2c", "#1e1e1e");
  const textColor = useColorModeValue("gray.100", "gray.300");

  return (
    <Box textAlign="center">
      {/* Hero / Intro Section */}
      <Box
        bgGradient="linear(to-r, teal.900, black)"
        py={{ base: 10, md: 16 }}
        px={{ base: 4, md: 8 }}
        color="teal.200"
      >
        <Heading as="h1" mb={4} fontSize={{ base: "2xl", md: "4xl" }}>
          Flexible Pricing for Every Need
        </Heading>
        <Text fontSize={{ base: "md", md: "lg" }} color="gray.300" maxW="800px" mx="auto">
          Choose a DataZen plan that best suits your business. Whether you’re
          just starting or a seasoned enterprise, we have you covered.
        </Text>
      </Box>

      {/* Pricing Card Grid */}
      <Box
        bg={sectionBg}
        color={textColor}
        py={{ base: 10, md: 16 }}
        px={{ base: 4, md: 8 }}
      >
        <Heading as="h2" size="xl" mb={6}>
          Our Plans
        </Heading>
        <Text fontSize="lg" mb={12} maxW="600px" mx="auto" color="gray.300">
          Transparent pricing. No hidden fees. Scale your analytics as you grow.
        </Text>

        <SimpleGrid columns={{ base: 1, md: 3 }} spacing={8} maxW="1000px" mx="auto">
          {/* Basic Plan */}
          <PricingCard
            planName="Basic"
            price="$10"
            features={[
              "Basic Data Analysis",
              "Limited Visualizations",
              "Rule-based Insights",
            ]}
            buttonText="Choose Basic"
            onClick={() => alert("Basic plan chosen")}
          />

          {/* Pro Plan (Highlighted) */}
          <PricingCard
            planName="Pro"
            price="$30"
            features={[
              "Advanced Visualizations",
              "Comprehensive Insights",
              "Priority Support",
            ]}
            isPopular
            buttonText="Choose Pro"
            onClick={() => alert("Pro plan chosen")}
          />

          {/* Enterprise Plan */}
          <PricingCard
            planName="Enterprise"
            price="$100"
            features={[
              "Custom Solutions",
              "Full API Access",
              "24/7 Support",
            ]}
            buttonText="Contact Us"
            onClick={() => alert("Enterprise plan contact")}
          />
        </SimpleGrid>
      </Box>

      {/* CTA Section */}
      <Box
        bgGradient="linear(to-r, black, teal.900)"
        py={{ base: 10, md: 16 }}
        px={{ base: 4, md: 8 }}
        textAlign="center"
      >
        <Heading as="h3" size="lg" color="teal.200" mb={4}>
          Start Your DataZen Journey Today
        </Heading>
        <Text fontSize="md" color="gray.300" mb={6} maxW="600px" mx="auto">
          Unlock deeper insights, powerful analytics, and a competitive edge for
          your business. Join thousands of successful teams using DataZen.
        </Text>
        <Button colorScheme="teal" size="lg" onClick={() => alert("Sign Up!")}>
          Get Started
        </Button>
      </Box>
    </Box>
  );
};

/**
 * PricingCard Component
 * Displays a plan name, price, features, and a CTA button.
 * If `isPopular` is true, display a badge to highlight the plan.
 */
const PricingCard = ({ planName, price, features, buttonText, onClick, isPopular }) => {
  return (
    <VStack
      bg="#1e1e1e"
      p={6}
      borderRadius="md"
      spacing={4}
      boxShadow="lg"
      transition="transform 0.2s"
      _hover={{ transform: "translateY(-5px)" }}
      position="relative"
    >
      {isPopular && (
        <Badge
          colorScheme="teal"
          position="absolute"
          top={4}
          right={4}
          fontSize="0.8em"
        >
          Most Popular
        </Badge>
      )}
      <Heading as="h3" size="md" color="teal.200">
        {planName}
      </Heading>
      <Text fontSize="2xl" fontWeight="bold" color="gray.100">
        {price}/month
      </Text>

      <Box as="ul" textAlign="left" color="gray.300" my={4}>
        {features.map((feature, idx) => (
          <li key={idx} style={{ marginBottom: "0.5rem" }}>
            {feature}
          </li>
        ))}
      </Box>

      <Button colorScheme="teal" onClick={onClick}>
        {buttonText}
      </Button>
    </VStack>
  );
};

export default Pricing;