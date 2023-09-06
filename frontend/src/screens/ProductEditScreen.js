import axios from 'axios';
import React, { useContext, useEffect, useReducer, useState } from 'react';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import LoadingBox from '../components/Loading/Loading';
import MessageBox from '../components/Message/Message';
import { Store } from '../store';
import { getError } from '../utlis';

const reducer = (state, action) => {
  switch (action.type) {
    case 'FETCH_REQUEST':
      return { ...state, loading: true };
    case 'FETCH_SUCCESS':
      return { ...state, loading: false };
    case 'FETCH_FAIL':
      return { ...state, loading: false, error: action.payload };
    case 'UPDATE_REQUEST':
      return { ...state, loadingUpdate: true };
    case 'UPDATE_SUCCESS':
      return { ...state, loadingUpdate: false };
    case 'UPDATE_FAIL':
      return { ...state, loadingUpdate: false };
    default:
      return state;
  }
};

export default function ProductEditScreen() {
  const [{ loading, error, loadingUpdate }, dispatch] = useReducer(reducer, {
    loading: true,
    error: '',
  });

  const { state } = useContext(Store);
  const { userInfo } = state;

  const params = useParams();
  const { id: Id } = params;
  const navigate = useNavigate();

  const [title, setTitle] = useState('');
  const [price, setPrice] = useState(0);
  const [imageFile, setImageFile] = useState('');
  const [countInStock, setCountInStock] = useState(0);
  const [auther, setAuther] = useState('');
  const [genre, setGenre] = useState('');
  const [description, setDescription] = useState('');
  const onChangeFile = (e) => {
    setImageFile(e.target.files[0]);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        dispatch({ type: 'FETCH_REQUEST' });
        const { data } = await axios.get(`/api/products/${Id}`, {
          headers: { Authorization: userInfo.token },
        });
        setTitle(data.title);
        setPrice(data.price);
        setImageFile(data.image);
        setCountInStock(data.countInStock);

        setAuther(data.auther);
        setGenre(data.genre);
        setDescription(data.description);

        dispatch({ type: 'FETCH_SUCCESS' });
      } catch (err) {
        dispatch({
          type: 'FETCH_FAIL',
          payload: getError(err),
        });
      }
    };
    fetchData();
  }, [Id, userInfo]);

  const submitHandler = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append('_id', Id);
    formData.append('title', title);
    formData.append('price', price);
    formData.append('auther', auther);
    formData.append('genre', genre);
    formData.append('description', description);
    formData.append('countInStock', countInStock);
    formData.append('ProductImage', imageFile);

    try {
      dispatch({ type: 'UPDATE_REQUEST' });
      await axios.put(`/api/products/${Id}`, formData, {
        headers: { Authorization: userInfo.token },
      });
      dispatch({ type: 'UPDATE_SUCCESS' });
      toast.success('Product updated successfully');
      navigate('/admin/products');
    } catch (error) {
      console.log(error.response.config.data);
      toast.error(getError(error));
      dispatch({ type: 'UPDATE_FAIL' });
    }
  };

  return (
    <Container className="small-container">
      <h1>Edit Product {Id}</h1>

      {loading ? (
        <LoadingBox></LoadingBox>
      ) : error ? (
        <MessageBox variant="danger">{error}</MessageBox>
      ) : (
        <Form onSubmit={submitHandler}>
          <Form.Group className="mb-3" controlId="name">
            <Form.Label>Title</Form.Label>
            <Form.Control
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </Form.Group>
          <Form.Group className="mb-3" controlId="name">
            <Form.Label>Auther</Form.Label>
            <Form.Control
              value={auther}
              onChange={(e) => setAuther(e.target.value)}
              required
            />
          </Form.Group>
          <Form.Group className="mb-3" controlId="name">
            <Form.Label>Genre</Form.Label>
            <Form.Control
              value={genre}
              onChange={(e) => setGenre(e.target.value)}
              required
            />
          </Form.Group>
          <Form.Group className="mb-3" controlId="name">
            <Form.Label>Description</Form.Label>
            <Form.Control
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
            />
          </Form.Group>

          <Form.Group className="mb-3" controlId="email">
            <Form.Label>Count In Stock</Form.Label>
            <Form.Control
              value={countInStock}
              type="number"
              onChange={(e) => setCountInStock(e.target.value)}
              required
            />
          </Form.Group>
          <Form.Group className="mb-3" controlId="email">
            <Form.Label>Price</Form.Label>
            <Form.Control
              value={price}
              type="number"
              onChange={(e) => setPrice(e.target.value)}
              required
            />
          </Form.Group>
          <Form.Group className="mb-3" controlId="image">
            <Form.Label>Image File</Form.Label>
            <Form.Control
              value={imageFile}
              onChange={(e) => setImageFile(e.target.value)}
              required
            />
          </Form.Group>
          <Form.Group className="mb-3" controlId="imageFile">
            <Form.Label>Upload Image</Form.Label>
            <Form.Control type="file" onChange={onChangeFile} />
            
          </Form.Group>

          <div className="mb-3">
            <Button disabled={loadingUpdate} type="submit">
              Update
            </Button>
            {loadingUpdate && <LoadingBox></LoadingBox>}
          </div>
        </Form>
      )}
    </Container>
  );
}
