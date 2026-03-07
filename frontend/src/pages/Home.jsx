import Navbar from "./Navbar";
import Footer from "./Footer";
import FeaturedProducts  from "./FeaturedProducts";
import "./Home.css";
import { Link } from "react-router-dom";
import useCategories from "../hooks/useCategories";

function Home() {
  
  const { categories, loading } = useCategories();

  if (loading) return <p>Loading categories...</p>

  return (
    <div className="home-wrapper">
      <Navbar />

      {/* HERO SECTION */}
      <header className="hero">
        <div className="hero-content">
          <h1>Quality Products, <br/> Delivered to You.</h1>
          <p>Shop the latest trends with fast delivery across Ethiopia.</p>
          <button className="shop-now-btn">Shop Now</button>
        </div>
      </header>

      {/* CATEGORIES SECTION */}
      <section className="categories-section">
        <div className="category-header">
          <h2>Shop by Category</h2>
          <Link to="/categories" className="more-link">See all</Link>
        </div>

        <div className="category-slider-wrapper">
          {/* The floating navigation button - styled as a white circle with > */}
          <div className="scroll-nav-container left">
            <button 
              className="scroll-btn-side" 
              onClick={() => {
                document.querySelector('.category-grid').scrollBy({ left: -300, behavior: 'smooth' });
              }}
            >
              <span className="icon">‹</span>
            </button>
          </div>
          <div className="scroll-nav-container right">
            <button 
              className="scroll-btn-side" 
              onClick={() => {
                document.querySelector('.category-grid').scrollBy({ left: 300, behavior: 'smooth' });
              }}
            >
              <span className="icon">›</span>
            </button>
          </div>

          <div className="category-grid">
            {categories.map((category) => (
              <div key={category.id} className="category-card">
                <div className="cat-img-box">
                  <img src={category.main_image || "https://via.placeholder.com/300"} alt={category.name} />
                </div>
                <h4 className="category-title-text">{category.name}</h4>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* MAIN PRODUCTS SECTION */}
      <main className="main-content">
        <div className="section-title">
          <h2>Featured Products</h2>
        </div>
          {/* PASSING A "HOME" VARIANT TO GET A DIFFERENT STYLE */}
          <FeaturedProducts limit={8} />

          <div className="view-all-center">
            <Link to="/products" className="btn-outline">View All Products</Link>
          </div>
      </main>

      <Footer />
    </div>
  );
}

export default Home;