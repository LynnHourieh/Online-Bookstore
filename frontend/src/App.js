import logo from "./logo.svg";
import "./App.css";
import Container from "react-bootstrap/Container";
import Navbar from "react-bootstrap/Navbar";
import HomeScreen from "./screens/HomeScreen";
import { Route, Routes } from "react-router-dom";
import ProductScreen from "./screens/ProductScreen";
import { useContext } from "react";
import { Store } from "./store";
import Badge from "react-bootstrap/Badge";
import Nav from "react-bootstrap/Nav";
import { Link } from "react-router-dom";

import { LinkContainer } from "react-router-bootstrap";
function App() {
    const { state } = useContext(Store);
    const { cart } = state;
  return (
    <div className="d-flex flex-column site-container">
      <Navbar bg="light" variant="light">
        <Container>
          <LinkContainer to="/">
            <Navbar.Brand>BookStore</Navbar.Brand>
          </LinkContainer>
          <Nav className="me-auto">
            <Link to="/cart" className="nav-link">
              Cart
              {cart.cartItems.length > 0 && (
                <Badge pill bg="primary">
                  {cart.cartItems.length}
                </Badge>
              )}
            </Link>
          </Nav>
        </Container>
      </Navbar>

      <main>
        <Container>
          <Routes>
            <Route path="/" element={<HomeScreen />} />
            <Route path="/product/:title" element={<ProductScreen />} />
          </Routes>
        </Container>
      </main>
    </div>
  );
}

export default App;
