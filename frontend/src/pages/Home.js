import Navbar from "./Navbar";
import Footer from "./Footer";
import FeaturedProducts  from "./FeaturedProducts";
import "./Home.css";
import { useRef } from "react";
import { Link } from "react-router-dom";
import useCategories from "../hooks/useCategories";

function Home() {
  
    const scrollRef = useRef(null);
    const { categories, loading } = useCategories();

    if (loading) return <p>Loading categories...</p>


  // const scroll = (direction) => {
  //   if (direction === "left") {
  //     scrollRef.current.scrollLeft -= 300;
  //   } else {
  //     scrollRef.current.scrollLeft += 300;
  //   }
  // };

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
            <Link to="/categories" className="more-link">
              More →
            </Link>
        </div>

        <div className="category-grid" ref={scrollRef}>
          {categories.map((category) => (
            <div key={category.id} className="category-card">
              <img src={category.main_image || "https://via.placeholder.com/300"} alt={category.name} />
              <h4>{category.name}</h4>
              <button className="explore-btn">Explore →</button>
            </div>
          ))}
        </div>
      </section>

      {/* MAIN PRODUCTS SECTION */}
      <main className="main-content">
        <div className="section-title">
          <h2>Featured Products</h2>
          <hr />
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