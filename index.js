// src/index.js
import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { ChakraProvider, extendTheme } from "@chakra-ui/react";
import App from "./App";
import 'react-grid-layout/css/styles.css';
import 'react-resizable/css/styles.css';

// 1) Create a custom theme (dark background, light text)
const theme = extendTheme({
  styles: {
    global: {
      body: {
        bg: "#121212",
        color: "#f0f0f0",
        margin: 0,
        padding: 0,
        fontFamily: "Arial, sans-serif",
      },
    },
  },
});

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <BrowserRouter>
    <ChakraProvider theme={theme}>
      <App />
    </ChakraProvider>
  </BrowserRouter>
);