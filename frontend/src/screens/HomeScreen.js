import React, { useEffect, useState, useReducer } from "react";
import axios from "axios";
import logger from "use-reducer-logger";
import { Link } from "react-router-dom";

const reducer = (state, action) => {
  const { type, payload } = action;
  switch (type) {
    case "Fetch_REQUEST":
      return { ...state, loading: true };
    case "FETCH_SUCCESS":
      return { ...state, products: payload, loading: false };
    case "FETCH_FAIL":
      return { ...state, loading: false, error: payload };
    default:
      return state;
  }
};
function HomeScreen() {
  const INITAL_STATE = { loading: true, error: "",products:[] };
  const [{ loading, error, products }, dispatch] = useReducer(
    logger(reducer),
    INITAL_STATE
  );

  //const[products,setProducts]=useState([])
  useEffect(() => {
    const fetchData = async () => {
      dispatch({ type: "FETCH_REQUEST" });
      try {
        const result = await axios.get("/api/products");
        dispatch({ type: "FETCH_SUCCESS", payload: result.data });
      } catch (error) {
        dispatch({ type: "FETCH_FAIL", payload: error.message });
      }

      //setProducts(result.data);
    };
    fetchData();
  }, []);
  console.log(products);
  return (
    <div>
      <h1>Featured Books</h1>
      <div className="products-container">
        {loading? <div>loading...</div> : error? <div>{error}</div> : products?.map((product) => (
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
