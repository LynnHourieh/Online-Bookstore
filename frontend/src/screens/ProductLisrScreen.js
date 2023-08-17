import React, { useContext, useEffect, useReducer } from 'react';
import axios from 'axios';
import { Link, useLocation } from 'react-router-dom';
import { Store } from "../store";
import LoadingBox from '../components/Loading/Loading';
import MessageBox from '../components/Message/Message';

const reducer = (state, action) => {
    const{type,payload}=action
  switch (type) {
    case 'FETCH_REQUEST':
      return { ...state, loading: true };
    case 'FETCH_SUCCESS':
      return {
        ...state,
        products: payload.products,
        page: payload.page,
        pages: payload.pages,
        loading: false,
      };
    case 'FETCH_FAIL':
      return { ...state, loading: false, error: payload };

    default:
      return state;
  }
};

export default function ProductListScreen() {
  const [{ loading, error, products, pages }, dispatch] = useReducer(reducer, {
    loading: true,
    error: "",
  });

  const { search, pathname } = useLocation();
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

  return (
    <div>
      <h1>Products</h1>
      {loading ? (
        <LoadingBox></LoadingBox>
      ) : error ? (
        <MessageBox variant="danger">{error}</MessageBox>
      ) : (
        <>
          <table className="table">
            <thead>
              <tr>
                <th>ID</th>
                <th>NAME</th>
                <th>Auther</th>
                <th>PRICE</th>
                <th>COUNT IN STUCK</th>
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
              ><u>{x + 1}</u>
                
              </Link>
            ))}
          </div>
        </>
      )}
    </div>
  );
}