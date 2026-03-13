import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import API from "../api/axios";
import Navbar from "./Navbar";
import Footer from "./Footer";
import "./Checkout.css";

function Checkout() {
  const navigate = useNavigate();
  const location = useLocation(); // To catch "Buy Now" data

  const [cartItems, setCartItems] = useState([]);
  const [paymentMethod, setPaymentMethod] = useState("BANK_TRANSFER"); // Matches your Model Choice
  const [formData, setFormData] = useState({
    customer_name: "",
    customer_email: "",
    shipping_address: "",
    phone: ""
  });

  useEffect(() => {
    // Check if we came from "Buy Now" (single item in state)
    if (location.state && location.state.buyNowItem) {
      setCartItems([location.state.buyNowItem]);
    } else {
      // Otherwise, load full cart from localStorage
      const savedCart = JSON.parse(localStorage.getItem("cart")) || [];
      if (savedCart.length === 0) {
        navigate("/products");
      }
      setCartItems(savedCart);
    }
  }, [location.state, navigate]);

  const subtotal = cartItems.reduce((acc, item) => acc + (item.price * item.quantity), 0);
  const shipping = 200;
  const total = subtotal + shipping;

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handlePlaceOrder = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem("access_token");

    console.log("Token being sent:", token);

    if (!token) {
        alert("Session expired. Please log in again.");
        navigate("/login");
        return;
    }

    const orderData = {
      customer_name: formData.customer_name,
      customer_email: formData.customer_email,
      shipping_address: `${formData.shipping_address}, Phone: ${formData.phone}`,
      total_amount: total,
      items: cartItems.map(item => ({
        product_name: item.name,
        quantity: item.quantity,
        price_per_item: item.price
      })),
      payment_method: paymentMethod === 'telebirr' ? 'BANK_TRANSFER' : 'CREDIT_CARD'
    };

    try {
      const res = await API.post("orders/", orderData, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      
      // Clear cart only if we didn't use "Buy Now" 
      // (Or clear anyway if you want a clean slate)
      if (!location.state?.buyNowItem) {
        localStorage.removeItem("cart");
        window.dispatchEvent(new Event("cartUpdated"));
      }

      alert("Order Placed Successfully!");
      navigate("/order-success", { 
        state: { 
          orderId: res.data.id,
          paymentMethod: paymentMethod,
          totalAmount: total
        }
      });
    } catch (err) {
      console.error(err);
      alert("Error placing order. Please try again.");
    }
  };

  return (
    <div className="page-layout">
      <Navbar />
      <div className="checkout-container">
        <form className="checkout-form" onSubmit={handlePlaceOrder}>
          
          <div className="checkout-left">
            <section className="checkout-section">
              <h2><span className="step-num">1</span> Shipping Address</h2>
              <div className="input-group">
                <input type="text" name="customer_name" placeholder="Full Name" required onChange={handleChange} />
                <input type="email" name="customer_email" placeholder="Email Address" required onChange={handleChange} />
              </div>
              <input type="text" name="shipping_address" placeholder="Street Address / Area" required onChange={handleChange} />
              <div className="input-group">
                <input type="text" name="city" placeholder="City" required onChange={handleChange} />
                <input type="text" name="phone" placeholder="Phone Number" required onChange={handleChange} />
              </div>
            </section>

            <section className="checkout-section">
              <h2><span className="step-num">2</span> Payment Method</h2>
              <div className="payment-options">
                <label className={`pay-card ${paymentMethod === 'telebirr' ? 'active' : ''}`}>
                  <input type="radio" name="payment" value="telebirr" checked={paymentMethod === 'telebirr'} onChange={() => setPaymentMethod('telebirr')} />
                  <div className="pay-info">
                    <strong>Telebirr / CBE Birr</strong>
                    <span>Manual Bank Transfer</span>
                  </div>
                </label>
                
                <label className={`pay-card ${paymentMethod === 'card' ? 'active' : ''}`}>
                  <input type="radio" name="payment" value="card" checked={paymentMethod === 'card'} onChange={() => setPaymentMethod('card')} />
                  <div className="pay-info">
                    <strong>Credit / Debit Card</strong>
                    <span>Visa, Mastercard, Chapa</span>
                  </div>
                </label>
              </div>
            </section>
          </div>

          <aside className="checkout-right">
            <div className="order-summary-box">
              <h3>Order Summary</h3>
              <div className="summary-items">
                {cartItems.map((item, index) => (
                  <div key={index} className="summary-item">
                    <img src={item.main_image} alt={item.name} />
                    <div className="item-details">
                      <span>{item.name} (x{item.quantity})</span>
                      <strong>{item.price * item.quantity} ETB</strong>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="price-calc">
                <div className="calc-row"><span>Subtotal</span><span>{subtotal.toFixed(2)} ETB</span></div>
                <div className="calc-row"><span>Shipping</span><span>{shipping.toFixed(2)} ETB</span></div>
                <hr />
                <div className="calc-row total"><span>Total</span><span>{total.toFixed(2)} ETB</span></div>
              </div>

              <button type="submit" className="place-order-btn">
                Confirm & Pay {total.toFixed(2)} ETB
              </button>
            </div>
          </aside>

        </form>
      </div>
      <Footer />
    </div>
  );
}

export default Checkout;