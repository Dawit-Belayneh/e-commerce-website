import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./FeaturedProducts.css";    
import API from "../api/axios"


function FeaturedProducts({ limit }){
    const [products, setProducts] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        API.get("products/")
            .then((res) => setProducts(res.data.slice(0, limit)))
            .catch((err) => console.error(err));
    }, [limit]);

    return(
        <div className="featured-container">
            <div className="featured-grid">
                {products.map((product) => {
                    const hasDiscount = product.discount_price && Number(product.discount_price) > 0;
                    const displayPrice = hasDiscount ? product.discount_price : product.price;
                    return (
                        <div key={product.id} className="product-card-v2" onClick={() => navigate(`/product/${product.slug}`)}>
                            <div className="image-wrapper">
                                {hasDiscount && <span className="featured-sale-tag">Sale</span>}
                                <img src={product.main_image || "https://via.placeholder.com/300"} alt={product.name} />
                                <div className="overlay-actions">
                                    <button className="quick-view">Quick View</button>
                                </div>
                            </div>
                            <div className="info-wrapper">
                                <p className="brand-name">EthioShop Selection</p>
                                <h3 className="product-title">{product.name}</h3>
                                <div className="price-row">
                                    <div className="price-stack">
                                        <span className="current-price">{displayPrice} ETB</span>
                                        {hasDiscount && (
                                            <span className="old-price">{product.price} ETB</span>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}


export default FeaturedProducts;