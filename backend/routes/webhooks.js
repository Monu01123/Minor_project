import Stripe from 'stripe';
import express from 'express';
import dotenv from 'dotenv'; 
dotenv.config(); 

const app = express();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;

app.use(express.json()); 

app.post('/webhook', express.raw({ type: 'application/json' }), async (request, response) => {
  const sig = request.headers['stripe-signature'];
  let event;

  try {
    event = stripe.webhooks.constructEvent(request.body, sig, endpointSecret);
  } catch (err) {
    console.error('Webhook signature verification failed:', err.message);
    return response.status(400).send(`Webhook Error: ${err.message}`);
  }

 
  if (event.type === 'checkout.session.completed') {
    const session = event.data.object;

    
    const userId = session.metadata.userId;
    const lineItems = session.line_items;

    
    for (const item of lineItems.data) {
      const courseId = item.metadata.courseId;

      
      try {
        await enrollUserInCourse(userId, courseId);
        console.log(`User ${userId} enrolled in course ${courseId}`);
      } catch (err) {
        console.error(`Error enrolling user ${userId} in course ${courseId}:`, err);
      }
    }
  }

  response.status(200).send();
});

app.listen(4242, () => console.log('Running on port 4242'));

export default app;
