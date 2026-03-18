import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import API from "../api/axios";
import Navbar from "./Navbar";
import Footer from "./Footer";
import "./ProductReviews.css";

function ProductReviews() {
  const { slug } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  
  // States for the Review Form
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [canReview, setCanReview] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
    fetchData();
  }, [slug]);

  const handleDelete = async (reviewId) => {
    if (!window.confirm("Are you sure you want to delete this review?")) return;
    try {
      await API.delete(`reviews/${reviewId}/`);
      // Update local state to remove the deleted review
      setProduct(prev => ({
        ...prev,
        reviews: prev.reviews.filter(r => r.id !== reviewId)
      }));
    } catch (err) {
      console.error("Error deleting review:", err);
    }
  };


  const fetchData = async () => {
    try {
      const res = await API.get(`products/${slug}/`);
      const productData = res.data;
      setProduct(productData);

      // Check if user is logged in and eligible to review
      const token = localStorage.getItem("access_token");
      if (token) {
        const orderRes = await API.get("orders/");
        const hasDelivered = orderRes.data.some(order => 
          order.status === "DELIVERED" && 
          order.items.some(item => item.product_name === productData.name)
        );
        setCanReview(hasDelivered);
      }
      setLoading(false);
    } catch (err) {
      console.error("Error fetching data:", err);
      setLoading(false);
    }
  };

  const handlePostReview = async () => {
    if (!comment) return alert("Please write a comment!");
    setSubmitting(true);

    try {
      const res = await API.post("reviews/", {
        product: product.id,
        rating: rating,
        comment: comment,
      });
      
      alert("Review posted!");
      // Update local state to show new review at the top
      setProduct(prev => ({
        ...prev,
        reviews: [res.data, ...(prev.reviews || [])]
      }));
      setComment("");
      setRating(5);
    } catch (err) {
      alert("Failed to post. You may have already reviewed this product.");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <div className="loader">Loading...</div>;
  if (!product) return <div className="error">Product not found.</div>;

  return (
    <div className="reviews-page">
      <Navbar />
      <div className="reviews-container">
        <Link to={`/product/${slug}`} className="back-btn">← Back to Product</Link>
        <h1>Reviews for {product.name}</h1>

        {/* 1. THE REVIEW FORM (Only if Eligible) */}
        {canReview ? (
          <div className="full-page-review-box">
            <h3>Write a Review</h3>
            <div className="star-selector">
              {[1, 2, 3, 4, 5].map(s => (
                <span key={s} onClick={() => setRating(s)} style={{color: s <= rating ? '#ffc107' : '#ccc', cursor: 'pointer', fontSize: '2rem'}}>★</span>
              ))}
            </div>
            <textarea 
              value={comment} 
              onChange={(e) => setComment(e.target.value)}
              placeholder="Share your experience with this product..."
            />
            <button onClick={handlePostReview} disabled={submitting}>
              {submitting ? "Posting..." : "Submit Review"}
            </button>
          </div>
        ) : (
          <div className="locked-msg">
            <p>Purchase this item to leave a review.</p>
          </div>
        )}

        <hr />

        {/* 2. THE LIST OF REVIEWS */}
        <div className="all-reviews-list">
          {product.reviews?.length > 0 ? (
            product.reviews.map((rev) => (
              <div className="review-card" key={rev.id}>
                <div className="review-header">
                  <strong>{rev.user_name}</strong>
                  <span className="stars">{"★".repeat(rev.rating)}</span>
                  {/* OWNER ACTIONS: Only show if this review belongs to the user */}
                    {rev.user_name === localStorage.getItem("username") && (
                      <div className="owner-actions">
                        <button onClick={() => handleDelete(rev.id)} className="del-btn">Delete</button>
                      </div>
                    )}
                </div>
                <p>{rev.comment}</p>
                <small>{new Date(rev.created_at).toLocaleDateString()}</small>
              </div>
            ))
          ) : (
            <p>No reviews yet.</p>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default ProductReviews;