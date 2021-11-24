import {
  PaymentElement,
  // CardElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import React from "react";

export const CheckoutForm = (): React.ReactElement => {
  const stripe = useStripe();
  const elements = useElements();

  const handleSubmit: React.FormEventHandler = async (
    event: React.FormEvent<HTMLInputElement>
  ) => {
    event.preventDefault();

    console.log("Submitted!");

    if (!stripe || !elements) {
      return;
    }

    // const result = await stripe.confirmPayment({
    //   elements,
    //   confirmParams: {
    //     return_url: "",
    //   },
    // });

    // if (result.error) {
    //   console.log(result.error.message);
    // }
  };

  return (
    <form onSubmit={handleSubmit}>
      <PaymentElement />
      <button>Submit UwU</button>
    </form>
  );
};
