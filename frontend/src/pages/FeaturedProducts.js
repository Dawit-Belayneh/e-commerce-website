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
        <div className="featured-products-grid">
            {products.map((product) => (
                <div key={product.id} className="item-card">
                    <div className="item-image">
                        <img src={product.main_image || "https://via.placeholder.com/300"} alt={product.name} />
                        <span className="badge">new</span>
                    </div>
                    <div className="item-info">
                        <h3>{product.name}</h3>
                        <p className="item-price">{product.price} <span>ETB</span></p>
                    </div>
                </div>
            ))}
        </div>

    );
}


export default FeaturedProducts;