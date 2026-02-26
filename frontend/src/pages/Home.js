import Navbar from "./Navbar";
import Products from "./Products"; // Use your existing Products component
import Footer from "./Footer";
import "./Home.css";

function Home() {
  const categories = ["Electronics", "Fashion", "Home Decor", "Beauty"];

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
        <h2>Shop by Category</h2>
        <div className="category-grid">
          {categories.map((cat, index) => (
            <div key={index} className="category-card">
              {cat}
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
        <Products /> {/* This calls your existing product grid logic */}
      </main>

      <Footer />
    </div>
  );
}

export default Home;