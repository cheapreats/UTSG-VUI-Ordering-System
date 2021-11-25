import { useState, useEffect } from "react";
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
  const [clientSecret, setClientSecret] = useState("");

  // TODO: fetch this somehow
  const price: Price = {
    amount: 420,
    currency: "cad",
  };

  useEffect(() => {
    // Create PaymentIntent as soon as the page loads
    const price2 = {
      amount: 420,
      currency: "eur",
      "automatic_payment_methods[enabled]": true,
    };
    getCustomerSecret(price2).then((body) => {
      setClientSecret(body.client_secret);
    });
  }, []);

  const appearance = {
    theme: "stripe" as const,
    // Example
    variables: {
      // outerWidth: "500px",
      // fontFamily: "Sohne, system-ui, sans-serif",
      // fontWeightNormal: "500",
      // borderRadius: "8px",
      // colorBackground: "#0A2540",
      // colorPrimary: "#EFC078",
      // colorPrimaryText: "#1A1B25",
      // colorText: "white",
      // colorTextSecondary: "white",
      // colorTextPlaceholder: "#727F96",
      // colorIconTab: "white",
      // colorLogo: "dark",
    },
    rules: {
      ".Input, .Block": {
        // backgroundColor: "transparent",
        border: "1.5px solid var(--colorPrimary)",
      },
    },
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
      {clientSecret && (
        <Elements stripe={stripePromise} options={options}>
          <CheckoutForm />
        </Elements>
      )}
    </>
  );
};

export default Checkout;
