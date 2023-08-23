import "./App.css";
import Container from "react-bootstrap/Container";
import Navbar from "react-bootstrap/Navbar";
import HomeScreen from "./screens/HomeScreen";
import { Route, Routes, useNavigate } from "react-router-dom";
import ProductScreen from "./screens/ProductScreen";
import { useContext, useState, useEffect } from "react";
import SearchBox from "./components/SearchBox";
import { Store } from "./store";
import Badge from "react-bootstrap/Badge";
import Nav from "react-bootstrap/Nav";
import { Link } from "react-router-dom";
import CartScreen from "./screens/CartScreen";
import SigninScreen from "./screens/SigninScreen";
import SignupScreen from "./screens/SignupScreen";
import { LinkContainer } from "react-router-bootstrap";
import NavDropdown from "react-bootstrap/NavDropdown";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ShippingAddressScreen from "./screens/ShippingAddressScreen";
import PlaceOrderScreen from "./screens/PlaceOrderScreen";
import OrderScreen from "./screens/OrderScreen";
import OrderHistoryScreen from "./screens/OrderHistoryScreen";
import ProfileScreen from "./screens/ProfileScreen";
import WishListScreen from "./screens/WishListScreen";
import SearchScreen from "./screens/SearchScreen";
import ProtectedRoute from "./components/User/ProtectedRoute";
import AdminRoute from "./components/Admin/AdminRoute";
import DashboardScreen from "./screens/DashboardScreen";
import ProductListScreen from "./screens/ProductListScreen";

function App() {
  const { state, dispatch: ctxDispatch } = useContext(Store);
  const navigate = useNavigate();
  const { cart, userInfo, productInfo,wishlist } = state;
  const { products } = productInfo;
//console.log(wishlist.wishlistItems)
  const signoutHandler = () => {
    ctxDispatch({ type: "USER_SIGNOUT" });
    localStorage.removeItem("userInfo");
    localStorage.removeItem("shippingAddress");
    localStorage.removeItem("cartItems");
    localStorage.removeItem("wishlistItems");
    window.location.href = "/signin";
  };

  return (
    <div>
      <ToastContainer position="bottom-center" limit={1} />
      <Navbar bg="light" variant="light">
        <Container>
          <LinkContainer to="/">
            <Navbar.Brand>
              <i
                class="bi bi-book"
                style={{
                  fontSize: "25px",
                }}
              ></i>{" "}
              BookStore{" "}
            </Navbar.Brand>
          </LinkContainer>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <SearchBox />
          </Navbar.Collapse>

          <Nav className="me-auto">
            <Link className="nav-link" to="/wishlist">
              <i
                class="bi bi-heart-fill"
                style={{
                  fontSize: "25px",
                  color: "red",
                }}
              ></i>
              {wishlist.wishlistItems.length > 0 && (
                <Badge pill bg="primary">
                  {wishlist.wishlistItems.length}
                </Badge>
              )}{" "}
            </Link>
            <Link to="/cart" className="nav-link">
             
              <i
                class="bi bi-cart"
                style={{
                  fontSize: "25px",
                }}
              ></i>
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
                <NavDropdown.Divider />
                <LinkContainer to="/signout">
                  <NavDropdown.Item onClick={signoutHandler}>
                    SignOut
                  </NavDropdown.Item>
                </LinkContainer>
              </NavDropdown>
            ) : (
              <Link className="nav-link" to="/signin">
                Sign in
              </Link>
            )}

            {userInfo && userInfo.isAdmin && (
              <NavDropdown title="Admin" id="admin-nav-dropdown">
                <LinkContainer to="/admin/dashboard">
                  <NavDropdown.Item>Dashboard</NavDropdown.Item>
                </LinkContainer>
                <NavDropdown.Divider />
                <LinkContainer to="/admin/products">
                  <NavDropdown.Item>Products</NavDropdown.Item>
                </LinkContainer>
                <NavDropdown.Divider />
                <LinkContainer to="/admin/order">
                  <NavDropdown.Item>Orders</NavDropdown.Item>
                </LinkContainer>
                <NavDropdown.Divider />
                <LinkContainer to="/admin/user">
                  <NavDropdown.Item>Users</NavDropdown.Item>
                </LinkContainer>
              </NavDropdown>
            )}
          </Nav>
        </Container>
      </Navbar>
      <div></div>
      <main>
        <Container>
          <Routes>
            <Route path="/" element={<HomeScreen />} />
            <Route path="/product/:_id" element={<ProductScreen />} />
            <Route path="/cart" element={<CartScreen />} />
            <Route path="/wishlist" element={<WishListScreen />} />
            <Route path="/signin" element={<SigninScreen />} />
            <Route path="/signup" element={<SignupScreen />} />
            <Route path="/shipping" element={<ShippingAddressScreen />} />
            <Route path="/placeorder" element={<PlaceOrderScreen />} />
            <Route
              path="/order/:id"
              element={
                <ProtectedRoute>
                  <OrderScreen />
                </ProtectedRoute>
              }
            />
            <Route
              path="/profile"
              element={
                <ProtectedRoute>
                  <ProfileScreen />
                </ProtectedRoute>
              }
            />
            <Route path="/search" element={<SearchScreen />} />
            <Route
              path="/orderhistory"
              element={
                <ProtectedRoute>
                  <OrderHistoryScreen />
                </ProtectedRoute>
              }
            />
            {/* Admin Side Dashboard */}
            <Route
              path="/admin/dashboard"
              element={
                <AdminRoute>
                  <DashboardScreen />
                </AdminRoute>
              }
            />
            <Route
              path="/admin/products"
              element={
                <AdminRoute>
                  <ProductListScreen />
                </AdminRoute>
              }
            ></Route>
          </Routes>
        </Container>
      </main>
    </div>
  );
}

export default App;
