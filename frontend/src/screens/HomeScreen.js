import React from "react";
import data from "../data";
import { Link } from "react-router-dom";
function HomeScreen() {
  return (
    <div>
     
      <h1>Featured Books</h1>
      <div className="products-container">
        {data.products.map((product) => (
          <div className="product" key={product.id}>
            <Link to={`/product/${product.title}`}>
              <img src={product.image} className="product-image" />
            </Link>
            <div className="product-details">
              <p>{product.title}</p>
              <p>{product.price}</p>
            </div>
          </div>
        ))}{" "}
      </div>{" "}
    </div>
  );
}

export default HomeScreen;
