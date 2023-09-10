import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Store } from '../store';
import { useContext, useState } from 'react';
import CheckoutSteps from '../components/Checkout/CheckoutSteps';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/esm/Button';

//to test it use cart 42424242424242424
function PaymentScreen() {
  const navigate = useNavigate();
  const { state, dispatch: ctxDispatch } = useContext(Store);
  const {
    userInfo,
    cart: { shippingAddress, cartItems, paymentMethod },
  } = state;
  const [paymentMethodName, setPaymentMethod] = useState('');
  //console.log(paymentMethod);
  //console.log(cartItems)
  const paymentFunctionUsingStripe = () => {
    fetch('/api/stripe/create-checkout-session', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: userInfo.token,
      },
      body: JSON.stringify({
        cartItems,
      }),
    })
      .then((res) => {
        ctxDispatch({
          type: 'SAVE_PAYMENT_METHOD',
          payload: paymentMethodName,
        });
        localStorage.setItem('paymentMethod', paymentMethodName);
        if (res.ok) return res.json();
        return res.json().then((json) => Promise.reject(json));
      })
      .then(({ url }) => {
        window.location = url;
      })
      .catch((e) => {
        console.error(e.error);
      });
  };

  const submitHandler = () => {
    if (paymentMethodName == 'Stripe') {
      paymentFunctionUsingStripe();
    } else if (paymentMethodName == 'CashOnDelivery') {
      setPaymentMethod('CashOnDelivery');
        ctxDispatch({
          type: 'SAVE_PAYMENT_METHOD',
          payload: paymentMethodName,
        });
        localStorage.setItem('paymentMethod', paymentMethodName);
        navigate('/placeorder');

    } else {
      console.log('error');
    }
  };
  return (
    <div>
      <CheckoutSteps step1 step2 step3></CheckoutSteps>
      <div className="container small-container">
        <h1 className="my-3">Payment Method</h1>
        <Form>
          <div className="mb-3">
            <Form.Check
              type="radio"
              id="CashOnDelivery"
              label="CashOnDelivery"
              value="CashOnDelivery"
              checked={paymentMethodName === 'CashOnDelivery'}
              onChange={(e) => setPaymentMethod(e.target.value)}
            />
          </div>
          <div className="mb-3">
            <Form.Check
              type="radio"
              id="Stripe"
              label="Stripe"
              value="Stripe"
              checked={paymentMethodName === 'Stripe'}
              onChange={(e) => setPaymentMethod(e.target.value)}
            />
          </div>
        </Form>
        <div className="mb-3">
          <Button type="submit" onClick={submitHandler}>
            Continue
          </Button>
        </div>
      </div>
    </div>
  );
}

export default PaymentScreen;
