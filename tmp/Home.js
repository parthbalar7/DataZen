import React from "react";
import { Link } from "react-router-dom";

const Home = () => {
  return (
    <div className="container">
      <h1>Welcome to DataZen</h1>
      <p>
        DataZen is your ultimate tool for analyzing sales data and unlocking actionable insights.
      </p>
      <Link to="/analyze">
        <button>Get Started</button>
      </Link>
    </div>
  );
};

export default Home;

