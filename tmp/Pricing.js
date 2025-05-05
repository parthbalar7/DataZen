import React from "react";

const Pricing = () => {
  return (
    <div className="container">
      <h1>Pricing Plans</h1>
      <p>Choose the plan that best suits your business needs.</p>
      <div className="grid">
        <div className="pricing-card">
          <h2>Basic</h2>
          <p>$10/month</p>
          <ul>
            <li>Basic Data Analysis</li>
            <li>Limited Visualizations</li>
            <li>Rule-based Insights</li>
          </ul>
          <button>Choose Basic</button>
        </div>
        <div className="pricing-card">
          <h2>Pro</h2>
          <p>$30/month</p>
          <ul>
            <li>Advanced Visualizations</li>
            <li>Comprehensive Insights</li>
            <li>Priority Support</li>
          </ul>
          <button>Choose Pro</button>
        </div>
        <div className="pricing-card">
          <h2>Enterprise</h2>
          <p>$100/month</p>
          <ul>
            <li>Custom Solutions</li>
            <li>Full API Access</li>
            <li>24/7 Support</li>
          </ul>
          <button>Contact Us</button>
        </div>
      </div>
    </div>
  );
};

export default Pricing;

