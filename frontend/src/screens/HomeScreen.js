import React, { useEffect, useState, useReducer } from "react";
import axios from "axios";
import logger from "use-reducer-logger";

import Row  from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Product from "../components/Products/Product";
import LoadingBox from "../components/Loading/Loading";
import MessageBox from "../components//Message/Message";

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
  const INITAL_STATE = { loading: true, error: "", products: [] };
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
  //console.log(products);
  return (
    <div>
      <h1>Featured Books</h1>
      <div className="products">
        {loading ? (
          <LoadingBox />
        ) : error ? (
          <MessageBox variant="danger">{error}</MessageBox>
        ) : (
          <Row>
            {products.map((product) => (
              <Col sm={6} md={4} lg={3} className="mb-3" key={product.id}>
                <Product product={product} />
              </Col>
            ))}
          </Row>
        )}{" "}
      </div>{" "}
    </div>
  );
}

export default HomeScreen;
