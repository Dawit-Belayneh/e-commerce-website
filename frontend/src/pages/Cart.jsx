import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import Navbar from "./Navbar";
import Footer from "./Footer";
import "./Cart.css";

function Cart() {
  const navigate = useNavigate();
  const [cartItems, setCartItems] = useState([]);
  
  // Mock data - In a real app, you'd fetch this from localStorage or an API
  useEffect(() => {
    const loadCart = () => {
      const savedCart = JSON.parse(localStorage.getItem("cart")) || [];
      setCartItems(savedCart);
    };

    loadCart();
    
    // Also listen for changes here in case user opens multiple tabs
    window.addEventListener("cartUpdated", loadCart);
    return () => window.removeEventListener("cartUpdated", loadCart);
  }, []);

  const updateQuantity = (id, delta) => {
    const updated = cartItems.map(item => {
      if (item.id === id) {
        const newQty = Math.max(1, item.quantity + delta);
        return { ...item, quantity: newQty };
      }
      return item;
    });
    setCartItems(updated);
    localStorage.setItem("cart", JSON.stringify(updated));
  };

  const handleCheckoutNavigation = () => {
    const token = localStorage.getItem("access_token");
    if (!token) {
      alert("Please log in to proceed to checkout.");
      navigate("/login", { state: { from: "/checkout"}});
    } else {
      navigate("/checkout");
    }
  };



  const removeItem = (id) => {
    const updated = cartItems.filter(item => item.id !== id);
    setCartItems(updated);
    localStorage.setItem("cart", JSON.stringify(updated));
  };

  const subtotal = cartItems.reduce((acc, item) => acc + (item.price * item.quantity), 0);
  const shipping = subtotal > 0 ? 200 : 0; 
  const total = subtotal + shipping;

  return (
    <div className="page-layout">
      <Navbar />
      
      <div className="cart-container">
        <h1>Your Shopping Cart</h1>

        {cartItems.length === 0 ? (
          <div className="empty-cart">
            <div className="empty-cart-icon">🛒</div>
            <p>Your cart is currently empty.</p>
            <Link to="/products" className="return-shop-btn">Return to Shop</Link>
          </div>
        ) : (
          <div className="cart-content">
            {/* LEFT: ITEM LIST */}
            <div className="cart-items-list">
              <div className="cart-header-labels">
                <span>Product</span>
                <span>Price</span>
                <span>Quantity</span>
                <span>Subtotal</span>
              </div>

              {cartItems.map((item) => (
                <div key={item.id} className="cart-item-row">
                  <div className="cart-item-info">
                    <img src={item.main_image} alt={item.name} />
                    <div>
                      <h3>{item.name}</h3>
                      <button onClick={() => removeItem(item.id)} className="remove-btn">Remove</button>
                    </div>
                  </div>
                  
                  <div className="cart-item-price">{item.price} ETB</div>
                  
                  <div className="cart-item-qty">
                    <div className="qty-controls">
                      <button onClick={() => updateQuantity(item.id, -1)}>-</button>
                      <span>{item.quantity}</span>
                      <button onClick={() => updateQuantity(item.id, 1)}>+</button>
                    </div>
                  </div>
                  
                  <div className="cart-item-subtotal">
                    {(item.price * item.quantity).toFixed(2)} ETB
                  </div>
                </div>
              ))}
            </div>

            {/* RIGHT: ORDER SUMMARY */}
            <div className="cart-summary">
              <h2>Order Summary</h2>
              <div className="summary-row">
                <span>Subtotal</span>
                <span>{subtotal.toFixed(2)} ETB</span>
              </div>
              <div className="summary-row">
                <span>Shipping</span>
                <span>{shipping.toFixed(2)} ETB</span>
              </div>
              <hr />
              <div className="summary-row total">
                <span>Total</span>
                <span>{total.toFixed(2)} ETB</span>
              </div>
              
              <button className="checkout-btn" onClick={handleCheckoutNavigation}>
                Proceed to Checkout
              </button>
              
              <div className="payment-methods">
                <p>We Accept:</p>
                <span>Telebirr • CBE Birr • Chapa</span>
              </div>
            </div>
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
}

export default Cart;