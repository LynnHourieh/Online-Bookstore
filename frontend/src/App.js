import logo from "./logo.svg";
import "./App.css";
import Container from "react-bootstrap/Container";
import Navbar from "react-bootstrap/Navbar";
import HomeScreen from "./screens/HomeScreen";
import { Route, Routes } from "react-router-dom";
import ProductScreen from "./screens/ProductScreen";
import { Fragment } from "react";

import { LinkContainer } from "react-router-bootstrap";
function App() {
  return (
    <div className="d-flex flex-column site-container"> 
      <Navbar bg="light" variant="light">
        <Container>
          <LinkContainer to="/">
            <Navbar.Brand>BookStore</Navbar.Brand>
          </LinkContainer>
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
