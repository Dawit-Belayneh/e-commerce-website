import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API from "../api/axios";
import Navbar from "./Navbar";
import Footer from "./Footer";
import "./ProductDetail.css";

function ProductDetail() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    window.scrollTo(0, 0); // Reset scroll on page load
    setLoading(true);
    
    API.get(`products/${slug}/`)
      .then((res) => {
        setProduct(res.data);
        // Fetch related products from the same category
        return API.get(`products/?category__name=${res.data.category_name}&limit=4`);
      })
      .then((res) => {
        const data = res.data.results || res.data;
        setRelatedProducts(data.filter(p => p.slug !== slug));
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, [slug]);

  if (loading) return <div className="loader">Loading Product...</div>;
  if (!product) return <div className="error">Product not found.</div>;

  const hasDiscount = product.discount_price && Number(product.discount_price) > 0;
  const currentPrice = hasDiscount ? product.discount_price : product.price;

  return (
    <div className="page-layout">
      <Navbar />
      
      <main className="detail-container">
        <section className="product-main-view">
          {/* LEFT: IMAGE GALLERY */}
          <div className="detail-image-section">
            <div className="main-image-box">
              {hasDiscount && <span className="detail-sale-tag">Sale</span>}
              <img src={product.main_image} alt={product.name} />
            </div>
          </div>

          {/* RIGHT: PRODUCT INFO */}
          <div className="detail-info-section">
            <nav className="breadcrumb">Home / {product.category_name} / {product.name}</nav>
            
            <h1 className="detail-title">{product.name}</h1>
            
            <div className="detail-rating">
              <span className="stars">★★★★☆</span>
              <span className="review-count">(12 Customer Reviews)</span>
            </div>

            <div className="detail-price-row">
              <span className="detail-current-price">{currentPrice} ETB</span>
              {hasDiscount && <span className="detail-old-price">{product.price} ETB</span>}
            </div>

            <p className="detail-description">{product.description}</p>

            <div className="purchase-options">
              <div className="quantity-selector">
                <button onClick={() => setQuantity(q => Math.max(1, q - 1))}>-</button>
                <span>{quantity}</span>
                <button onClick={() => setQuantity(q => q + 1)}>+</button>
              </div>
              
              <div className="action-buttons">
                <button className="add-cart-btn" onClick={() => alert("Added to Cart")}>Add to Cart</button>
                <button className="buy-now-btn" onClick={() => navigate("/checkout")}>Buy It Now</button>
              </div>
            </div>

            <div className="product-meta">
              <p><strong>Category:</strong> {product.category_name}</p>
              <p><strong>Availability:</strong> In Stock</p>
            </div>
          </div>
        </section>

        <hr className="section-divider" />

        {/* REVIEWS & COMMENTS SECTION */}
        <section className="reviews-section">
          <h2>Customer Feedback</h2>
          <div className="review-input-box">
            <textarea placeholder="Write your review here..."></textarea>
            <div className="submit-row">
              <div className="rate-it">Rate: ★★★★☆</div>
              <button className="post-review-btn">Post Comment</button>
            </div>
          </div>
          
          <div className="comments-list">
            <div className="comment-item">
              <div className="user-avatar">JD</div>
              <div className="comment-content">
                <strong>John Doe</strong> <span>★★★★★</span>
                <p>Amazing quality! The material is very premium. Highly recommended.</p>
              </div>
            </div>
          </div>
        </section>

        {/* SUGGESTED PRODUCTS */}
        <section className="related-section">
          <h2>You May Also Like</h2>
          <div className="products-grid">
            {relatedProducts.map(item => (
              <div key={item.id} className="product-card" onClick={() => navigate(`/product/${item.slug}`)}>
                 <div className="product-image-wrapper">
                    <img src={item.main_image} alt={item.name} />
                 </div>
                 <div className="product-info">
                    <h4>{item.name}</h4>
                    <p className="current-price">{item.discount_price || item.price} ETB</p>
                 </div>
              </div>
            ))}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}

export default ProductDetail;