// src/components/Inventory.js
import React, { useEffect, useState, useMemo } from "react";
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
  Input,
  Flex,
} from "@chakra-ui/react";
import Plot from "react-plotly.js";
import { useNavigate } from "react-router-dom";

function Inventory() {
  const [inventory, setInventory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");          // NEW
  const toast = useToast();
  const navigate = useNavigate();

  // ───────── fetch once on mount ─────────
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }
    fetchInventory();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchInventory = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get("http://127.0.0.1:8008/api/inventory", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setInventory(res.data);
    } catch (err) {
      toast({
        title: "Error fetching inventory",
        description: err.message,
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
    }
  };

  // ───────── live filter (case‑insensitive startsWith) ─────────
  const filteredInv = useMemo(() => {
    if (!search.trim()) return inventory;
    return inventory.filter((item) =>
      item.Product?.toLowerCase().startsWith(search.toLowerCase())
    );
  }, [search, inventory]);

  // Prepare data for Plotly bar chart
  const productNames = filteredInv.map((i) => i.Product);
  const quantities   = filteredInv.map((i) => i.InventoryQuantity);

  return (
    <Box p={6} color="gray.200">
      <Heading mb={4} color="teal.200">
        Inventory Overview
      </Heading>
      <Text mb={6} color="gray.300">
        This reflects the <strong>most recent CSV upload</strong> data grouped
        by Product.
      </Text>

      {/* Live Search Bar */}
      <Flex mb={4} maxW="400px">
        <Input
          placeholder="Search product (e.g., pick)"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          bg="#2c2c2c"
          color="gray.200"
        />
      </Flex>

      {loading ? (
        <Spinner size="xl" />
      ) : (
        <>
          {inventory.length === 0 ? (
            <Text>
              No inventory data found. Please upload a CSV with{" "}
              <code>Product</code> &amp; <code>InventoryQuantity</code> columns.
            </Text>
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
                      <Th isNumeric>Inventory Quantity</Th>
                    </Tr>
                  </Thead>
                  <Tbody>
                    {filteredInv.map((item) => {
                      const isLow = item.InventoryQuantity < 10;
                      return (
                        <Tr key={item.Product}>
                          <Td color={isLow ? "red.300" : undefined}>
                            {item.Product}
                          </Td>
                          <Td isNumeric color={isLow ? "red.300" : undefined}>
                            {item.InventoryQuantity}
                          </Td>
                        </Tr>
                      );
                    })}
                  </Tbody>
                </Table>
                {filteredInv.length === 0 && (
                  <Text mt={3} color="gray.400">
                    No products match “{search}”.
                  </Text>
                )}
              </Box>
            </>
          )}
        </>
      )}
    </Box>
  );
}

export default Inventory;
