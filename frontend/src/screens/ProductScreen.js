import React, { useState } from "react";
import { useEffect, useReducer, useContext } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Card from "react-bootstrap/Card";
import ListGroup from "react-bootstrap/ListGroup";
import Button from "react-bootstrap/Button";
import LoadingBox from "../components/Loading/Loading";
import MessageBox from "../components//Message/Message";
import { getError } from "../utlis";
import Badge from "react-bootstrap/Badge";
import Rating from "../components/Rating/Rating";
import { Store } from "../store";
import Feedback from "../components/Feedbacks/Feedback";
import { toast } from "react-toastify";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar as solidStar } from "@fortawesome/free-solid-svg-icons";
import { faStar as regularStar } from "@fortawesome/free-regular-svg-icons";

const reducer = (state, action) => {
  const { type, payload } = action;
  switch (type) {
    case "Fetch_REQUEST":
      return { ...state, loading: true };
    case "FETCH_SUCCESS":
      return { ...state, product: payload, loading: false };
    case "FETCH_FAIL":
      return { ...state, loading: false, error: payload };
    default:
      return state;
  }
};
function ProductScreen() {
  const INITAL_STATE = { loading: true, error: "", product: [] };
  const [{ loading, error, product }, dispatch] = useReducer(
    reducer,
    INITAL_STATE
  );



  const navigate = useNavigate();
  //to take title from url use useParams();
  const params = useParams();
  const { _id } = params;

  useEffect(() => {
    const fetchData = async () => {
      dispatch({ type: "FETCH_REQUEST" });
      try {
        const result = await axios.get(`/api/products/${_id}`);
        dispatch({ type: "FETCH_SUCCESS", payload: result.data });
      } catch (error) {
        dispatch({ type: "FETCH_FAIL", payload: getError(error) });
      }
    };
    fetchData();
    //console.log(_id);
  }, [_id]);
 
  const { state, dispatch: ctxDispatch } = useContext(Store);
  const { cart, userInfo } = state;

  const [text, setText] = useState("");
  const[rating,setRating]=useState(0)

  const handleRatingChange = (newRating) => {
    setRating(newRating);
   // addFeedback(newRating);
  };
  const addFeedback = async (e) => {
    e.preventDefault();
    const requestBody = {
      text: text,
      rating:rating
    };
    try {
      ctxDispatch({ type: "CREATE_REQUEST" });

      const { data } = await axios.post(
        `/api/feedback/product/${_id}/user/${userInfo._id}`,
        requestBody,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: userInfo.token,
          },
        }
      );
      setText("");
      setRating(0)
      toast.success("Feedback added successfully");
      ctxDispatch({ type: "CREATE_SUCCESS" });
    } catch (err) {
      console.error("Error adding feedback:", err);
      toast.error(getError(err));
      ctxDispatch({ type: "CREATE_FAIL" });
    }
  };
 
  const addToCartHandler = async () => {
    const existItem = cart.cartItems.find((x) => x._id === product._id);
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
    navigate("/cart");
  };
  return loading ? (
    <LoadingBox />
  ) : error ? (
    <MessageBox variant="danger">{error}</MessageBox>
  ) : (
    <div>
      <Row>
        <Col md={6}>
          <img
            className="img-large"
            src={`/images/${product.image}`}
            alt={product.name}
          />
        </Col>
        <Col md={5}>
          <ListGroup variant="flush">
            <ListGroup.Item>
              <h1>{product.title}</h1>
            </ListGroup.Item>
            Genre: {product.genre}
            <ListGroup>
              <div className="d-flex">
                <div>Rating: </div>
                <Rating rating={product.rating}></Rating>
              </div>
            </ListGroup>
            Auther : {product.auther}
            <ListGroup>
              Description:
              <p>{product.description}</p>
            </ListGroup>
          </ListGroup>

          <Card>
            <Card.Body>
              <ListGroup variant="flush">
                <ListGroup.Item>
                  <Row>
                    <Col>Price:</Col>
                    <Col>{product.price}$</Col>
                  </Row>
                </ListGroup.Item>
                <ListGroup.Item>
                  <Row>
                    <Col>Status:</Col>
                    <Col>
                      {product.countInStock > 0 ? (
                        <Badge bg="success">In Stock</Badge>
                      ) : (
                        <Badge bg="danger">Unavailable</Badge>
                      )}
                    </Col>
                  </Row>
                </ListGroup.Item>

                {product.countInStock > 0 && (
                  <ListGroup.Item>
                    <div className="d-grid">
                      <Button onClick={addToCartHandler} variant="primary">
                        Add to Cart
                      </Button>
                    </div>
                  </ListGroup.Item>
                )}
              </ListGroup>
            </Card.Body>
          </Card>
        </Col>
      </Row>
      <Row>
        {userInfo ? (
          <Col md={6}>
            <form encType="multipart/form-data">
              <div style={{ display: "flex", marginTop: 35 }}>
                <h4>Rate this book:</h4>
                <div>
                  {[1, 2, 3, 4, 5].map((value) => (
                    <FontAwesomeIcon
                      style={{
                        color: "FFC000",
                        cursor: userInfo ? "pointer" : "default", // Set cursor style based on userInfo
                        marginTop: 3,
                        fontSize: 20,
                      }}
                      key={value}
                      icon={value <= rating ? solidStar : regularStar}
                      onClick={() => userInfo && handleRatingChange(value)} // Apply onClick only if userInfo is true
                    />
                  ))}
                </div>
              </div>
              <div className="mb-3">
                <label htmlFor="exampleInputEmail1" className="form-label">
                  add your feedbacks or notes
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="exampleInputEmail1"
                  aria-describedby="emailHelp"
                  name="text"
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                />
              </div>
              <button onClick={(e)=>addFeedback(e)} className="btn btn-primary">
                Submit
              </button>
            </form>
          </Col>
        ) : (
          <Col md={6}>
            <h2>Reviews</h2>
            <form encType="multipart/form-data">
              <div className="mb-3">
                <label htmlFor="exampleInputEmail1" className="form-label">
                  add your feedbacks or notes
                </label>
                <input
                  disabled
                  type="text"
                  className="form-control"
                  id="exampleInputEmail1"
                  aria-describedby="emailHelp"
                  name="text"
                  placeholder="Sign in to add your feedback"
                />
              </div>
              <button
                onClick={addFeedback}
                className="btn btn-primary"
                disabled
              >
                Submit
              </button>
            </form>
          </Col>
        )}
        <Col md={5}>
          <Feedback productId={product._id} />
        </Col>
      </Row>
    </div>
  );
}

export default ProductScreen;
