import React from "react";
import { Link } from "react-router-dom";

const Navbar = () => {
  return (
    <nav style={{ padding: "1rem", background: "#1e1e1e", textAlign: "center" }}>
      <Link to="/">Home</Link>
      <Link to="/analyze">Analyze</Link>
      <Link to="/pricing">Pricing</Link>
      <Link to="/about">About</Link>
    </nav>
  );
};

export default Navbar;

