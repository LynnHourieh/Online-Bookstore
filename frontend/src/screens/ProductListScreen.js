import React, { useContext, useEffect, useReducer, useState } from "react";
import axios from "axios";
import { Store } from "../store";
import LoadingBox from "../components/Loading/Loading";
import MessageBox from "../components/Message/Message";
import { Link, useLocation, useNavigate } from "react-router-dom";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Button from "react-bootstrap/Button";
import { toast } from "react-toastify";
import { getError } from "../utlis";
import ProductPopup from "../components/Products/ProductPopup";

const reducer = (state, action) => {
  const { type, payload } = action;
  switch (type) {
    case "FETCH_REQUEST":
      return { ...state, loading: true };
    case "FETCH_SUCCESS":
      return {
        ...state,
        allproducts:payload.countProducts,
        products: payload.products,
        page: payload.page,
        pages: payload.pages,
        loading: false,
      };
    case "FETCH_FAIL":
      return { ...state, loading: false, error: payload };
    case "CREATE_REQUEST":
      return { ...state, loadingCreate: true };
    case "CREATE_SUCCESS":
      return {
        ...state,
        loadingCreate: false,
      };
    case "CREATE_FAIL":
      return { ...state, loadingCreate: false };

    default:
      return state;
  }
};

export default function ProductListScreen() {
  const [isPopupOpen, setIsPopupOpen] = useState(false);

  const openPopup = () => {
    setIsPopupOpen(true);
  };

  const closePopup = () => {
    setIsPopupOpen(false);
  };

  const [
    { loading, error, products, pages, loadingCreate, allproducts },
    dispatch,
  ] = useReducer(reducer, {
    loading: true,
    error: "",
  });

  const navigate = useNavigate();
  const { search } = useLocation();
  const sp = new URLSearchParams(search);
  const page = sp.get("page") || 1;

  const { state } = useContext(Store);
  const { userInfo } = state;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data } = await axios.get(`/api/products/admin?page=${page} `, {
          headers: { Authorization: userInfo.token },
        });

        dispatch({ type: "FETCH_SUCCESS", payload: data });
      } catch (err) {}
    };
    fetchData();
  }, [page, userInfo]);
  const handleSaveProduct = async (formData) => {
    if (window.confirm("Are you sure to create?")) {
      try {
        console.log("Sending product data:", formData); 
        dispatch({ type: "CREATE_REQUEST" });

        const { data } = await axios.post("/api/products", formData, {
          method: "POST",
          headers: { Authorization: userInfo.token },
        });

        console.log("Product created:", data.product); 
        toast.success("Product created successfully");
        dispatch({ type: "CREATE_SUCCESS" });
        navigate(`/admin/product/${data.product._id}`);
      } catch (err) {
        console.error("Error creating product:", err);
        toast.error(getError(err));
        dispatch({ type: "CREATE_FAIL" });
      }
    }
  };


  return (
    <div>
      <Row>
        <Col>
          <h3>Products </h3>
        </Col>
        <Col><h3>Total Products:{allproducts}</h3></Col>
        <Col className="col text-end">
          <div>
            <Button type="button" onClick={openPopup}>
              Create Product
            </Button>
            <ProductPopup
              isOpen={isPopupOpen}
              onClose={closePopup}
              onSave={handleSaveProduct}
            />
          </div>
        </Col>
        
      </Row>

      {loadingCreate && <LoadingBox></LoadingBox>}
      {loading ? (
        <LoadingBox></LoadingBox>
      ) : error ? (
        <MessageBox variant="danger">{error}</MessageBox>
      ) : (
        <>
          <table className="table" style={{marginTop:40}}>
            <thead>
              <tr>
                <th>ID</th>
                <th>NAME</th>
                <th>AUTHOR</th>
                <th>PRICE</th>
                <th>COUNT IN STUCK</th>
                <th>IMAGE</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => (
                <tr key={product._id}>
                  <td>{product._id}</td>
                  <td>{product.title}</td>
                  <td>{product.auther}</td>
                  <td>{product.price}$</td>
                  <td>{product.countInStock}</td>
                  <td><img style={{height:90}} src={`/images/${product.image}`}/></td>
                </tr>
              ))}
            </tbody>
          </table>
          <div>
            {[...Array(pages).keys()].map((x) => (
              <Link
                className={x + 1 === Number(page) ? "btn text-bold " : "btn"}
                key={x + 1}
                to={`/admin/products?page=${x + 1}`}
              >
                <u>{x + 1}</u>
              </Link>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
