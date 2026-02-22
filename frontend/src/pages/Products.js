import { useState, useEffect } from "react";
import API from "../api/axios";

function Products() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    API.get("products/")
      .then((res) => {
        console.log("Backend data:", res.data);
        setProducts(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error:", err);
        setLoading(false);
      });
  }, []);

  if (loading) return <h2>Loading...</h2>;

  return (
    <div>
      <h1>Products</h1>

      {products.length === 0 ? (
        <p>No products found</p>
      ) : (
        products.map((product) => (
          <div key={product.id} style={{ border: "1px solid gray", margin: "10px", padding: "10px" }}>
            <h3>{product.name}</h3>
            <p>Price: {product.price} ETB</p>
            <p>{product.description}</p>
          </div>
        ))
      )}
    </div>
  );
}

export default Products;