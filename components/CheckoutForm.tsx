import React, { useState } from "react";
import {
  PaymentElement,
  // CardElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";

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
    <form onSubmit={handleSubmit}>
      <PaymentElement />
      <button disabled={!stripe}>Submit UwU</button>
      {errMsg && <div>{errMsg}</div>}
    </form>
  );
};
