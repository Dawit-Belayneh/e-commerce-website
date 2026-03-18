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
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [canReview, setCanReview] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0); // Reset scroll on page load
    setLoading(true);
    
    API.get(`products/${slug}/`)
      .then((res) => {
        const productData = res.data;
        setProduct(res.data);

        // --- NEW: CHECK IF USER CAN REVIEW ---
        const token = localStorage.getItem("access_token");
        if (token){
          API.get("orders/")
            .then((orderRes) => {
              const orders = orderRes.data;

              const hasDeliveredOrder = orders.some(order =>
                order.status === "DELIVERED" &&
                orders.items.some(item => item.product_id === productData.name)
              );
              setCanReview(hasDeliveredOrder);
          })        
            .catch(err => console.error("Order fetch failed", err));
          }
        // Fetch related products from the same category
        return API.get(`products/?category__name=${res.data.category_name}&limit=4`);
      })
      .then((res) => {
        const allProducts = res.data.results || res.data;
        
        const filtered = allProducts.filter(p => p.slug !== slug)
        setRelatedProducts(filtered);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, [slug]);

  if (loading) return <div className="loader">Loading Product...</div>;
  if (!product) return <div className="error">Product not found.</div>;

    const addToCart = () => {
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

  const handleBuyNow = () => {
    const token = localStorage.getItem("access_token");
    if (!token) {
      alert("Please log in to proceed to checkout.");
      navigate("/login", { state: { from: window.location.pathname } });
      return;
    }

    let cart = JSON.parse(localStorage.getItem("cart")) || [];
    const existingItemIndex = cart.findIndex((item) => item.id === product.id);

    if (existingItemIndex > -1){
      cart[existingItemIndex].quantity += quantity;
    } else {
      cart.push({
        id: product.id,
        name: product.name,
        price: product.discount_price || product.price,
        main_image: product.main_image,
        quantity: quantity,
      });
    }
    localStorage.setItem("cart", JSON.stringify(cart));
    window.dispatchEvent(new Event("cartUpdated"));
    navigate("/checkout");
  };
  const hasDiscount = product.discount_price && Number(product.discount_price) > 0;
  const currentPrice = hasDiscount ? product.discount_price : product.price;

  const percentOff = hasDiscount ? Math.round((1 - (Number(product.discount_price) / Number(product.price))) * 100) : 0;

  const handlePostReview = async () => {
    if (!comment) return alert("Please write a comment!");

    setSubmitting(true);

    try {
      const res = await API.post("reviews/", {
        product: product.id,
        rating: rating,
        comment: comment,
      });
      alert("Review posted successfully!");
      
      setProduct(prevProduct => {
        const currentReviews = Array.isArray(prevProduct.reviews) ? prevProduct.reviews : [];

        return {
          ...prevProduct,
          reviews: [res.data, ...currentReviews]
        };
      })
      setComment("");
      setRating(5);
    } catch (err) {
      console.error("Error posting review:", err.response?.data);
      alert("Failed to post review. You might have already reviewed this product.");
    } finally {
      setSubmitting(false);
    }
  }
  return (
    <div className="page-layout">
      <Navbar />
      
      <main className="detail-container">
        <section className="product-main-view">
          {/* LEFT: IMAGE GALLERY */}
          <div className="detail-image-section">
            <div className="main-image-box">
              {hasDiscount && <span className="detail-sale-tag">-{percentOff}% OFF</span>}
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
                <button className="add-cart-btn" onClick={addToCart}>
                  Add to Cart
                </button>
                <button className="buy-now-btn" onClick={handleBuyNow}>
                  Buy It Now
                </button>
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

          {/* Only show input if they bought it and it's delivered */}
          {canReview ? (
            <div className="review-input-box">
              <textarea 
                placeholder="Write your review here..."
                value={comment}
                onChange={(e) => setComment(e.target.value)}
              ></textarea>
              <div className="submit-row">
                <div className="rate-it">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <span key={star} onClick={() => setRating(star)} style={{ cursor: 'pointer', color: star <= rating ? '#ffc107' : '#ddd' }}>
                      ★
                    </span>
                  ))}
                </div>
                <button className="post-review-btn" onClick={handlePostReview} disabled={submitting}>
                  {submitting ? "Posting..." : "Post Comment"}
                </button>
              </div>
            </div>
          ) : (
            <div className="review-locked-msg">
              <p>Only customers who purchased this item and received delivery can leave a review.</p>
            </div>
          )}

          {/* Display limited reviews */}
          <div className="comments-list">
            {(product.reviews || []).slice(0, 3).map((rev) => (
              <div className="comment-item" key={rev.id}>
                <div className="user-avatar">{rev.user_name?.[0]}</div>
                <div className="comment-content">
                  <strong>{rev.user_name}</strong> <span>{"★".repeat(rev.rating)}</span>
                  <p>{rev.comment}</p>
                </div>
              </div>
            ))}
          </div>

          {/* See More Link */}
          {product?.reviews?.length > 3 && (
            <div className="see-more-reviews-wrapper">
              <button 
                className="see-more-btn" 
                onClick={() => navigate(`/product/${product.slug}/reviews`)}
              >
                See All {product.reviews.length} Reviews →
              </button>
            </div>
          )}
        </section>

        {/* SUGGESTED PRODUCTS */}
        <section className="related-section">
          <h2>You May Also Like</h2>
          <div className="products-grid">
            {relatedProducts.map(item => {
              const itemHasDiscount = item.discount_price && Number(item.discount_price) > 0;
              const itemDisplayPrice = itemHasDiscount ? item.discount_price : item.price;

              return (
                  <div key={item.id} className="product-card" onClick={() => navigate(`/product/${item.slug}`)}>
                      <div className="product-image-wrapper">
                          {/* Add the sale tag here too! */}
                          {itemHasDiscount && <span className="discount-tag">Sale</span>}
                          <img src={item.main_image} alt={item.name} />
                      </div>
                      <div className="product-info">
                          <h4>{item.name}</h4>
                          <div className="price-container">
                              <span className="current-price">{itemDisplayPrice} ETB</span>
                              {itemHasDiscount && <span className="old-price">{item.price} ETB</span>}
                          </div>
                      </div>
                  </div>
              );
            })} 
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}

export default ProductDetail;