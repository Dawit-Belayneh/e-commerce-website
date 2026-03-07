import { Link} from "react-router-dom";
import { useState, useEffect } from "react";
import API from "../api/axios";
import Navbar from "./Navbar";
import Footer from "./Footer";
import "./CategoriesPage.css";


function CategoriesPage(){
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const res = await API.get("categories/");
                setCategories(res.data);
                setLoading(false);
            } catch (err) {
                console.error("Error:", err);
                setError("Failed to load categories. Please try again later.");
                setLoading(false);
            }
        };
        fetchCategories();
    }, []);

    if (loading) return <p>Loading categories...</p>
    if (error) return <p>{error}</p>

    return (
        <div className="categories-page-wrapper">
            <Navbar />

            <header className="page-header">
                <h1>Explore Our Categories</h1>
                <p>Explore our curated collections across all departments.</p>
            </header>

            <main className="categories-container">
                {/* 2. Loading & Error Handling */}
                {loading && <div className="loading-state">Gathering categories...</div>}
                {error && <div className="error-message">{error}</div>}

                {!loading && !error && (
                    <div className="categories-full-grid">
                        {categories.map((category) => (
                            /* 3. Logic: Link to Products page with a category filter */
                            <Link 
                                to={`/products?category=${category.name}`} 
                                key={category.id} 
                                className="category-item-card"
                            >
                                <div className="category-image-box">
                                    <img 
                                        src={category.main_image || "https://via.placeholder.com/400"} 
                                        alt={category.name} 
                                    />
                                    <div className="category-overlay">
                                        <span>Explore Collection</span>
                                    </div>
                                </div>
                                <div className="category-info">
                                    <h3>{category.name}</h3>
                                    {/* Display product count if your API provides it */}
                                    {category.product_count && (
                                        <p>{category.product_count} Items</p>
                                    )}
                                </div>
                            </Link>
                        ))}
                    </div>
                )}
            </main>
            <Footer />
        </div>
    );
}

export default CategoriesPage;