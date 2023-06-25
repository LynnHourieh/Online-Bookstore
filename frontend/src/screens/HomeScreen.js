import React, { useEffect, useState, useReducer, useContext } from "react";
import axios from "axios";
import logger from "use-reducer-logger";
import { Store } from "../store";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Product from "../components/Products/Product";
import LoadingBox from "../components/Loading/Loading";
import MessageBox from "../components//Message/Message";

function HomeScreen() {

  const { state, dispatch: ctxDispatch } = useContext(Store);
  const {
    productInfo: { products, loading, error },
  } = state;

  useEffect(() => {
    const fetchData = async () => {
      ctxDispatch({ type: "FETCH_REQUEST" });
      try {
        const result = await axios.get("/api/products");
        ctxDispatch({ type: "FETCH_SUCCESS", payload: result.data });
      } catch (error) {
        ctxDispatch({ type: "FETCH_FAIL", payload: error.message });
      }
    };
    fetchData();
  }, []);


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
              <Col sm={6} md={4} lg={3} className="mb-3" key={product._id}>
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
