import { useContext } from "react";
import { Store } from "../store";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import MessageBox from "../components/Message/Message";
import ListGroup from "react-bootstrap/ListGroup";
import Button from "react-bootstrap/Button";
import { Link } from "react-router-dom";

export default function WishListScreen() {
  const { state, dispatch: ctxDispatch } = useContext(Store);
  const {
    wishlist: { wishlistItems },
  } = state;

  const removeItemHandler = (item) => {
    ctxDispatch({
      type: "REMOVE_ITEM_FROM_WISHLIST",
      payload: item,
    });
  };

  return (
    <div>
      <h1>WishList</h1>
      <Row>
        <Col md={8}>
          {wishlistItems.length === 0 ? (
            <MessageBox>
              Wishlist is empty. <Link to="/">Add prefered items</Link>
            </MessageBox>
          ) : (
            <ListGroup>
              {wishlistItems.map((item) => (
                <ListGroup.Item key={item._id}>
                  <Row className="align-items-center">
                    <Col md={3}>
                      <Link
                        style={{ textDecoration: "none", color: "black" }}
                        className="align-items-center"
                        to={`/product/${item._id}`}
                      >
                        {item.title}
                      </Link>
                    </Col>
                    <Col md={2}>
                      <Link
                        className="align-items-center"
                        to={`/product/${item._id}`}
                      >
                        {" "}
                        <img
                          src={item.image}
                          alt={item.name}
                          className="img-fluid rounded img-thumbnail"
                        ></img>{" "}
                      </Link>
                    </Col>

                    <Col md={3}>${item.price}</Col>
                    <Col md={2}>
                      <Button
                        variant="light"
                        onClick={() => removeItemHandler(item)}
                      >
                        <i className="fas fa-trash"></i>
                      </Button>
                    </Col>
                  </Row>
                </ListGroup.Item>
              ))}
            </ListGroup>
          )}
        </Col>
      </Row>
    </div>
  );
}
