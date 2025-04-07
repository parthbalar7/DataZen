// src/components/Inventory.js
import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Box,
  Heading,
  Text,
  useToast,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Spinner,
} from "@chakra-ui/react";
import Plot from "react-plotly.js";
import { useNavigate } from "react-router-dom";

function Inventory() {
  const [inventory, setInventory] = useState([]);
  const [loading, setLoading] = useState(false);

  const toast = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is authenticated
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }

    // Fetch inventory
    fetchInventory();
  }, [navigate]);

  const fetchInventory = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get("http://127.0.0.1:8008/api/inventory", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setInventory(res.data);
      setLoading(false);
    } catch (err) {
      console.error(err);
      toast({
        title: "Error fetching inventory",
        description: err.message,
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      setLoading(false);
    }
  };

  // Prepare data for Plotly bar chart
  const productNames = inventory.map((item) => item.Product);
  const quantities = inventory.map((item) => item.InventoryQuantity);

  return (
    <Box p={6} color="gray.200">
      <Heading mb={4} color="teal.200">
        Inventory Overview
      </Heading>
      <Text mb={6} color="gray.300">
        This reflects the <strong>most recent CSV upload</strong> data grouped by Product.
      </Text>

      {loading ? (
        <Spinner size="xl" />
      ) : (
        <>
          {inventory.length === 0 ? (
            <Text>No inventory data found. Please upload a CSV with Product &amp; InventoryQuantity columns.</Text>
          ) : (
            <>
              {/* Bar Chart */}
              <Box bg="#2c2c2c" p={4} borderRadius="md" mb={8}>
                <Heading as="h2" size="md" mb={2} color="teal.200">
                  Inventory By Product
                </Heading>
                <Plot
                  data={[
                    {
                      x: productNames,
                      y: quantities,
                      type: "bar",
                      marker: { color: "teal" },
                    },
                  ]}
                  layout={{
                    title: "Product vs. Inventory Quantity",
                    paper_bgcolor: "#2c2c2c",
                    plot_bgcolor: "#2c2c2c",
                    font: { color: "#f0f0f0" },
                    xaxis: { title: "Product" },
                    yaxis: { title: "Quantity" },
                    margin: { t: 60, b: 80, l: 60, r: 30 },
                  }}
                  style={{ width: "100%", height: "400px" }}
                />
              </Box>

              {/* Table */}
              <Box bg="#2c2c2c" p={4} borderRadius="md">
                <Heading as="h2" size="md" mb={2} color="teal.200">
                  Detailed Inventory Table
                </Heading>
                <Table colorScheme="teal" size="sm">
                  <Thead>
                    <Tr>
                      <Th>Product</Th>
                      <Th>Inventory Quantity</Th>
                    </Tr>
                  </Thead>
                  <Tbody>
                    {inventory.map((item) => {
                      const isLow = item.InventoryQuantity < 10; 
                      return (
                        <Tr key={item.Product}>
                          <Td color={isLow ? "red.300" : undefined}>
                            {item.Product}
                          </Td>
                          <Td color={isLow ? "red.300" : undefined}>
                            {item.InventoryQuantity}
                          </Td>
                        </Tr>
                      );
                    })}
                  </Tbody>
                </Table>
              </Box>
            </>
          )}
        </>
      )}
    </Box>
  );
}

export default Inventory;