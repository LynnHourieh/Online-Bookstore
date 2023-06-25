import React, { useEffect, useReducer, useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import { getError } from '../utlis';

import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import LoadingBox from '../components/Loading/Loading';
import MessageBox from '../components/Message/Message';
import Button from 'react-bootstrap/Button';
import Product from '../components/Products/Product';
import LinkContainer from 'react-router-bootstrap/LinkContainer';

const reducer = (state, action) => {
  switch (action.type) {
    case 'FETCH_REQUEST':
      return { ...state, loading: true };
    case 'FETCH_SUCCESS':
      return {
        ...state,
        products: action.payload.products,
        loading: false,
      };
    case 'FETCH_FAIL':
      return { ...state, loading: false, error: action.payload };

    default:
      return state;
  }
};


export default function SearchScreen() {

  const { search } = useLocation();
  const sp = new URLSearchParams(search); // /search?query=roamnce

  const query = sp.get('query') || '';
  const [{ loading, error, products }, dispatch] =
    useReducer(reducer, {
      loading: true,
      error: '',
    });
 useEffect(() => {
   const fetchData = async () => {
     try {
       const { data } = await axios.get(
         `/api/products/search?&query=${query}`
       );
       dispatch({ type: "FETCH_SUCCESS", payload: data });
     } catch (err) {
       dispatch({
         type: "FETCH_FAIL",
         payload: getError(error),
       });
     }
   };
   fetchData();
 }, [error, query]);

 
console.log(products)

  return (
    <div>
  
      <Row>
       
        <Col md={9}>
          {loading ? (
            <LoadingBox></LoadingBox>
          ) : error ? (
            <MessageBox variant="danger">{error}</MessageBox>
          ) : (
            <>
              
              {products.length === 0 && (
                <MessageBox>No Product Found</MessageBox>
              )}

              <Row>
                {products.map((product) => (
                  <Col sm={6} lg={4} className="mb-3" key={product._id}>
                    <Product product={product}></Product>
                  </Col>
                ))}
              </Row>

            
            </>
          )}
        </Col>
      </Row>
    </div>
  );
}
