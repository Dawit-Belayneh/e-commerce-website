import { useState, useEffect } from "react";
import API from "../api/axios";
import "./Products.css"; // We will create this file next

function Products() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    API.get("products/")
      .then((res) => {
        setProducts(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error:", err);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="loader-container">
        <div className="spinner"></div>
        <p>Fetching amazing products...</p>
      </div>
    );
  }

  return (
    <div className="products-container">
      <header className="products-header">
        <h1>Our Collection</h1>
        <p>Discover our latest arrivals and best sellers.</p>
      </header>

      {products.length === 0 ? (
        <div className="empty-state">
          <p>No products found. Check back later!</p>
        </div>
      ) : (
        <div className="products-grid">
          {products.map((product) => (
            <div key={product.id} className="product-card">
              <div className="product-image">
                {/* Fallback to a placeholder if your API doesn't have images yet */}
                <img 
                  src={product.main_image || "https://via.placeholder.com/300"} 
                  alt={product.name} 
                />
              </div>
              <div className="product-info">
                <span className="category-tag">New Arrival</span>
                <h3>{product.name}</h3>
                <p className="description">{product.description}</p>
                <div className="card-footer">
                  <span className="price">{product.price} <small>ETB</small></span>
                  <button className="add-btn">Add to Cart</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Products;