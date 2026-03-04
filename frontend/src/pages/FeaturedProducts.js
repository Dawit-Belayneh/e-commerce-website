import { useState, useEffect } from "react";
import "./FeaturedProducts.css";    
import API from "../api/axios"


function FeaturedProducts({ limit }){
    const [products, setProducts] = useState([]);

    useEffect(() => {
        API.get("products/")
            .then((res) => setProducts(res.data.slice(0, limit)))
            .catch((err) => console.error(err));
    }, [limit]);

    return(
        <div className="featured-container">
            <div className="featured-grid">
                {products.map((product) => (
                    <div key={product.id} className="product-card-v2">
                        <div className="image-wrapper">
                            <img src={product.main_image || "https://via.placeholder.com/300"} alt={product.name} />
                            <div className="overlay-actions">
                                <button className="quick-view">Quick View</button>
                            </div>
                        </div>
                        <div className="info-wrapper">
                            <p className="brand-name">EthioShop Selection</p>
                            <h3 className="product-title">{product.name}</h3>
                            <div className="price-row">
                                <span className="current-price">{product.price} ETB</span>
                                <button className="add-to-cart-icon">
                                    <span>+</span>
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>

    );
}


export default FeaturedProducts;