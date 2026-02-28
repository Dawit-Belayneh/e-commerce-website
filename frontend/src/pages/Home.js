import Navbar from "./Navbar";
import Products from "./Products"; // Use your existing Products component
import Footer from "./Footer";
import "./Home.css";
import { useRef } from "react";
import { Link } from "react-router-dom";

function Home() {
  
    const scrollRef = useRef(null);

  const categories = [
    {
      name: "Electronics",
      image: "https://res.cloudinary.com/demo/image/upload/sample.jpg"
    },
    {
      name: "Fashion",
      image: "https://res.cloudinary.com/demo/image/upload/sample.jpg"
    },
    {
      name: "Home Decor",
      image: "https://res.cloudinary.com/demo/image/upload/sample.jpg"
    },
    {
      name: "Beauty",
      image: "https://res.cloudinary.com/demo/image/upload/sample.jpg"
    },
        {
      name: "Electronics",
      image: "https://res.cloudinary.com/demo/image/upload/sample.jpg"
    },
    {
      name: "Fashion",
      image: "https://res.cloudinary.com/demo/image/upload/sample.jpg"
    },
    {
      name: "Home Decor",
      image: "https://res.cloudinary.com/demo/image/upload/sample.jpg"
    },
    {
      name: "Beauty",
      image: "https://res.cloudinary.com/demo/image/upload/sample.jpg"
    }
  ];

  const scroll = (direction) => {
    if (direction === "left") {
      scrollRef.current.scrollLeft -= 300;
    } else {
      scrollRef.current.scrollLeft += 300;
    }
  };

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

        {/* <div className="scroll-buttons">
          <button onClick={() => scroll("left")} className="arrow-btn">◀</button>
          <button onClick={() => scroll("right")} className="arrow-btn">▶</button>
        </div> */}

        <div className="category-grid" ref={scrollRef}>
          {categories.map((cat, index) => (
            <div key={index} className="category-card">
              <img src={cat.image} alt={cat.name} />
              <h4>{cat.name}</h4>
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
        <Products /> {/* This calls your existing product grid logic */}
      </main>

      <Footer />
    </div>
  );
}

export default Home;