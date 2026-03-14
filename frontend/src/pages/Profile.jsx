import { useState, useEffect } from "react";
import API from "../api/axios";
import Navbar from "./Navbar";
import Footer from "./Footer";
import "./Profile.css";

function Profile() {
  const [userOrders, setUserOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const username = localStorage.getItem("username");

  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        // Fetch orders for the logged-in user
        const res = await API.get("orders/");
        setUserOrders(res.data);
      } catch (err) {
        console.error("Error fetching profile data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProfileData();
  }, []);

  return (
    <div className="page-layout">
      <Navbar />
      <div className="profile-container">
        <header className="profile-header">
          <div className="avatar-circle">
            {username ? username[0].toUpperCase() : "U"}
          </div>
          <h1>Welcome, {username || "User"}!</h1>
          <p>Manage your orders and account details here.</p>
        </header>

        <section className="order-history">
          <h2>Your Order History</h2>
          {loading ? (
            <p>Loading your orders...</p>
          ) : userOrders.length > 0 ? (
            <div className="orders-list">
              {userOrders.map((order) => (
                <div key={order.id} className="order-card">
                  <div className="order-info">
                    <strong>Order #{order.id}</strong>
                    <span>Date: {new Date(order.created_at).toLocaleDateString()}</span>
                    <span className={`status-badge ${order.status?.toLowerCase()}`}>
                      {order.status || "Pending"}
                    </span>
                  </div>
                  <div className="order-total">
                    <strong>Total: {order.total_amount} ETB</strong>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="empty-orders">
              <p>You haven't placed any orders yet.</p>
              <button onClick={() => window.location.href='/products'}>Start Shopping</button>
            </div>
          )}
        </section>
      </div>
      <Footer />
    </div>
  );
}

export default Profile;