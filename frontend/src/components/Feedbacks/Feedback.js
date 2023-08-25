import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Card from "react-bootstrap/Card";
import ListGroup from "react-bootstrap/ListGroup";
import { useEffect, useReducer, useState, useContext } from "react";
import { getError } from "../../utlis";
import axios from "axios";
import LoadingBox from "../Loading/Loading";
import MessageBox from "../Message/Message";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar as solidStar } from "@fortawesome/free-solid-svg-icons";
import { faStar as regularStar } from "@fortawesome/free-regular-svg-icons";

const reducer = (state, action) => {
  const { type, payload } = action;
  switch (type) {
    case "Fetch_REQUEST":
      return { ...state, loading: true };
    case "FETCH_SUCCESS":
      return { ...state, feedback: payload, loading: false };

    case "FETCH_FAIL":
      return { ...state, loading: false, error: payload };

    case "Fetch_REQUEST_RATING":
      return { ...state, loadings: true };
    case "FETCH_SUCCESS_RATING":
      return { ...state, ratings: payload, loadings: false };
    case "FETCH_FAIL_RATING":
      return { ...state, loadings: false, errors: payload };
    default:
      return state;
  }
};
function Feedback({ productId }) {

  //const [rating, setRating] = useState(0);

  // const handleRatingChange = (newRating) => {
  //   setRating(newRating);
  // };

  const INITAL_STATE = {
    loading: true,
    error: "",
    errors: "",
    feedback: [],
    ratings: [],
    loadings: true,
  };
  const [{ loading, error, feedback, ratings, loadings }, dispatch] =
    useReducer(reducer, INITAL_STATE);
 

  useEffect(() => {
    const fetchData = async () => {
      dispatch({ type: "FETCH_REQUEST" });
      try {
        const result = await axios.get(`/api/feedback/product/${productId}`);

        dispatch({ type: "FETCH_SUCCESS", payload: result.data });
      } catch (error) {
        dispatch({ type: "FETCH_FAIL", payload: getError(error) });
      }
    };
    const fetchRating = async () => {
      dispatch({ type: "FETCH_REQUEST_RATING" });
      try {
        const result = await axios.get(`/api/rating/product/${productId}`);

        dispatch({ type: "FETCH_SUCCESS_RATING", payload: result.data });
      } catch (error) {
        dispatch({ type: "FETCH_FAIL_RATING", payload: getError(error) });
      }
    };
    fetchRating();
    fetchData();

  }, [productId, feedback, ratings]);


  return loading && loadings ? (
    <LoadingBox />
  ) : error ? (
    <MessageBox variant="danger">{error}</MessageBox>
  ) : (
    <>
      <h2>Reviews</h2>
      {feedback ? (
        feedback?.map((item) => (
          <Card key={item._id}>
            <Card.Body>
              <ListGroup variant="flush">
                <ListGroup.Item>
                  <Row>
                    <Col>{item.user.name}</Col>
                    <Col>{item.text}</Col>
                    {/* <Col>
                      {" "}
                      {[1, 2, 3, 4, 5].map((value) => (
                         <FontAwesomeIcon
                          style={{ color: "FFC000" }}
                          key={value}
                          icon={
                            value <= 1 ? solidStar : regularStar
                          }
                        />
                      ))}
                    </Col> */}
                    
                  </Row>
                </ListGroup.Item>
              </ListGroup>
            </Card.Body>
          </Card>
        ))
      ) : (
        <p>No Reviews Yet</p>
      )}
    </>
  );
}

export default Feedback;
