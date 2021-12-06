import React, { useState } from "react";
import {
  PaymentElement,
  // CardElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import { Button } from "@cheapreats/react-ui";
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
        return_url: "http://localhost:8080/success",
        // shipping: {Shipping Object}
      },
    });

    if (result.error) {
      setErrMsg(result.error.message);
    }

    // TODO:call back to CheaprEats
  };

  const buttonProps = {
    full: true,
    color: "red",
  };

  return (
    <Form onSubmit={handleSubmit}>
      <PaymentElement />
      <StyledButton {...buttonProps} disabled={!stripe}>
        Pay
      </StyledButton>
      {errMsg && <div>{errMsg}</div>}
    </Form>
  );
};

const Form = styled.form`
  width: 500px;
  margin-left: auto;
  margin-right: auto;
`;

const StyledButton = styled(Button)`
  margin-top: 1em;
`;
