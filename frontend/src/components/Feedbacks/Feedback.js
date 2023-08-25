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
import { Store } from "../../store";
import { toast } from "react-toastify";
const reducer = (state, action) => {
  const { type, payload } = action;
  switch (type) {
    case "Fetch_REQUEST":
      return { ...state, loading: true };
    case "FETCH_SUCCESS":
      return { ...state, feedback: payload, loading: false };

    case "FETCH_FAIL":
      return { ...state, loading: false, error: payload };
    case "DELETE_SUCCESS":
      return {
        ...state,
        loadingDelete: false,
        successDelete: true,
      };
    case "DELETE_FAIL":
      return { ...state, loadingDelete: false, successDelete: false };
    default:
      return state;
  }
};
function Feedback({ productId }) {
  const INITAL_STATE = {
    loading: true,
    error: "",
    loadingDelete: true,
    successDelete: false,
    feedback: [],
  };
  const [{ loading, error, feedback }, dispatch] = useReducer(
    reducer,
    INITAL_STATE
  );
  const { state, dispatch: ctxDispatch } = useContext(Store);
  const { userInfo } = state;

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

    fetchData();
  }, [productId, feedback]);

  const deleteFeedback = async (feedbackId) => {
    try {
      const { data } = await axios.delete(`/api/feedback/${feedbackId}`, {
        headers: {
          Authorization: userInfo.token,
        },
      });

      toast.success("Feedback deleted successfully");
      console.log("Feedback deleted:", data);
      dispatch({ type: "DELETE_SUCCESS" });
    } catch (error) {
      console.error("Error deleting feedback:", error);
      toast.error(getError(error));
      dispatch({ type: "DELETE_FAIL" });
    }
  };

  return loading ? (
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
                    <Col>
                      {" "}
                      {[1, 2, 3, 4, 5].map((value) => (
                        <FontAwesomeIcon
                          style={{ color: "FFC000" }}
                          key={value}
                          icon={value <= item.rating ? solidStar : regularStar}
                        />
                      ))}
                    </Col>
                    <Col>
                      {userInfo._id == item.user._id ? (
                        <i
                          className="bi bi-trash"
                          style={{ cursor: "pointer" }}
                          onClick={() => deleteFeedback(item._id)}
                        ></i>
                      ) : (
                        ""
                      )}
                    </Col>
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
