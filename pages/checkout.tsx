import { useState, useEffect } from "react";
import Link from "next/link";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { CheckoutForm } from "../components/CheckoutForm";
import { OrderSummary } from "../components/OrderSummary";
import { getCustomerSecret, getCartById } from "../functions/checkout";
import { useRouter } from "next/router";

declare var process: {
  env: {
    NEXT_PUBLIC_STRIPE_PK: string;
    NEXT_PUBLIC_STRIPE_SK: string;
  };
};

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PK);

export const Checkout: React.VFC = () => {
  const [clientSecret, setClientSecret] = useState("");
  const [cart, setCart] = useState();

  // Call getCartId here
  const router = useRouter();

  useEffect(() => {
    // TODO: fix typescript
    const { id }: string = router.query;
    console.log("id:", id);

    // Create PaymentIntent as soon as the page loads
    getCartById(id).then((body) => {
      setCart(body);
    });

    const price = {
      amount: 420,
      currency: "eur",
      "automatic_payment_methods[enabled]": true,
    };

    // get the customer secret from the PaymentIntent
    getCustomerSecret(price).then((body) => {
      setClientSecret(body.client_secret);
    });
  }, [router.query]);

  const appearance = {
    theme: "stripe" as const,
  };

  const options = {
    clientSecret,
    appearance,
  };

  return (
    <>
      <button>
        <Link href="/">Back to home</Link>
      </button>
      <OrderSummary cart={cart} />
      {clientSecret && (
        <Elements stripe={stripePromise} options={options}>
          <CheckoutForm />
        </Elements>
      )}
    </>
  );
};

export default Checkout;
