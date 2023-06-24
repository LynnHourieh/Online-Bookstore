import logo from "./logo.svg";
import "./App.css";
import Container from "react-bootstrap/Container";
import Navbar from "react-bootstrap/Navbar";
import HomeScreen from "./screens/HomeScreen";
import { Route, Routes, useNavigate } from "react-router-dom";
import ProductScreen from "./screens/ProductScreen";
import { useContext } from "react";
import { Store } from "./store";
import Badge from "react-bootstrap/Badge";
import Nav from "react-bootstrap/Nav";
import { Link } from "react-router-dom";
import CartScreen from "./screens/CartScreen";
import SigninScreen from "./screens/SigninScreen";
import { LinkContainer } from "react-router-bootstrap";
import NavDropdown from "react-bootstrap/NavDropdown";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ShippingAddressScreen from "./screens/ShippingAddressScreen";
function App() {
  const { state, dispatch: ctxDispatch } = useContext(Store);
  const navigate = useNavigate();
  //console.log("state",state)
  const { cart, userInfo } = state;
  const signoutHandler = () => {
    ctxDispatch({ type: "USER_SIGNOUT" });
     localStorage.removeItem("userInfo");
     localStorage.removeItem("shippingAddress");
     localStorage.removeItem("cartItems")
     window.location.href = "/signin";
  };
  return (
    <div className="d-flex flex-column site-container">
      <ToastContainer position="bottom-center" limit={1}/>
      <Navbar bg="light" variant="light">
        <Container>
          <LinkContainer to="/">
            <Navbar.Brand>BookStore</Navbar.Brand>
          </LinkContainer>
          {/* cart icon */}
          <Nav className="me-auto">
            <Link to="/cart" className="nav-link">
              Cart
              {cart.cartItems.length > 0 && (
                <Badge pill bg="primary">
                  {cart.cartItems.reduce((a, c) => a + c.quantity, 0)}
                </Badge>
              )}
            </Link>
            {userInfo ? (
              <NavDropdown title={userInfo.name} id="basic-nav-dropdown">
                <LinkContainer to="/profile">
                  <NavDropdown.Item>User Profile</NavDropdown.Item>
                </LinkContainer>
                <NavDropdown.Divider />
                <LinkContainer to="/orderhistory">
                  <NavDropdown.Item>Order History</NavDropdown.Item>
                </LinkContainer>
              </NavDropdown>
            ) : (
              <Link className="nav-link" to="/signin">
                Sign in
              </Link>
            )}
          </Nav>
          <Nav>
            {userInfo ? (
              <Link to="#signout" className="dropdown-item" onClick={signoutHandler}>
                Sign Out
              </Link>
            ) : (
              ""
            )}
          </Nav>
        </Container>
      </Navbar>

      <main>
        <Container>
          <Routes>
            <Route path="/" element={<HomeScreen />} />
            <Route path="/product/:_id" element={<ProductScreen />} />
            <Route path="/cart" element={<CartScreen />} />
            <Route path="/signin" element={<SigninScreen />} />
            <Route path="/shipping" element ={<ShippingAddressScreen/>} />
          </Routes>
        </Container>
      </main>
    </div>
  );
}

export default App;
