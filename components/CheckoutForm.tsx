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
      },
    });

    if (result.error) {
      setErrMsg(result.error.message);
      console.log(result.error.message);
    }
  };

  return (
    <Form onSubmit={handleSubmit}>
      <PaymentElement />
      <Button disabled={!stripe}>Submit UwU</Button>
      {errMsg && <div>{errMsg}</div>}
    </Form>
  );
};

const Form = styled.form`
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
`;

const Button = styled.button`
  position: relative;
  margin-top: 20px;
  padding 5px;
;`
