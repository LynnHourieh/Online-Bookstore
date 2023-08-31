import CheckoutSteps from "../components/Checkout/CheckoutSteps";
import Axios from "axios";
import React, { useContext, useEffect, useReducer } from "react";
import { Link, useNavigate } from "react-router-dom";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/Button";
import ListGroup from "react-bootstrap/ListGroup";
import { toast } from "react-toastify";
import { getError } from "../utlis";
import { Store } from "../store";
import LoadingBox from "../components/Loading/Loading";
import CartScreen from "./CartScreen";

const reducer = (state, action) => {
  const { type, payload } = action;
  switch (type) {
    case "CREATE_REQUEST":
      return { ...state, loading: true };
    case "CREATE_SUCCESS":
      return { ...state, loading: false };
    case "CREATE_FAIL":
      return { ...state, loading: false };
    default:
      return state;
  }
};

function PlaceOrderScreen() {
  const navigate = useNavigate();

  const [{ loading }, dispatch] = useReducer(reducer, {
    loading: false,
  });
  const { state, dispatch: ctxDispatch } = useContext(Store);
  const { cart, userInfo } = state;
  console.log(cart);
  const { cartItems, shippingAddress,paymentMethod } = cart;
  const total = cartItems.reduce((a, c) => a + c.price * c.quantity, 0);
  const subtotal = cartItems.reduce((a, c) => a + c.quantity, 0);
  cart.itemsPrice = cartItems.reduce((a, c) => a + c.quantity * c.price, 0);
  cart.totalPrice = cart.itemsPrice + 10;
  const placeOrderHandler = async () => {
    try {
      dispatch({ type: "CREATE_REQUEST" });
      const { data } = await Axios.post(
        "/api/orders",
        {
          orderItems: cart.cartItems,
          shippingAddress: cart.shippingAddress,
          itemsPrice: cart.itemsPrice,
          totalPrice: cart.totalPrice,
          paymentMethod:cart.paymentMethod,
          user:userInfo._id
        },
        //for authorization checking the token
        {
          headers: {
            authorization: userInfo.token,
          },
        }
      );
      ctxDispatch({ type: "CART_CLEAR" });
      dispatch({ type: "CREATE_SUCCESS" });
      localStorage.removeItem("cartItems");
     

      navigate(`/order/${data.order._id}`);
    } catch (err) {
      dispatch({ type: "CREATE_FAIL" });
      toast.error(getError(err));
    }
  };
  return (
    <div>
      <CheckoutSteps step1 step2 step3 step4 />

      <title>Preview Order</title>

      <h1 className="my-3">Preview Order</h1>
      <Row>
        <Col md={8}>
          <Card className="mb-3">
            <Card.Body>
              <Card.Title>Shipping</Card.Title>
              <Card.Text>
                <strong>Name:</strong> {shippingAddress.fullName} <br />
                <strong>Address: </strong> {shippingAddress.address},
                {shippingAddress.city}, {shippingAddress.postalCode},
                {shippingAddress.country}
              </Card.Text>
              <Link to="/shipping">Edit</Link>
            </Card.Body>
          </Card>
          <Card className="mb-3">
            <Card.Body>
              <Card.Title>Payment</Card.Title>
              <Card.Text>
                <strong>Type:</strong> {cart.paymentMethod}
              </Card.Text>
              <Link to="/payment">Edit</Link>
            </Card.Body>
          </Card>
          <Card className="mb-3">
            <Card.Body>
              <Card.Title>Books</Card.Title>
              <ListGroup variant="flush">
                {cartItems.map((item) => (
                  <ListGroup.Item key={item._id}>
                    <Row className="align-items-center">
                      <Col md={6}>
                        <strong>
                          <Link
                            to={`/product/${item._id}`}
                            style={{ textDecoration: 'none', color: 'black' }}
                          >
                            {' '}
                            <img
                              src={`/images/${item.image}`}
                              alt={item.title}
                              className="img-fluid rounded img-thumbnail"
                              style={{ height: 200 }}
                            ></img>
                            {'  '}
                            {item.title}
                          </Link>
                        </strong>
                      </Col>
                      <Col md={3}>
                        Quantity :<span>{item.quantity}</span>
                      </Col>
                      <Col md={3}>
                        Price : <span>${item.price}</span>
                      </Col>
                    </Row>
                  </ListGroup.Item>
                ))}
              </ListGroup>
              <Link to="/cart">Edit</Link>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4}>
          <Card>
            <Card.Body>
              <Card.Title>Order Summary</Card.Title>
              <ListGroup variant="flush">
                <ListGroup.Item>
                  <Row>
                    <Col>
                      <strong>Products number </strong>
                    </Col>
                    <Col>
                      <strong>{subtotal}</strong>
                    </Col>
                  </Row>
                </ListGroup.Item>
                <ListGroup.Item>
                  <Row>
                    <Col>
                      <strong>Total:</strong>
                    </Col>
                    <Col>
                      <strong>{total}$</strong>
                    </Col>
                  </Row>
                </ListGroup.Item>
                <ListGroup.Item>
                  <Row>
                    <Col>
                      <strong>Delivery Charge:</strong>
                    </Col>
                    <Col>
                      <strong>10$</strong>
                    </Col>
                  </Row>
                </ListGroup.Item>
                <ListGroup.Item>
                  <Row>
                    <Col>
                      <strong> Order Total:</strong>
                    </Col>
                    <Col>
                      <strong>{total + 10}$</strong>
                    </Col>
                  </Row>
                </ListGroup.Item>
                <ListGroup.Item>
                  <div className="d-grid">
                    <Button
                      type="button"
                      disabled={cartItems.length === 0}
                      onClick={placeOrderHandler}
                    >
                      Place Order
                    </Button>
                  </div>
                  {loading && <LoadingBox></LoadingBox>}
                </ListGroup.Item>
              </ListGroup>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </div>
  );
}

export default PlaceOrderScreen;
