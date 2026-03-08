import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import API from "../api/axios";
import Navbar from "./Navbar";
import Footer from "./Footer";
import "./Products.css";

function Products() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  //Logic to grab the category from the URL
  const [searchParams] = useSearchParams();
  const categoryFilter = searchParams.get('category');

  useEffect(() => {
    setLoading(true);
    const fetchUrl = categoryFilter
      ? `products/?category__name=${categoryFilter}`
      : "products/";

    API.get(fetchUrl)
      .then((res) => {
        setProducts(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error:", err);
        setLoading(false);
      });
  }, [categoryFilter]);

  if (loading) {
    return (
      <div className="loader-container">
        <div className="spinner"></div>
        <p>Fetching amazing products...</p>
      </div>
    );
  }

  return (
    <div className="page-layout">
      <Navbar />

      <div className="products-container">
        <header className="products-header">
          <h1>{categoryFilter ? `${categoryFilter} Collection` : "Our Collection"}</h1>
          <p>Premium quality items delivered to your doorstep.</p>

          {categoryFilter && (
            <button className="clear-filter-btn" onClick={() => navigate("/products")}>
              View All Products
            </button>
          )}
        </header>

        {products.length === 0 ? (
          <div className="empty-state">
            <p>No products found. Check back later!</p>
          </div>
        ) : (
          <div className="products-grid">
            {products.map((product) => {
              /** * PRICE LOGIC: 
               * If discount_price exists and is greater than 0, use it.
               * Otherwise, use the standard price.
               **/
              const hasDiscount = product.discount_price && Number(product.discount_price) > 0;
              const displayPrice = hasDiscount ? product.discount_price : product.price;

              return (
                <div
                  key={product.id}
                  className="product-card"
                  onClick={() => navigate(`/product/${product.slug}`)}
                >
                  <div className="product-image-wrapper">
                    {hasDiscount && <span className="discount-tag">Sale</span>}
                    <img 
                      src={product.main_image || "https://via.placeholder.com/300"} 
                      alt={product.name} 
                    />
                  </div>

                  <div className="product-info">
                    {/* 5-Star Rating Section */}
                    <div className="rating-stars">
                      {[...Array(5)].map((_, i) => (
                        <span key={i} className={i < 4 ? "star filled" : "star"}>★</span>
                      ))}
                      <span className="rating-text">(4.0)</span>
                    </div>

                    <h3 className="product-title">{product.name}</h3>

                    <div className="price-container">
                      <span className="current-price">{displayPrice} ETB</span>
                      {hasDiscount && (
                        <span className="old-price">{product.price} ETB</span>
                      )}
                    </div>
                    <button 
                      className="add-to-cart-btn"
                      onClick={(e) => {
                        e.stopPropagation(); // Prevents navigating to detail page when clicking button
                        alert("Added to cart!");
                        }}
                      >
                        Add to Cart
                        </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
}

export default Products;