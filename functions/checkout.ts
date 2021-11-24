import qs from "qs";
import axios from "axios";

interface Price {
  amount: number;
  currency: string;
}

export const getCustomerSecret = async (price: Price) => {
  const url = "https://api.stripe.com/v1/payment_intents";
  const headers = {
    "Content-Type": "application/x-www-form-urlencoded",
    Authorization: `Bearer ${process.env.NEXT_PUBLIC_STRIPE_SK}`,
  };

  const formattedParam = qs.stringify(price, { arrayFormat: "repeat" });

  const response = await axios.post<any>(url, formattedParam, {
    headers: headers,
  });
  console.log(response);
  return response;
};
