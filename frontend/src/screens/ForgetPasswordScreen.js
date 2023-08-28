import axios from 'axios';
import { useContext, useEffect, useState } from 'react';
import Container from 'react-bootstrap/Container';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { Store } from '../store';
import { getError } from '../utlis';

export default function ForgetPasswordScreen() {
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [enteredCode, setCode] = useState('');
  const [showCode, setShowCode] = useState(false);
  const { state } = useContext(Store);
  const { userInfo } = state;

  useEffect(() => {
    if (userInfo) {
      navigate('/');
    }
  }, [navigate, userInfo]);

  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.post('/api/users/forget-password', {
        email,
      });
      toast.success(data.message);
    } catch (err) {
      toast.error(getError(err));
    }
  };
  const submitHandlerByPhoneNumber = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.post('/api/users/request-code', {
        phoneNumber,
      });
      toast.success('Check your phone');
      setShowCode(!showCode);
    } catch (err) {
      toast.error(getError(err));
    }
  };
  console.log(phoneNumber)
  const submitHandlerByCode = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.post('/api/users/reset-password-code', {
        phoneNumber,
        enteredCode,
        newPassword,
      });
      toast.success('Password is successfully changed');
      navigate("/signin")
    } catch (err) {
      toast.error(getError(err));
    }
  };

  return (
    <Container className="small-container">
      <h1
        className="my-3"
        style={{
          alignItems: 'center',
          display: 'flex',
          justifyContent: 'center',
          height: 50,
        }}
      >
        Forget Password
      </h1>
      <Row>
        <Col md={8}>
          <h2 className="my-3">Using Email</h2>
          <Form onSubmit={submitHandler}>
            <Form.Group className="mb-3" controlId="email">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                required
                onChange={(e) => setEmail(e.target.value)}
                style={{ width: '70%' }}
              />
            </Form.Group>

            <div className="mb-3">
              <Button type="submit">submit</Button>
            </div>
          </Form>
        </Col>
        <Col md={4}>
          <h2 className="my-3">By Phone Number</h2>
          <Row>
            {' '}
            <Form onSubmit={submitHandlerByPhoneNumber}>
              <Form.Group className="mb-3" controlId="email">
                <Form.Label>Phone Number</Form.Label>
                <Form.Control
                  type="text"
                  style={{ width: '70%' }}
                  required
                  onChange={(e) => setPhoneNumber(e.target.value)}
                />
              </Form.Group>

              <div className="mb-3">
                <Button type="submit">submit</Button>
              </div>
            </Form>
          </Row>
          {showCode ? (
            <Row>
              <Form onSubmit={submitHandlerByCode}>
                <Form.Group className="mb-3" controlId="email">
                  <Form.Label>Code</Form.Label>
                  <Form.Control
                    type="text"
                    style={{ width: '70%' }}
                    required
                    onChange={(e) => setCode(e.target.value)}
                  />{' '}
                  <Form.Label>Password</Form.Label>
                  <Form.Control
                    type="text"
                    style={{ width: '70%' }}
                    required
                    onChange={(e) => setNewPassword(e.target.value)}
                  />
                </Form.Group>

                <div className="mb-3">
                  <Button type="submit">submit</Button>
                </div>
              </Form>
            </Row>
          ) : (
            ' '
          )}
        </Col>
      </Row>
    </Container>
  );
}
