import Stripe from 'stripe';
import express from 'express';
import dotenv from 'dotenv'; // To manage environment variables

dotenv.config(); // Load environment variables from .env file

const app = express();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;

app.use(express.json()); // Parse JSON bodies

app.post('/webhook', express.raw({ type: 'application/json' }), async (request, response) => {
  const sig = request.headers['stripe-signature'];
  let event;

  try {
    event = stripe.webhooks.constructEvent(request.body, sig, endpointSecret);
  } catch (err) {
    console.error('Webhook signature verification failed:', err.message);
    return response.status(400).send(`Webhook Error: ${err.message}`);
  }

  // Handle successful payment
  if (event.type === 'checkout.session.completed') {
    const session = event.data.object;

    // Extract metadata
    const userId = session.metadata.userId;
    const lineItems = session.line_items;

    // Loop through each item to enroll the user in corresponding courses
    for (const item of lineItems.data) {
      const courseId = item.metadata.courseId;

      // Call the function to enroll the user in the course
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



// import Stripe from 'stripe';
// import express from 'express';
// const app = express();


// // This is your Stripe CLI webhook secret for testing your endpoint locally.
// const endpointSecret = "whsec_33ae706467f90cf174362f72279bd9390d6985b79563baafd845100157491711";
// const stripe = new Stripe("sk_test_51MiCn5SCTwSZDv2RR3oDVEXTMMCoBlPVw38fMQnU8t1yytD2kA8UkD5sXgYOot40xweJJ4gpvZcmk1KfdppRoEF20068llVjAn"); 
// app.post('/webhook', express.raw({type: 'application/json'}), async (request, response) => {
//     const sig = request.headers['stripe-signature'];
//     let event;
  
//     try {
//       event = stripe.webhooks.constructEvent(request.body, sig, endpointSecret);
//     } catch (err) {
//       response.status(400).send(`Webhook Error: ${err.message}`);
//       return;
//     }
  
//     // Handle successful payment
//     if (event.type === 'checkout.session.completed') {
//       const session = event.data.object;
  
//       // Extract metadata
//       const userId = session.metadata.userId;
//       const lineItems = session.line_items;
  
//       // Loop through each item to enroll the user in corresponding courses
//       for (const item of lineItems.data) {
//         const courseId = item.metadata.courseId;
  
//         // Call the function to enroll the user in the course
//         try {
//           await enrollUserInCourse(userId, courseId);
//           console.log(`User ${userId} enrolled in course ${courseId}`);
//         } catch (err) {
//           console.error('Error enrolling user in course:', err);
//         }
//       }
//     }
  
//     response.status(200).send();
//   });
  


// app.listen(4242, () => console.log('Running on port 4242'));

// export default app;
