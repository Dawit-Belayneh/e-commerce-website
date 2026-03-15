import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api/axios";
import Navbar from "./Navbar";
import Footer from "./Footer";
import "./Profile.css";

function Profile() {
  const [userOrders, setUserOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const username = localStorage.getItem("username");

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const res = await API.get("orders/");
      setUserOrders(res.data);
    } catch (err) {
      console.error("Error fetching orders:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  return (
    <div className="profile-page">
      <Navbar />
      <div className="profile-dashboard">
        <aside className="profile-sidebar">
          <div className="user-profile-card">
            <div className="avatar-large">{username ? username[0].toUpperCase() : "U"}</div>
            <h3>{username}</h3>
            <button className="logout-btn" onClick={handleLogout}>Logout</button>
          </div>
        </aside>

        <main className="profile-content">
          <div className="table-container">
            <h2>Manage Your Orders</h2>
            {loading ? <p>Loading...</p> : (
              <table className="orders-table">
                <thead>
                  <tr>
                    <th>Order ID</th>
                    <th>Product</th>
                    <th>Date</th>
                    <th>Status</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {userOrders.map((order) => 
                    (order.items || []).map((item, idx) => (
                      <tr key={`${order.id}-${idx}`}>
                        <td>#{order.id}</td>
                        <td className="prod-name-cell">{item.product_name}</td>
                        <td>{new Date(order.created_at).toLocaleDateString()}</td>
                        <td>
                          <span className={`status-tag ${order.status?.toLowerCase()}`}>
                            {order.status || "Pending"}
                          </span>
                        </td>
                        <td>
                          {/* ONLY SHOW BUTTON IF STATUS IS DELIVERED */}
                          {order.status === "DELIVERED" ? (
                            <button 
                              className="review-link-btn"
                              onClick={() => navigate(`/product/${item.product_name.toLowerCase().replace(/ /g, "-")}`, { state: { openReview: true } })}
                            >
                              Add Review
                            </button>
                          ) : (
                            <span className="wait-msg">Await Delivery</span>
                          )}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            )}
          </div>
        </main>
      </div>
      <Footer />
    </div>
  );
}

export default Profile;