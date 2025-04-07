// src/components/About.js
import React from "react";
import {
  Box,
  Heading,
  Text,
  SimpleGrid,
  VStack,
  Link,
  useColorModeValue,
} from "@chakra-ui/react";

const About = () => {
  const sectionBg = useColorModeValue("#2c2c2c", "#1e1e1e");
  const sectionTextColor = useColorModeValue("gray.100", "gray.300");

  return (
    <Box textAlign="center">
      {/* Intro / Hero Section */}
      <Box
        bgGradient="linear(to-r, teal.900, black)"
        py={{ base: 10, md: 16 }}
        px={{ base: 4, md: 8 }}
      >
        <Heading as="h1" mb={4} color="teal.200" fontSize={{ base: "2xl", md: "4xl" }}>
          About DataZen
        </Heading>
        <Text fontSize={{ base: "md", md: "lg" }} color="gray.300" maxW="800px" mx="auto">
          DataZen is a powerful data analysis tool designed to help businesses
          unlock actionable insights from their sales data. By leveraging
          interactive visualizations and clear recommendations, we make
          data-driven decisions accessible and effortless.
        </Text>
      </Box>

      {/* Mission Section */}
      <Box
        bg={sectionBg}
        color={sectionTextColor}
        py={{ base: 10, md: 16 }}
        px={{ base: 4, md: 8 }}
      >
        <Heading as="h2" size="xl" mb={6}>
          Our Mission
        </Heading>
        <Text fontSize="lg" maxW="800px" mx="auto" mb={8}>
          We strive to empower business owners with intuitive, modern tools
          that simplify the complexities of sales analytics. Our goal is to help
          you gain a competitive edge with minimal effort—simply upload your data,
          and let DataZen do the rest.
        </Text>
      </Box>

      {/* Team Section (Name, Role, Interests Only) */}
      <Box
        py={{ base: 10, md: 16 }}
        px={{ base: 4, md: 8 }}
        bg="#1e1e1e"
        color="gray.300"
      >
        <Heading as="h2" size="xl" mb={6}>
          Meet Our Creators
        </Heading>
        <Text fontSize="lg" mb={12} maxW="800px" mx="auto">
          DataZen is brought to you by a dedicated team of developers and data enthusiasts.
        </Text>

        <SimpleGrid columns={{ base: 1, md: 3 }} spacing={8} maxW="900px" mx="auto">
          <TeamMember
            name="Parth Balar"
            role="Full Stack Developer"
            interests="Parth is passionate about building scalable apps and ensuring seamless user experiences."
          />
          <TeamMember
            name="Disha Gabani"
            role="Data Analyst"
            interests="Disha specializes in transforming raw data into actionable insights."
          />
          <TeamMember
            name="Dhruvi Ramani"
            role="UI/UX Designer"
            interests="Dhruvi loves crafting intuitive interfaces that delight users."
          />
        </SimpleGrid>
      </Box>

      {/* Contact Us Section */}
      <Box
        bg={sectionBg}
        color={sectionTextColor}
        py={{ base: 10, md: 16 }}
        px={{ base: 4, md: 8 }}
      >
        <Heading as="h2" size="xl" mb={6}>
          Contact Us
        </Heading>
        <Text fontSize="lg" mb={8} maxW="800px" mx="auto">
          Got questions or feedback? We’d love to hear from you.
        </Text>

        <Box
          bg="#2c2c2c"
          p={6}
          borderRadius="md"
          boxShadow="lg"
          maxW="600px"
          mx="auto"
        >
          <Heading as="h3" size="md" mb={4} color="teal.200">
            Get in Touch
          </Heading>
          <Text fontSize="sm" mb={4}>
            For general inquiries, you can reach us at:
          </Text>
          <Link
            href="mailto:support@datazen.com"
            color="teal.300"
            fontWeight="bold"
            mb={6}
            display="inline-block"
          >
            support_datazen@gmail.com
          </Link>
          <Text fontSize="sm" mb={4}>
            Or connect with any of our creators:
          </Text>
          <Text fontSize="sm" mb={4}>
            <strong>Parth Balar:</strong> &nbsp;
            <Link href="mailto:parth@datazen.com" color="teal.300">
            parthbalar14@gmail.com
            </Link>
          </Text>
          <Text fontSize="sm" mb={4}>
            <strong>Disha Gabani:</strong> &nbsp;
            <Link href="mailto:disha@datazen.com" color="teal.300">
            dishagabani83787@gmail.com
            </Link>
          </Text>
          <Text fontSize="sm" mb={4}>
            <strong>Dhruvi Ramani:</strong> &nbsp;
            <Link href="mailto:dhruvi@datazen.com" color="teal.300">
            dhruviramani10.dr@gmail.com
            </Link>
          </Text>

          <Text fontSize="sm" mt={4}>
            We aim to respond within 24 hours!
          </Text>
        </Box>
      </Box>
    </Box>
  );
};

/**
 * TeamMember Component
 * Displays only Name, Role, and a short "interests" or "bio" text.
 */
const TeamMember = ({ name, role, interests }) => {
  return (
    <VStack
      spacing={4}
      bg="#2c2c2c"
      p={6}
      borderRadius="md"
      boxShadow="md"
      transition="transform 0.2s"
      _hover={{ transform: "translateY(-5px)" }}
    >
      <Heading as="h4" size="md" color="teal.200">
        {name}
      </Heading>
      <Text fontSize="sm" color="gray.400" fontStyle="italic">
        {role}
      </Text>
      <Text fontSize="sm" color="gray.300" textAlign="center">
        {interests}
      </Text>
    </VStack>
  );
};

export default About;