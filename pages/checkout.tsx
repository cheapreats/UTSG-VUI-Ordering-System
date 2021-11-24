import Link from "next/link";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { CheckoutForm } from "../components/CheckoutForm";

declare var process: {
  env: {
    NEXT_PUBLIC_STRIPE_PK: string;
    NEXT_PUBLIC_STRIPE_CS: string;
  };
};

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PK);

export const Checkout = (): React.ReactElement => {
  // curl to get paymentIntent
  // const paymentIntent;

  const options = {
    clientSecret: process.env.NEXT_PUBLIC_STRIPE_CS,
  };

  return (
    <>
      <button>
        <Link href="/">Back to home</Link>
      </button>
      <Elements stripe={stripePromise} options={options}>
        <CheckoutForm />
      </Elements>
    </>
  );
};

export default Checkout;
