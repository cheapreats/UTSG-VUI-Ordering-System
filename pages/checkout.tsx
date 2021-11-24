import Link from "next/link";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { CheckoutForm } from "../components/CheckoutForm";
import axios from "axios";

declare var process: {
  env: {
    NEXT_PUBLIC_STRIPE_PK: string;
    NEXT_PUBLIC_STRIPE_CS: string;
    NEXT_PUBLIC_STRIPE_SK: string;
  };
};

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PK);

export const Checkout = (): React.ReactElement => {
  // const config = {
  //   auth: {
  //     username: process.env.NEXT_PUBLIC_STRIPE_SK,
  //     password: ""
  //   }
  // }

  const data = {
      // 'amount': 1009,
      'currency': 'usd'
  }

  const url = 'https://api.stripe.com/v1/payment_intents';

  const sk = process.env.NEXT_PUBLIC_STRIPE_SK

  const header = {
    'Content-Type': 'application/x-www-form-urlencoded',
    'Authorization': 'Bearer sk_test_4eC39HqLyjWDarjtT1zdp7dc'
  }

  const config = {
    // withCredentials: true,
    headers: {
      Authorization: `Bearer: ${sk}`
    }
  };

  // axios(config).then(function (response) {
  //   console.log(response);
  // })

  axios.post(url, "amount=100&currency=usd", {
    headers: header,
  }).then(function (response) {
    console.log(response);
  })
  
  // const r = axios.post('https://api.stripe.com/v1/payment_intents', data, config)
  //   .then(function (response) {
  //     console.log(response);
  //   });

  const options = {
    clientSecret: process.env.NEXT_PUBLIC_STRIPE_CS,
  };

  return (
    <>
      <Link href="/">Back to home</Link>
      <Elements stripe={stripePromise} options={options}>
        <CheckoutForm />
      </Elements>
    </>
  );
};

export default Checkout;