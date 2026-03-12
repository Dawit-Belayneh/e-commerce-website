import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "./Navbar";
import Footer from "./Footer";
import "./Checkout.css";

function Checkout() {
  const navigate = useNavigate();
  const [cartItems, setCartItems] = useState([]);
  const [paymentMethod, setPaymentMethod] = useState("telebirr");

  useEffect(() => {
    const savedCart = JSON.parse(localStorage.getItem("cart")) || [];
    if (savedCart.length === 0) {
      navigate("/products"); // Redirect if cart is empty
    }
    setCartItems(savedCart);
  }, [navigate]);

  const subtotal = cartItems.reduce((acc, item) => acc + (item.price * item.quantity), 0);
  const shipping = 200; // Flat rate example
  const total = subtotal + shipping;

  const handlePlaceOrder = (e) => {
    e.preventDefault();
    // Logic to send order to Django Backend
    alert("Order Placed Successfully via " + paymentMethod);
    localStorage.removeItem("cart"); // Clear cart after success
    window.dispatchEvent(new Event("cartUpdated"));
    navigate("/");
  };

  return (
    <div className="page-layout">
      <Navbar />
      <div className="checkout-container">
        <form className="checkout-form" onSubmit={handlePlaceOrder}>
          
          {/* LEFT COLUMN: SHIPPING & PAYMENT */}
          <div className="checkout-left">
            <section className="checkout-section">
              <h2><span className="step-num">1</span> Shipping Address</h2>
              <div className="input-group">
                <input type="text" placeholder="Full Name" required />
                <input type="email" placeholder="Email Address" required />
              </div>
              <input type="text" placeholder="Street Address" required />
              <div className="input-group">
                <input type="text" placeholder="City (e.g. Addis Ababa)" required />
                <input type="text" placeholder="Phone Number (+251...)" required />
              </div>
            </section>

            <section className="checkout-section">
              <h2><span className="step-num">2</span> Payment Method</h2>
              <div className="payment-options">
                <label className={`pay-card ${paymentMethod === 'telebirr' ? 'active' : ''}`}>
                  <input type="radio" name="payment" value="telebirr" checked={paymentMethod === 'telebirr'} onChange={(e) => setPaymentMethod(e.target.value)} />
                  <div className="pay-info">
                    <strong>Telebirr / CBE Birr</strong>
                    <span>Pay using mobile wallet</span>
                  </div>
                </label>
                
                <label className={`pay-card ${paymentMethod === 'card' ? 'active' : ''}`}>
                  <input type="radio" name="payment" value="card" onChange={(e) => setPaymentMethod(e.target.value)} />
                  <div className="pay-info">
                    <strong>Credit / Debit Card</strong>
                    <span>Visa, Mastercard, Chapa</span>
                  </div>
                </label>
              </div>
            </section>
          </div>

          {/* RIGHT COLUMN: ORDER SUMMARY */}
          <aside className="checkout-right">
            <div className="order-summary-box">
              <h3>Order Summary</h3>
              <div className="summary-items">
                {cartItems.map(item => (
                  <div key={item.id} className="summary-item">
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