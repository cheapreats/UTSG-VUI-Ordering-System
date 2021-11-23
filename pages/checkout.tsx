import Link from "next/link";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { CheckoutForm } from "../components/CheckoutForm";

declare var process: {
  env: {
    REACT_APP_STRIPE_PK: string;
    REACT_APP_STRIPE_CS: string;
  };
};

const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_PK);

export const Checkout = (): React.ReactElement => {
  // curl to get paymentIntent
  // const paymentIntent;

  const options = {
    clientSecret: process.env.REACT_APP_STRIPE_CS,
  };

  return (
    <>
      <Link href="/">Back to home</Link>
      <Elements stripe={stripePromise} options={options}>
        <CheckoutForm />
      </Elements>
    </>
  );
};
