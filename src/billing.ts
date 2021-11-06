import Stripe from 'stripe';
import handler from './util/handler';
import { calculateCost } from './util/cost';

export const main = handler(async (event) => {
  const { storage, source } = JSON.parse(event.body || 'missing_event_body');
  const amount = calculateCost(storage);
  const description = 'Scratch charge';

  // Load our secret key from the environment variables
  const stripe = new Stripe(
    process.env.STRIPE_SECRET_KEY || 'missing_stripe_env_variable',
    {
      apiVersion: '2020-08-27',
    }
  );

  await stripe.charges.create({
    source,
    amount,
    description,
    currency: 'usd',
  });

  return { status: true };
});
