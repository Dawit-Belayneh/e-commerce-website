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
  const searchQuery = searchParams.get('search');

  useEffect(() => {
    setLoading(true);

    let fetchUrl = "products/";

    if (searchQuery) {
      fetchUrl += `?search=${searchQuery}`;
    }else if (categoryFilter){
      fetchUrl += `?category__name=${categoryFilter}`;
    }

    API.get(fetchUrl)
      .then((res) => {
        setProducts(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error:", err);
        setLoading(false);
      });
  }, [categoryFilter, searchQuery]);

  if (loading) {
    return (
      <div className="loader-container">
        <div className="spinner"></div>
        <p>Fetching amazing products...</p>
      </div>
    );
  }


  const addToCart = (e, product, quantity) => {
    e.stopPropagation();
  // 1. Get existing cart
  let cart = JSON.parse(localStorage.getItem("cart")) || [];

  // 2. Check if product is already there
  const existingItemIndex = cart.findIndex((item) => item.id === product.id);

  if (existingItemIndex > -1) {
    // Increase quantity if it exists
    cart[existingItemIndex].quantity += quantity;
  } else {
    // Add new item if it doesn't
    cart.push({
      id: product.id,
      name: product.name,
      price: product.discount_price || product.price,
      main_image: product.main_image,
      quantity: quantity,
    });
  }

  // 3. Save to localStorage
  localStorage.setItem("cart", JSON.stringify(cart));

  // 4. IMPORTANT: Send the signal to Navbar
  window.dispatchEvent(new Event("cartUpdated"));

  alert("Item added to cart!");
};

  return (
    <div className="page-layout">
      <Navbar />

      <div className="products-container">
        <header className="products-header">
          <h1>
            {searchQuery 
              ? `Results for "${searchQuery}"` 
              : categoryFilter 
                ? `${categoryFilter} Collection` 
                : "Our Collection"}
          </h1>
          <p>{products.length} {products.length === 1 ? 'item' : 'items'} found</p>

          {(categoryFilter || searchQuery) && (
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
                      onClick={(e) => addToCart(e, product, 1)}
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