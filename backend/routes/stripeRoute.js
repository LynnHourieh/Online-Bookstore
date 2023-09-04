import express from 'express';
import stripe from 'stripe';
import dotenv from 'dotenv';
dotenv.config();

const stripeSecretKey = process.env.STRIPE_PRIVATE_KEY;
const stripes = stripe(stripeSecretKey);

const stripeRouter = express.Router();

stripeRouter.post('/create-checkout-session', async (req, res) => {
  try {
    const cartItems = req.body.cartItems; // Assuming cartItems is passed in the request body

    const session = await stripes.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'payment',
      line_items: cartItems.map((item) => {
        // Assuming you have a storeItem object based on item.id
        const storeItem = item; // You need to define storeItem based on your data source
        return {
          price_data: {
            currency: 'usd',
            product_data: {
              name: storeItem.title,
            },
            unit_amount: storeItem.price,
          },
          quantity: item.quantity,
        };
      }),
      success_url: `${process.env.BASE_URL}/placeorder`,
      cancel_url: `${process.env.BASE_URL}/payment`,
    });

    res.json({ url: session.url });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

export default stripeRouter;
