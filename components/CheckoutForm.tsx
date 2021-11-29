import React, { useState } from "react";
import {
  PaymentElement,
  // CardElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import styled from "styled-components";

export const CheckoutForm = (): React.ReactElement => {
  const stripe = useStripe();
  const elements = useElements();

  const [errMsg, setErrMsg] = useState<string | undefined>();

  const handleSubmit: React.FormEventHandler = async (
    event: React.FormEvent<HTMLInputElement>
  ) => {
    event.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    const result = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: "http://localhost:8082/test",
        // shipping: {Shipping Object}
      },
    });

    if (result.error) {
      setErrMsg(result.error.message);
    }

    // TODO:call back to CheaprEats
  };

  return (
    <Form onSubmit={handleSubmit}>
      <PaymentElement />
      <Button disabled={!stripe}>Submit</Button>
      {errMsg && <div>{errMsg}</div>}
    </Form>
  );
};

const Form = styled.form`
  width: 500px;
  margin-left: auto;
  margin-right: auto;
`;

const Button = styled.button`
  position: relative;
  margin-top: 20px;
  padding 5px;
;`;
