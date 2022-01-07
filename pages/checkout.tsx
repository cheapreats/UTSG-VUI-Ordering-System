import { useState, useEffect } from "react";
import Link from "next/link";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { CheckoutForm } from "../components/CheckoutForm";
import { OrderSummary } from "../components/OrderSummary";
import { getCustomerSecret, getCartById } from "../functions/checkout";
import { useRouter } from "next/router";
import { Cart } from "../components/interfaces";
import { AuthorizationController } from "@cheapreats/ts-sdk/dist/app/controllers/AuthorizationController";
import styled from "styled-components";
import { Card } from "@cheapreats/react-ui";
import Snowfall from "react-snowfall";

declare var process: {
  env: {
    NEXT_PUBLIC_STRIPE_PK: string;
    NEXT_PUBLIC_STRIPE_SK: string;
  };
};

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PK);

export const Checkout: React.VFC = () => {
  const [clientSecret, setClientSecret] = useState<string>("");
  const [cart, setCart] = useState<Cart>();

  const router = useRouter();

  useEffect(() => {
    const { id } = router.query;
    const idStr: string = id as string;

    // Create PaymentIntent as soon as the page loads

    if (!!idStr) {
      getCartById(idStr).then((body) => {
        setCart(body?.data.cart);
      });
    }
  }, [router.query]);

  useEffect(() => {
    const CURRENCY = {
      currency: "cad",
      "automatic_payment_methods[enabled]": true,
    };

    // get the customer secret from the PaymentIntent
    getCustomerSecret(cart?.subtotal, CURRENCY).then((body) => {
      setClientSecret(body?.client_secret);
    });
  }, [cart]);

  const appearance = {
    theme: "stripe" as const,
  };

  const options = {
    clientSecret,
    appearance,
  };

  return (
    <div
      style={{
        backgroundColor: "#ff6666",
        width: "100%",
        height: "100%",
        position: "absolute",
      }}
    >
      <Snowfall color="white" />
      <StyledCard animated>
        {!!cart && <OrderSummary key={cart._id} cart={cart} />}
        <Header>Payment</Header>
        {clientSecret && (
          <Elements stripe={stripePromise} options={options}>
            {!!cart && <CheckoutForm orderId={cart._id} />}
          </Elements>
        )}
      </StyledCard>
    </div>
  );
};

export default Checkout;

const StyledCard = styled(Card)`
  width: 50%;
  text-align: center;
  margin-top: 3em;
  margin-left: auto;
  margin-right: auto;
  position: relative;
`;

const Header = styled.div`
  font-size: 20px;
`;
