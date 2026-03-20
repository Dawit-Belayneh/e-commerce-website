import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';
import './OrderSuccess.css';

function OrderSuccess() {
  const location = useLocation();
  
  // Retrieve the Order ID sent from the Checkout navigate state
  const orderId = location.state?.orderId;

  return (
    <div className="order-success-wrapper">
      <Navbar />
      
      <main className="success-main">
        <div className="success-card">
          <div className="success-icon">
            <svg 
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="2" 
              strokeLinecap="round" 
              strokeLinejoin="round"
            >
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
              <polyline points="22 4 12 14.01 9 11.01"></polyline>
            </svg>
          </div>
          
          <h1 className="success-title">Payment Successful!</h1>
          <p className="success-message">
            Thank you for your purchase. We've received your order and are getting it ready for shipment.
          </p>
          
          <div className="order-details-box">
            <span className="order-label">Order Number</span>
            <h2 className="order-number">#{orderId || "Pending"}</h2>
          </div>

          <p className="status-note">
            Once your order status changes to <strong>DELIVERED</strong> in your dashboard, 
            you will be able to leave a product review.
          </p>

          <div className="success-actions">
            <Link to="/" className="btn-primary">
              Continue Shopping
            </Link>
            <Link to="/profile" className="btn-secondary">
              View My Orders
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

export default OrderSuccess;