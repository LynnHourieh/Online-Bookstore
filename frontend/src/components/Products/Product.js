import React, { useContext, useState } from "react";
import { Link } from "react-router-dom";
import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/Button";
import Rating from "../Rating/Rating";
import axios from "axios";
import { Store } from "../../store";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeart } from "@fortawesome/free-solid-svg-icons";
import { toast } from "react-toastify";

function Product({ product }) {
  const { state, dispatch: ctxDispatch } = useContext(Store);
  const {
    cart: { cartItems },
  } = state;

  const addToCartHandler = async (product) => {
    const existItem = cartItems.find((x) => x._id === product._id);
    const quantity = existItem ? existItem.quantity + 1 : 1;
    const { data } = await axios.get(`/api/products/${product._id}`);
    if (data.countInStock < quantity) {
      window.alert("Product out of stuck");
      return;
    }
    ctxDispatch({
      type: "CART_ADD_ITEM",
      payload: { ...product, quantity },
    });
  };

  const addToWishlistHandler = (product) => {
    ctxDispatch({
      type: "ADD_ITEM_TO_WISHLIST",
      payload: { ...product, status: true },
    });
    toast("item added to wishlish")
   

  };

  return (
    <Card style={{ height: 500 }}>
      <Link to={`/product/${product._id}`}>
        {" "}
        <img src={product.image} className="card-img-top product-img" />
      </Link>
      <Card.Body className="card-body">
        <Link
          to={`/product/${product._id}`}
          style={{ color: "black", textDecoration: "none" }}
        >
          {/* Go to ProductScreen Component */}
          <Card.Title>{product.title}</Card.Title>
        </Link>

        <Rating rating={product.rating} />

        <Card.Text>{product.price} $</Card.Text>
        <Card.Text>By: {product.auther}</Card.Text>
        <Card.Text>
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <Card.Text>
              {" "}
              {product.countInStock === 0 ? (
                <Button variant="light" disabled>
                  Out of stock
                </Button>
              ) : (
                <Button
                  variant="primary"
                  onClick={() => addToCartHandler(product)}
                >
                  Add to cart
                </Button>
              )}{" "}
            </Card.Text>{" "}
            <Button
              variant="link"
              onClick={() => addToWishlistHandler(product)}
            >
              <FontAwesomeIcon
                icon={faHeart}
                color={"red"}
                style={{ fontSize: 28, marginBottom: 10 }}
              />
            </Button>
          </div>
        </Card.Text>
      </Card.Body>
    </Card>
  );
}

export default Product;
