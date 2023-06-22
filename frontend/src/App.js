import logo from "./logo.svg";
import "./App.css";
import data from "./data";
import HomeScreen from "./screens/HomeScreen";
import { Route, Routes } from "react-router-dom";
import ProductScreen from "./screens/ProductScreen";
import { Fragment } from "react";
import { Link } from "react-router-dom";

function App() {
  
  return (
    <Fragment>
      <header>
        <Link to="/">Online-BookStore</Link>
      </header>

      <Routes>
        <Route path="/" element={<HomeScreen />} />
        <Route path="/product/:title" element={<ProductScreen />} />
      </Routes>
    </Fragment>
  );
}

export default App;
