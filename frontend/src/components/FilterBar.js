// src/components/FilterBar.js
import React, { useState } from "react";
import { Box, Button, Input } from "@chakra-ui/react";

const FilterBar = ({ onFilter }) => {
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const handleApplyFilter = () => {
    onFilter({ startDate, endDate });
  };

  return (
    <Box display="flex" justifyContent="center" gap="2" mt="4">
      <Input
        type="date"
        value={startDate}
        onChange={(e) => setStartDate(e.target.value)}
        placeholder="Start Date"
        maxW="200px"
      />
      <Input
        type="date"
        value={endDate}
        onChange={(e) => setEndDate(e.target.value)}
        placeholder="End Date"
        maxW="200px"
      />
      <Button
        onClick={handleApplyFilter}
        bg="#3e3e3e"
        _hover={{ bg: "#5e5e5e" }}
      >
        Apply Filter
      </Button>
    </Box>
  );
};

export default FilterBar;
