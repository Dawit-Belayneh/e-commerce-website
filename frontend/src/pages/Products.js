import { useState, useEffect } from 'react';
import API from '../api/axios';

function Products(){
    const [products, setProducts] = useState([]);

    useEffect(() => {
        API.get('products/')
        .then(res => setProducts(res.data));
    }, []);

    return (
        <div>
            <h1>Products</h1>
            {products.map(p => (
                <div key={p.id}>
                    <h2>{p.name}</h2>
                    <p>{p.description}</p>
                    <p>{p.price} ETB</p>
                </div>
            ))}
        </div>
    );
}

export default Products;