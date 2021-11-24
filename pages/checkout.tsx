import Link from "next/link";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { CheckoutForm } from "../components/CheckoutForm";
import { Price, getCustomerSecret } from "../functions/checkout";

declare var process: {
  env: {
    NEXT_PUBLIC_STRIPE_PK: string;
    NEXT_PUBLIC_STRIPE_SK: string;
  };
};

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PK);

export const Checkout: React.VFC = () => {
  const price: Price = {
    amount: 420,
    currency: "cad",
  };

  const cs = getCustomerSecret(price).then((res) => {
    return res.data.client_secret;
  });

  console.log("cs:", cs);

  const options = {
    clientSecret: cs,
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
