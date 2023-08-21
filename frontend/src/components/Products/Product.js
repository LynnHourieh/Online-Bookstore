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
  const {
    wishlist: { wishlistItems },
  } = state;
  console.log(wishlistItems)
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
  };
  const removeItemHandler = (item) => {
    ctxDispatch({
      type: "REMOVE_ITEM_FROM_WISHLIST",
      payload: item,
    });
  };

  return (
    <Card style={{ height: 520 }}>
      <Link to={`/product/${product._id}`}>
        {" "}
        <img
          src={`/images/${product.image}`}
          className="card-img-top product-img"
        />
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
          <div style={{ display: "flex", justifyContent: "space-around" }}>
            <Card.Text style={{ marginTop: 10 }}>
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
              )}
            </Card.Text>
            <Card.Text>
              {wishlistItems?.map((item) => item._id).includes(product._id) ? (
                <Button
                  variant="link"
                  onClick={() => removeItemHandler(product)}
                >
                  <i
                    class="bi bi-heart-fill"
                    style={{
                      fontSize: "28px",
                      color: "red",
                      marginBottom: "10px",
                    }}
                  ></i>
                </Button>
              ) : (
                <Button
                  variant="link"
                  onClick={() => addToWishlistHandler(product)}
                >
                  {" "}
                  <i
                    className="bi bi-heart"
                    style={{
                      fontSize: "28px",
                      color: "gray",
                      marginBottom: "10px",
                    }}
                  ></i>
                </Button>
              )}{" "}
            </Card.Text>{" "}
          </div>
        </Card.Text>
      </Card.Body>
    </Card>
  );
}

export default Product;
