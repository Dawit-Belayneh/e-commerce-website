import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api/axios";
import "./CategoriesHomePage.css";


function CategoriesHomePage({ limit }) {
    const [categories, setCategories] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        API.get('categories/')
            .then((res) => setCategories(res.data.slice(0, limit)))
            .catch((err) => console.error(err));
    }, [limit]);

    return (
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
    );
}

export default CategoriesHomePage;
