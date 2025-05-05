// src/components/Analyze.js
import React, { useState, useEffect } from "react";
import axios from "axios";
import Plot from "react-plotly.js";
import {
  Box,
  Heading,
  Button,
  Spinner,
  Input,
  useToast,
  Text,
  Flex,
  Divider,
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  AccordionIcon,
  Stack,
  Switch,
  FormControl,
  FormLabel,
  SimpleGrid,
  Card,
  CardHeader,
  CardBody,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  UnorderedList,
  ListItem,
  Tooltip,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Badge   // <--- NEW for cluster badge
} from "@chakra-ui/react";

// Helper function to pick badge color
function pickColorScheme(clusterId) {
  const colors = ["blue", "green", "purple", "orange", "pink", "yellow"];
  return colors[clusterId % colors.length] || "gray";
}
const pickColor = pickColorScheme;
// A small badge component for cluster label
function ClusterBadge({ clusterId }) {
  const colorScheme = pickColorScheme(clusterId);
  return (
    <Badge colorScheme={colorScheme} px={2} py={1} borderRadius="md">
      Cluster {clusterId}
    </Badge>
  );
}

const Analyze = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(false);

  // Date Filters
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  // Forecast Toggle
  const [showForecast, setShowForecast] = useState(false);

  const toast = useToast();
  const CHART_H = 500;
  // ------------------ Tutorial Logic ------------------
  const hasSeenTutorial = localStorage.getItem("hasSeenAnalyzeTutorial") === "true";
  const [showTutorial, setShowTutorial] = useState(!hasSeenTutorial);

  const {
    isOpen: isTutorialOpen,
    onOpen: onTutorialOpen,
    onClose: onTutorialClose,
  } = useDisclosure();

  useEffect(() => {
    if (showTutorial) {
      onTutorialOpen();
    }
  }, [showTutorial, onTutorialOpen]);

  const closeTutorial = () => {
    localStorage.setItem("hasSeenAnalyzeTutorial", "true");
    setShowTutorial(false);
    onTutorialClose();
  };
  // ------------------ End Tutorial Logic ------------------

  // Handle file selection
  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]);
    setAnalysis(null);
  };

  // Upload CSV + optional date filters
  const handleUpload = async () => {
    if (!selectedFile) {
      toast({
        title: "No file selected",
        description: "Please choose a CSV file to analyze",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("file", selectedFile);
      if (startDate) formData.append("startDate", startDate);
      if (endDate) formData.append("endDate", endDate);

      // Retrieve JWT token from localStorage
      const token = localStorage.getItem("token");

      // Include Authorization header for protected endpoint
      const res = await axios.post("http://127.0.0.1:8008/api/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      });
      setAnalysis(res.data);

      toast({
        title: "Analysis Complete",
        description: "Your charts and insights have been updated.",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
    } catch (err) {
      toast({
        title: "Upload Error",
        description: err.message,
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box p={4} textAlign="center" color="gray.200">
      <Heading as="h1" mb={4}>
        Analyze Your Data{" "}
        <Tooltip
          label="Use this page to upload your CSV and generate charts & insights."
          fontSize="sm"
          bg="gray.700"
          color="gray.100"
        >
          <span style={{ cursor: "help", marginLeft: "6px" }}>?</span>
        </Tooltip>
      </Heading>
      <Text fontSize="lg" mb={6} color="gray.300" maxW="800px" mx="auto">
        Upload your CSV file, set date filters, and explore interactive charts, insights, and forecasts.
      </Text>

      {/* Show Tutorial Button (can always re-open the modal) */}
      <Button
        colorScheme="blue"
        variant="outline"
        size="sm"
        mb={4}
        onClick={() => setShowTutorial(true)}
      >
        Show Tutorial
      </Button>

      {/* File Upload + Date Filters */}
      <Box
        bg="#2c2c2c"
        p={6}
        borderRadius="md"
        boxShadow="lg"
        maxW="800px"
        mx="auto"
        mb={8}
      >
        <Stack spacing={4}>
          <Heading as="h2" size="md" textAlign="left" color="teal.200">
            Step 1: Upload CSV File{" "}
            <Tooltip
              label="Select a .csv file with at least a 'Date' column and a 'Sales' column."
              fontSize="sm"
              bg="gray.700"
              color="gray.100"
            >
              <span style={{ cursor: "help", marginLeft: "6px" }}>?</span>
            </Tooltip>
          </Heading>
          <Input type="file" onChange={handleFileChange} variant="unstyled" />

          <Divider borderColor="gray.600" />

          <Heading as="h2" size="md" textAlign="left" color="teal.200">
            Step 2: Optional Date Filter{" "}
            <Tooltip
              label="Narrow your analysis to a date range (start and/or end). Leave blank for all data."
              fontSize="sm"
              bg="gray.700"
              color="gray.100"
            >
              <span style={{ cursor: "help", marginLeft: "6px" }}>?</span>
            </Tooltip>
          </Heading>
          <Text fontSize="sm" color="gray.400" textAlign="left">
            Narrow your analysis by selecting a start and/or end date.
          </Text>

          <Flex justifyContent="space-between" flexWrap="wrap" gap={4}>
            <Box>
              <Heading as="h4" size="xs" mb={1}>
                Start Date
              </Heading>
              <Input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                maxW="200px"
              />
            </Box>
            <Box>
              <Heading as="h4" size="xs" mb={1}>
                End Date
              </Heading>
              <Input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                maxW="200px"
              />
            </Box>
          </Flex>

          <Button onClick={handleUpload} colorScheme="teal" alignSelf="flex-start">
            Analyze
          </Button>

          {loading && <Spinner size="xl" color="teal.300" alignSelf="center" />}
        </Stack>
      </Box>

      {/* Step 3: Charts + Insights */}
      {analysis && (
        <Box>
          <Flex
            justifyContent="space-between"
            alignItems="center"
            maxW="1000px"
            mx="auto"
            mb={4}
          >
            <Heading as="h2" size="md" color="teal.200">
              Step 3: Results &amp; Insights{" "}
              <Tooltip
                label="View automatically generated insights and charts based on your data."
                fontSize="sm"
                bg="gray.700"
                color="gray.100"
              >
                <span style={{ cursor: "help", marginLeft: "6px" }}>?</span>
              </Tooltip>
            </Heading>
            {/* Forecast Toggle */}
            <FormControl display="flex" alignItems="center" justifyContent="center">
              <FormLabel
                htmlFor="forecast-switch"
                mb="0"
                color="gray.300"
                fontSize="sm"
                mr={2}
              >
                Show Sales Forecast
              </FormLabel>
              <Switch
                id="forecast-switch"
                colorScheme="teal"
                onChange={(e) => setShowForecast(e.target.checked)}
                isChecked={showForecast}
              />
            </FormControl>
          </Flex>

          {/* Insights Dashboard */}
          {analysis.insights && (
            <Box
              bg="#2c2c2c"
              p={4}
              borderRadius="md"
              maxW="1000px"
              mx="auto"
              mb={8}
              boxShadow="lg"
            >
              <Heading as="h3" size="md" mb={4} color="teal.200">
                Insights Dashboard{" "}
                <Tooltip
                  label="Automatic highlights: best sellers, inventory alerts, and promotional tips."
                  fontSize="sm"
                  bg="gray.700"
                  color="gray.100"
                >
                  <span style={{ cursor: "help", marginLeft: "6px" }}>?</span>
                </Tooltip>
              </Heading>
              <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={4}>
                <Card bg="#1e1e1e" boxShadow="md">
                  <CardHeader color="teal.300" fontWeight="bold" fontSize="md">
                    Best Seller
                  </CardHeader>
                  <CardBody>
                    <Text fontSize="sm" color="gray.300">
                      {analysis.insights.best_seller || "No best seller info"}
                    </Text>
                  </CardBody>
                </Card>

                <Card bg="#1e1e1e" boxShadow="md">
                  <CardHeader color="red.300" fontWeight="bold" fontSize="md">
                    Underperforming Category
                  </CardHeader>
                  <CardBody>
                    <Text fontSize="sm" color="gray.300">
                      {analysis.insights.low_category || "No category info"}
                    </Text>
                  </CardBody>
                </Card>

                <Card bg="#1e1e1e" boxShadow="md">
                  <CardHeader color="blue.300" fontWeight="bold" fontSize="md">
                    Peak Sales
                  </CardHeader>
                  <CardBody>
                    <Text fontSize="sm" color="gray.300">
                      {analysis.insights.seasonal_trend || "No category info"}
                    </Text>
                  </CardBody>
                </Card>

                <Card bg="#1e1e1e" boxShadow="md">
                  <CardHeader color="red.300" fontWeight="bold" fontSize="md">
                    Least Sales Month
                  </CardHeader>
                  <CardBody>
                    <Text fontSize="sm" color="gray.300">
                      {analysis.insights.least_trend || "No category info"}
                    </Text>
                  </CardBody>
                </Card>

                <Card bg="#1e1e1e" boxShadow="md">
                  <CardHeader color="pink.300" fontWeight="bold" fontSize="md">
                    Sales Drop
                  </CardHeader>
                  <CardBody>
                    <Text fontSize="sm" color="gray.300">
                      {analysis.insights.sales_drop_alert || "No major drop."}
                    </Text>
                  </CardBody>
                </Card>

                <Card bg="#1e1e1e" boxShadow="md">
                  <CardHeader color="yellow.400" fontWeight="bold" fontSize="md">
                    ⚠️ Inventory Warning
                  </CardHeader>
                  <CardBody>
                    <Text fontSize="sm" color="gray.300">
                      {analysis.insights.inventory_alert
                        ? analysis.insights.inventory_alert
                        : analysis.insights.critical_inventory
                        ? analysis.insights.critical_inventory
                        : "No low inventory detected."}
                    </Text>
                  </CardBody>
                </Card>

                <Card bg="#1e1e1e" boxShadow="md">
                  <CardHeader color="green.300" fontWeight="bold" fontSize="md">
                    💡 Marketing Recommendation
                  </CardHeader>
                  <CardBody>
                    <Text fontSize="sm" color="gray.300">
                      {analysis.insights.promotion || "No marketing tips"}
                    </Text>
                  </CardBody>
                </Card>

                <Card bg="#1e1e1e" boxShadow="md">
                  <CardHeader color="purple.300" fontWeight="bold" fontSize="md">
                    Customer Loyalty
                  </CardHeader>
                  <CardBody>
                    <Text fontSize="sm" color="gray.300">
                      {analysis.insights.loyal_customer ||
                        "No high-value customer found."}
                    </Text>
                  </CardBody>
                </Card>
              </SimpleGrid>
            </Box>
          )}

          {/* Charts Accordion */}
          <Accordion allowMultiple maxW="1000px" mx="auto" textAlign="left">
            {/* Sales Over Time */}
            {analysis.charts?.sales_over_time?.dates && (
              <AccordionItem>
                <AccordionButton _expanded={{ bg: "gray.700" }}>
                  <Box flex="1" textAlign="left">
                    Sales Over Time{" "}
                    <Tooltip
                      label="Line chart of daily sales totals. Hover points for exact values."
                      fontSize="sm"
                      bg="gray.700"
                      color="gray.100"
                    >
                      <span style={{ cursor: "help", marginLeft: "6px" }}>?</span>
                    </Tooltip>
                  </Box>
                  <AccordionIcon />
                </AccordionButton>
                <AccordionPanel pb={4}>
                  <Plot
                    data={[
                      {
                        x: analysis.charts.sales_over_time.dates,
                        y: analysis.charts.sales_over_time.sales,
                        type: "scatter",
                        mode: "lines+markers",
                        marker: { color: "cyan" },
                      },
                    ]}
                    layout={{
                      title: "Sales Over Time",
                      paper_bgcolor: "#121212",
                      plot_bgcolor: "#121212",
                      font: { color: "#f0f0f0" },
                      xaxis: { title: "Date" },
                      yaxis: { title: "Sales" },
                    }}
                    style={{ width: "100%", height: "500px" }}
                  />
                </AccordionPanel>
              </AccordionItem>
            )}

            {/* Sales by Product */}
            {analysis.charts?.sales_by_product?.products && (
              <AccordionItem>
                <AccordionButton _expanded={{ bg: "gray.700" }}>
                  <Box flex="1" textAlign="left">
                    Sales by Product{" "}
                    <Tooltip
                      label="Bar chart showing total sales for each product."
                      fontSize="sm"
                      bg="gray.700"
                      color="gray.100"
                    >
                      <span style={{ cursor: "help", marginLeft: "6px" }}>?</span>
                    </Tooltip>
                  </Box>
                  <AccordionIcon />
                </AccordionButton>
                <AccordionPanel pb={4}>
                  <Plot
                    data={[
                      {
                        x: analysis.charts.sales_by_product.products,
                        y: analysis.charts.sales_by_product.sales,
                        type: "bar",
                        marker: { color: "orange" },
                      },
                    ]}
                    layout={{
                      title: "Sales by Product",
                      paper_bgcolor: "#121212",
                      plot_bgcolor: "#121212",
                      font: { color: "#f0f0f0" },
                      xaxis: { title: "Product" },
                      yaxis: { title: "Total Sales" },
                    }}
                    style={{ width: "100%", height: "500px" }}
                  />
                </AccordionPanel>
              </AccordionItem>
            )}

            {/* Category vs Region */}
            {analysis.charts?.category_region?.categories && (
              <AccordionItem>
                <AccordionButton _expanded={{ bg: "gray.700" }}>
                  <Box flex="1" textAlign="left">
                    Sales by Category &amp; Region{" "}
                    <Tooltip
                      label="Stacked bar chart: total sales for each category across regions."
                      fontSize="sm"
                      bg="gray.700"
                      color="gray.100"
                    >
                      <span style={{ cursor: "help", marginLeft: "6px" }}>?</span>
                    </Tooltip>
                  </Box>
                  <AccordionIcon />
                </AccordionButton>
                <AccordionPanel pb={4}>
                  <Plot
                    data={analysis.charts.category_region.series.map((r) => ({
                      x: analysis.charts.category_region.categories,
                      y: r.sales,
                      type: "bar",
                      name: r.region,
                    }))}
                    layout={{
                      title: "Category vs Region",
                      barmode: "stack",
                      paper_bgcolor: "#121212",
                      plot_bgcolor: "#121212",
                      font: { color: "#f0f0f0" },
                      xaxis: { title: "Category" },
                      yaxis: { title: "Sales" },
                    }}
                    style={{ width: "100%", height: "500px" }}
                  />
                </AccordionPanel>
              </AccordionItem>
            )}

            {/* Pie Chart: Sales Share */}
            {analysis.charts?.sales_share?.labels && (
              <AccordionItem>
                <AccordionButton _expanded={{ bg: "gray.700" }}>
                  <Box flex="1" textAlign="left">
                    Share of Sales by Category{" "}
                    <Tooltip
                      label="Donut chart showing percentage share of total sales by category."
                      fontSize="sm"
                      bg="gray.700"
                      color="gray.100"
                    >
                      <span style={{ cursor: "help", marginLeft: "6px" }}>?</span>
                    </Tooltip>
                  </Box>
                  <AccordionIcon />
                </AccordionButton>
                <AccordionPanel pb={4}>
                  <Plot
                    data={[
                      {
                        labels: analysis.charts.sales_share.labels,
                        values: analysis.charts.sales_share.values,
                        type: "pie",
                        hole: 0.4,
                      },
                    ]}
                    layout={{
                      title: "Sales Share by Category",
                      paper_bgcolor: "#121212",
                      plot_bgcolor: "#121212",
                      font: { color: "#f0f0f0" },
                    }}
                    style={{ width: "100%", height: "500px" }}
                  />
                </AccordionPanel>
              </AccordionItem>
            )}

            {/* Scatter: Sales vs Inventory */}
            {analysis.charts?.sales_vs_inventory?.sales && (
              <AccordionItem>
                <AccordionButton _expanded={{ bg: "gray.700" }}>
                  <Box flex="1" textAlign="left">
                    Sales vs Inventory{" "}
                    <Tooltip
                      label="Scatter plot correlating sales amounts with inventory levels."
                      fontSize="sm"
                      bg="gray.700"
                      color="gray.100"
                    >
                      <span style={{ cursor: "help", marginLeft: "6px" }}>?</span>
                    </Tooltip>
                  </Box>
                  <AccordionIcon />
                </AccordionButton>
                <AccordionPanel pb={4}>
                  <Plot
                    data={[
                      {
                        x: analysis.charts.sales_vs_inventory.inventory,
                        y: analysis.charts.sales_vs_inventory.sales,
                        mode: "markers",
                        type: "scatter",
                        marker: { color: "lightblue" },
                      },
                    ]}
                    layout={{
                      title: "Sales vs Inventory",
                      paper_bgcolor: "#121212",
                      plot_bgcolor: "#121212",
                      font: { color: "#f0f0f0" },
                      xaxis: { title: "Inventory Quantity" },
                      yaxis: { title: "Sales" },
                    }}
                    style={{ width: "100%", height: "500px" }}
                  />
                </AccordionPanel>
              </AccordionItem>
            )}

            {/* Combo Chart */}
            {analysis.charts?.sales_inventory_combo?.dates && (
              <AccordionItem>
                <AccordionButton _expanded={{ bg: "gray.700" }}>
                  <Box flex="1" textAlign="left">
                    Sales &amp; Inventory Over Time{" "}
                    <Tooltip
                      label="Two-line chart: one for daily sales, another for inventory over the same dates."
                      fontSize="sm"
                      bg="gray.700"
                      color="gray.100"
                    >
                      <span style={{ cursor: "help", marginLeft: "6px" }}>?</span>
                    </Tooltip>
                  </Box>
                  <AccordionIcon />
                </AccordionButton>
                <AccordionPanel pb={4}>
                  <Plot
                    data={[
                      {
                        x: analysis.charts.sales_inventory_combo.dates,
                        y: analysis.charts.sales_inventory_combo.sales,
                        type: "scatter",
                        mode: "lines",
                        name: "Sales",
                        yaxis: "y1",
                        marker: { color: "cyan" },
                      },
                      {
                        x: analysis.charts.sales_inventory_combo.dates,
                        y: analysis.charts.sales_inventory_combo.inventory,
                        type: "scatter",
                        mode: "lines",
                        name: "Inventory",
                        yaxis: "y2",
                        marker: { color: "yellow" },
                      },
                    ]}
                    layout={{
                      title: "Sales & Inventory Over Time",
                      paper_bgcolor: "#121212",
                      plot_bgcolor: "#121212",
                      font: { color: "#f0f0f0" },
                      xaxis: { title: "Date" },
                      yaxis: { title: "Sales", side: "left" },
                      yaxis2: {
                        title: "Inventory",
                        overlaying: "y",
                        side: "right",
                      },
                    }}
                    style={{ width: "100%", height: "500px" }}
                  />
                </AccordionPanel>
              </AccordionItem>
            )}

            {/* Heat Map */}
            {analysis.charts?.category_region_heatmap?.categories && (
              <AccordionItem>
                <AccordionButton _expanded={{ bg: "gray.700" }}>
                  <Box flex="1" textAlign="left">
                    Heat Map: Category vs Region{" "}
                    <Tooltip
                      label="Heatmap showing category sales by region. Darker areas = higher sales."
                      fontSize="sm"
                      bg="gray.700"
                      color="gray.100"
                    >
                      <span style={{ cursor: "help", marginLeft: "6px" }}>?</span>
                    </Tooltip>
                  </Box>
                  <AccordionIcon />
                </AccordionButton>
                <AccordionPanel pb={4}>
                  <Plot
                    data={[
                      {
                        x: analysis.charts.category_region_heatmap.regions,
                        y: analysis.charts.category_region_heatmap.categories,
                        z: analysis.charts.category_region_heatmap.matrix,
                        type: "heatmap",
                        colorscale: "Viridis",
                      },
                    ]}
                    layout={{
                      title: "Category vs Region Heatmap",
                      paper_bgcolor: "#121212",
                      plot_bgcolor: "#121212",
                      font: { color: "#f0f0f0" },
                      xaxis: { title: "Region" },
                      yaxis: { title: "Category" },
                    }}
                    style={{ width: "100%", height: "500px" }}
                  />
                </AccordionPanel>
              </AccordionItem>
            )}

            {/* Waterfall */}
            {analysis.charts?.sales_waterfall?.quarters && (
              <AccordionItem>
                <AccordionButton _expanded={{ bg: "gray.700" }}>
                  <Box flex="1" textAlign="left">
                    Quarterly Sales Changes{" "}
                    <Tooltip
                      label="Waterfall chart displaying quarter-to-quarter changes in total sales."
                      fontSize="sm"
                      bg="gray.700"
                      color="gray.100"
                    >
                      <span style={{ cursor: "help", marginLeft: "6px" }}>?</span>
                    </Tooltip>
                  </Box>
                  <AccordionIcon />
                </AccordionButton>
                <AccordionPanel pb={4}>
                  <Plot
                    data={[
                      {
                        type: "waterfall",
                        x: analysis.charts.sales_waterfall.quarters,
                        y: analysis.charts.sales_waterfall.values,
                        measure: Array(
                          analysis.charts.sales_waterfall.values.length
                        ).fill("relative"),
                        connector: { line: { color: "gray" } },
                      },
                    ]}
                    layout={{
                      title: "Quarterly Sales Changes",
                      paper_bgcolor: "#121212",
                      plot_bgcolor: "#121212",
                      font: { color: "#f0f0f0" },
                      xaxis: { title: "Quarter" },
                      yaxis: { title: "Sales" },
                    }}
                    style={{ width: "100%", height: "500px" }}
                  />
                </AccordionPanel>
              </AccordionItem>
            )}

            {/* Treemap */}
            {analysis.charts?.sales_treemap?.labels && (
              <AccordionItem>
                <AccordionButton _expanded={{ bg: "gray.700" }}>
                  <Box flex="1" textAlign="left">
                    Sales Treemap{" "}
                    <Tooltip
                      label="Treemap of categories (parents) and products (children) sized by total sales."
                      fontSize="sm"
                      bg="gray.700"
                      color="gray.100"
                    >
                      <span style={{ cursor: "help", marginLeft: "6px" }}>?</span>
                    </Tooltip>
                  </Box>
                  <AccordionIcon />
                </AccordionButton>
                <AccordionPanel pb={4}>
                  <Plot
                    data={[
                      {
                        type: "treemap",
                        labels: analysis.charts.sales_treemap.labels,
                        parents: analysis.charts.sales_treemap.parents,
                        values: analysis.charts.sales_treemap.values,
                        textinfo: "label+value+percent parent",
                      },
                    ]}
                    layout={{
                      title: "Sales Treemap",
                      paper_bgcolor: "#121212",
                      font: { color: "#f0f0f0" },
                    }}
                    style={{ width: "100%", height: "500px" }}
                  />
                </AccordionPanel>
              </AccordionItem>
            )}
          </Accordion>

          {/* Forecast Chart if toggled */}
          {showForecast &&
            analysis.forecast &&
            !analysis.forecast.error &&
            analysis.forecast.dates && (
              <Box my="8" maxW="1000px" mx="auto">
                <Heading as="h2" size="md" mb="4" color="teal.200">
                  6-Month Sales Forecast{" "}
                  <Tooltip
                    label="Based on historical sales, Prophet predicts upcoming sales for 6 months."
                    fontSize="sm"
                    bg="gray.700"
                    color="gray.100"
                  >
                    <span style={{ cursor: "help", marginLeft: "6px" }}>?</span>
                  </Tooltip>
                </Heading>
                <Plot
                  data={[
                    {
                      x: analysis.forecast.dates,
                      y: analysis.forecast.predictions,
                      type: "scatter",
                      mode: "lines+markers",
                      marker: { color: "orange" },
                    },
                  ]}
                  layout={{
                    title: "Forecasted Sales",
                    paper_bgcolor: "#121212",
                    plot_bgcolor: "#121212",
                    font: { color: "#f0f0f0" },
                    xaxis: { title: "Date" },
                    yaxis: { title: "Predicted Sales" },
                  }}
                  style={{ width: "100%", height: "500px" }}
                />
              </Box>
            )}
          {showForecast && analysis.forecast && analysis.forecast.error && (
            <Box color="red.400" mt={4}>
              <Text>Forecast Error: {analysis.forecast.error}</Text>
            </Box>
          )}

          {/* Customer Segmentation with improved UI/UX */}
          {analysis.customer_segmentation?.rfm_scatter && (
            <Box
              bg="#2c2c2c" p={6} borderRadius="md" maxW="1000px"
              mx="auto" mt={8} boxShadow="lg"
            >
              <Heading size="md" mb={4} color="teal.200">
                RFM Customer Clusters
              </Heading>

              {/* scatter */}
              <Plot
                data={[
                  {
                    x: analysis.customer_segmentation.rfm_scatter.recency,
                    y: analysis.customer_segmentation.rfm_scatter.monetary,
                    text: analysis.customer_segmentation.rfm_scatter.frequency.map(f=>`Freq ${f}`),
                    mode:"markers",
                    type:"scatter",
                    marker:{
                      color: analysis.customer_segmentation.rfm_scatter.cluster,
                      colorscale:"Viridis",
                      size: analysis.customer_segmentation.rfm_scatter.frequency.map(f=>Math.min(20,4+f)),
                      showscale:false
                    },
                    hovertemplate:"Recency %{x} days<br>$%{y}<br>%{text}<extra></extra>"
                  }
                ]}
                layout={{
                  title:"Recency vs Monetary (bubble = Frequency)",
                  paper_bgcolor:"#2c2c2c", plot_bgcolor:"#2c2c2c",
                  font:{color:"#f0f0f0"}, xaxis:{title:"Recency (days)"}, yaxis:{title:"Monetary ($)"}
                }}
                style={{width:"100%",height:CHART_H}}
              />

              {/* cluster insight sentences */}
              {/* -------- prettier cluster-insight cards -------- */}
<SimpleGrid columns={{ base: 1, md: 2 }} spacing={4} mt={6}>
  {analysis.customer_segmentation.cluster_insights.map((txt, idx) => {
    // txt = "Cluster 0: avg recency ≈ 15 days, frequency ≈ 6.2 orders, monetary ≈ $3200"
    const firstColon = txt.indexOf(":");
    const heading    = txt.slice(0, firstColon);        // "Cluster 0"
    const details    = txt.slice(firstColon + 1);       // rest of the sentence
    const color      = pickColor(idx);

    return (
      <Box
        key={idx}
        bg="#1e1e1e"
        p={4}
        borderLeft="6px solid"
        borderColor={`${color}.400`}
        borderRadius="md"
        boxShadow="md"
        _hover={{ transform: "translateY(-4px)", transition: "all .2s" }}
      >
        <Flex align="center" mb={2}>
          <Badge colorScheme={color} mr={2}>
            {`Cluster ${idx}`}
          </Badge>
          <Heading size="sm" color="gray.100">
            {heading}
          </Heading>
        </Flex>
        <Text fontSize="sm" color="gray.300" pl={1}>
          {details.trim()}
        </Text>
      </Box>
    );
  })}
</SimpleGrid>
              {/* cluster size bar */}
              <Plot
                data={[{
                  x: Object.keys(analysis.customer_segmentation.cluster_sizes),
                  y: Object.values(analysis.customer_segmentation.cluster_sizes),
                  type:"bar", marker:{color:"teal"}
                }]}
                layout={{
                  title:"Customers per Cluster",
                  paper_bgcolor:"#2c2c2c", plot_bgcolor:"#2c2c2c",
                  font:{color:"#f0f0f0"}, xaxis:{title:"Cluster"}, yaxis:{title:"Count"}
                }}
                style={{width:"100%",height:300}}
              />

              {/* top-10 table */}
              <Heading size="sm" mt={5} mb={2} color="teal.200">
                Top 10 Customers (by Frequency)
              </Heading>
              <Table size="sm" colorScheme="gray">
                <Thead>
                  <Tr>
                    <Th>ID</Th><Th isNumeric>Recency</Th>
                    <Th isNumeric>Frequency</Th><Th isNumeric>Monetary</Th><Th>Cluster</Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {analysis.customer_segmentation.fm_table.map(r=>(
                    <Tr key={r.CustomerID}>
                      <Td>{r.CustomerID}</Td>
                      <Td isNumeric>{r.Recency}</Td>
                      <Td isNumeric>{r.Frequency}</Td>
                      <Td isNumeric>${r.Monetary.toFixed(2)}</Td>
                      <Td><ClusterBadge cluster={r.Cluster}/></Td>
                    </Tr>
                  ))}
                </Tbody>
              </Table>
            </Box>
          )}
        </Box>
      )}

      {/* ---------------- Tutorial Modal ---------------- */}
      <Modal isOpen={isTutorialOpen} onClose={closeTutorial} isCentered>
        <ModalOverlay />
        <ModalContent bg="#2c2c2c" color="gray.200">
          <ModalHeader>Welcome to the Analyze Page</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Text mb={3} color="gray.300">
              This short guide will show you how to get started:
            </Text>
            <UnorderedList spacing={2} color="gray.300">
              <ListItem>
                <strong>Upload CSV:</strong> Click <em>“Choose File”</em> and select a valid CSV
                with a <code>Date</code> column and other data like <code>Sales</code>.
              </ListItem>
              <ListItem>
                <strong>Date Filters:</strong> Optionally pick a start and end date to narrow down
                your analysis.
              </ListItem>
              <ListItem>
                <strong>Charts & Insights:</strong> Scroll down to see auto-generated charts and
                actionable insights—best sellers, inventory alerts, etc.
              </ListItem>
              <ListItem>
                <strong>Forecast:</strong> Toggle <em>“Show Sales Forecast”</em> to see a
                6-month prediction (requires enough date/sales data).
              </ListItem>
              <ListItem>
                <strong>Share or Export:</strong> (Optional) You can screenshot charts, or
                integrate advanced sharing features later.
              </ListItem>
            </UnorderedList>
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="teal" onClick={closeTutorial}>
              Got It!
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
      {/* ---------------- End of Tutorial Modal ---------------- */}
    </Box>
  );
};

export default Analyze;