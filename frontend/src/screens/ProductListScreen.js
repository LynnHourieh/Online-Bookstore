import React, { useContext, useEffect, useReducer, useState } from 'react';
import axios from 'axios';
import { Store } from '../store';
import LoadingBox from '../components/Loading/Loading';
import MessageBox from '../components/Message/Message';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import { toast } from 'react-toastify';
import { getError } from '../utlis';
import ProductPopup from '../components/Products/ProductPopup';


const reducer = (state, action) => {
  const { type, payload } = action;
  switch (type) {
    case 'FETCH_REQUEST':
      return { ...state, loading: true };
    case 'FETCH_SUCCESS':
      return {
        ...state,
        updatedProduct: payload,
        allproducts: payload.countProducts,
        products: payload.products,
        page: payload.page,
        pages: payload.pages,
        loading: false,
      };
    case 'FETCH_FAIL':
      return { ...state, loading: false, error: payload };
    case 'CREATE_REQUEST':
      return { ...state, loadingCreate: true };
    case 'CREATE_SUCCESS':
      return {
        ...state,
        loadingCreate: false,
      };
    case 'CREATE_FAIL':
      return { ...state, loadingCreate: false };
    case 'DELETE_REQUEST':
      return { ...state, loadingDelete: true, successDelete: false };
    case 'DELETE_SUCCESS':
      return {
        ...state,
        loadingDelete: false,
        successDelete: true,
      };
    case 'DELETE_FAIL':
      return { ...state, loadingDelete: false };
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
    {
      loading,
      error,
      products,
      pages,
      loadingCreate,
      allproducts,
      loadingDelete,
    },
    dispatch,
  ] = useReducer(reducer, {
    loading: true,
    error: '',
  });

  const navigate = useNavigate();
  const { search } = useLocation();
  const sp = new URLSearchParams(search);
  const page = sp.get('page') || 1;

  const { state } = useContext(Store);
  const { userInfo } = state;
console.log(products)
  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data } = await axios.get(`/api/products/admin?page=${page} `, {
          headers: { Authorization: userInfo.token },
        });

        dispatch({ type: 'FETCH_SUCCESS', payload: data });
      } catch (err) {}
    };
    fetchData();
  }, [page, userInfo]);
  const handleSaveProduct = async (formData) => {
    if (window.confirm('Are you sure to create?')) {
      try {
        console.log('Sending product data:', formData);
        dispatch({ type: 'CREATE_REQUEST' });

        const { data } = await axios.post('/api/products', formData, {
          method: 'POST',
          headers: { Authorization: userInfo.token },
        });

        console.log('Product created:', data.product);
        toast.success('Product created successfully');
        dispatch({ type: 'CREATE_SUCCESS' });
        navigate(`/admin/product/${data.product._id}`);
      } catch (err) {
        console.error('Error creating product:', err);
        toast.error(getError(err));
        dispatch({ type: 'CREATE_FAIL' });
      }
    }
  };
 
  const deleteHandler = async (product) => {
    if (window.confirm('Are you sure to delete?')) {
      try {
        dispatch({ type: 'DELETE_REQUEST' });
        await axios.delete(`/api/products/${product._id}`, {
          headers: { Authorization: userInfo.token },
        });
        const updatedProduct = products.filter(
          (item) => item._id !== product._id
        );
        dispatch({ type: 'FETCH_SUCCESS', payload: updatedProduct });

        toast.success('product deleted successfully');
        dispatch({ type: 'DELETE_SUCCESS' });
      } catch (error) {
        toast.error(getError(error));
        dispatch({
          type: 'DELETE_FAIL',
        });
      }
    }
  };

  return (
    <div>
      <Row>
        <Col>
          <h3>Products </h3>
        </Col>
        <Col>
          <h3>Total Products:{allproducts}</h3>
        </Col>
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

      {loadingCreate && loadingDelete && <LoadingBox></LoadingBox>}
      {loading ? (
        <LoadingBox></LoadingBox>
      ) : error ? (
        <MessageBox variant="danger">{error}</MessageBox>
      ) : (
        <>
          <table className="table" style={{ marginTop: 40 }}>
            <thead>
              <tr>
                <th>ID</th>
                <th>NAME</th>
                <th>AUTHOR</th> <th>GENRE</th>
                <th>PRICE</th>
                <th>COUNT</th>
                <th>IMAGE</th>
                <th></th>
                <th></th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {products?.map((product) => (
                <tr key={product._id}>
                  <td>{product._id}</td>
                  <td>{product.title}</td>
                  <td>{product.auther}</td> <td>{product.genre}</td>
                  <td>{product.price / 1000}$</td>
                  <td>{product.countInStock}</td>
                  <td>
                    <img
                      style={{ height: 90, width: 90 }}

                      src={`/images/${product.images[0].url}`}
                    
                    />  {console.log(product.images[0].url)}
                  </td>
                  <td>
                    <Button
                      type="button"
                      variant="light"
                      onClick={() => {
                        navigate(`/product/${product._id}`);
                      }}
                    >
                      Details
                    </Button>{' '}
                  </td>
                  <td>
                    <Button
                      type="button"
                      variant="light"
                      onClick={() => {
                        navigate(`/admin/product/${product._id}`);
                      }}
                    >
                      Edit
                    </Button>{' '}
                  </td>
                  <td>
                    <Button
                      type="button"
                      variant="light"
                      onClick={() => deleteHandler(product)}
                    >
                      Delete
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div>
            {[...Array(pages).keys()].map((x) => (
              <Link
                className={x + 1 === Number(page) ? 'btn text-bold ' : 'btn'}
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
