import React, { useState } from "react";
import {
  PaymentElement,
  // CardElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import { Button } from "@cheapreats/react-ui";
import styled from "styled-components";

interface CheckoutFormProps {
  orderId: string;
}

declare var process: {
  env: {
    BASE_URL: string;
  };
};

export const CheckoutForm: React.VFC<CheckoutFormProps> = ({
  orderId,
  ...props
}) => {
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

    const successURL = process.env.BASE_URL + "/checkout?id=".concat(orderId);

    const result = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: successURL,
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
  };

  return (
    <Form onSubmit={handleSubmit}>
      <PaymentElement />
      <StyledButton primary {...buttonProps} disabled={!stripe}>
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
