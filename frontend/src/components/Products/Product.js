import React from "react";
import { Link } from "react-router-dom";
import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/Button";
import Rating from "../Rating/Rating";
function Product({ product }) {
  return (
    <Card style={{ height: 500 }} >
      <Link to={`/product/${product.title}`}>
        {" "}
        <img src={product.image} className="card-img-top product-img" />
      </Link>
      <Card.Body className="card-body">
        <Link to={`/product/${product.title}`}>
          <Card.Title>{product.title}</Card.Title>
        </Link>
        <Rating rating={product.rating} numReviews={product.numReviews}/>
        <Card.Text>{product.price} $</Card.Text>
        <Card.Text>By: {product.auther}</Card.Text>
        <Button>Add to cart</Button>
      </Card.Body>
    </Card>
  );
}

export default Product;
