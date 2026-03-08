import Navbar from "./Navbar";
import Footer from "./Footer";
import FeaturedProducts  from "./FeaturedProducts";
import "./Home.css";
import { Link, useNavigate } from "react-router-dom";
import useCategories from "../hooks/useCategories";
import CategoriesHomePage from "./CategoriesHomePage";

function Home() {
  
  const { categories, loading } = useCategories();
  const navigate = useNavigate();

  if (loading) return <p>Loading page...</p>

  return (
    <div className="home-wrapper">
      <Navbar />

      {/* HERO SECTION */}
      <header className="hero">
        <div className="hero-content">
          <h1>Quality Products, <br/> Delivered to You.</h1>
          <p>Shop the latest trends with fast delivery across Ethiopia.</p>
          <button className="shop-now-btn" onClick={() => navigate("/products")}>Shop Now</button>
        </div>
      </header>

      {/* CATEGORIES SECTION */}
      <section className="categories-section">
        <div className="category-header">
          <h2>Shop by Category</h2>
          <Link to="/categories" className="more-link">See all</Link>
        </div>

        <CategoriesHomePage limit={8} />
        
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