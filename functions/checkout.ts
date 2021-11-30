import qs from "qs";
import axios from "axios";
import { Price } from "../components/interfaces"

export const getCustomerSecret = async (amount: number | undefined, price: Price ): Promise<any> => {
  if (!amount) {
    return
  }

  const url = "https://api.stripe.com/v1/payment_intents";
  const headers = {
    "Content-Type": "application/x-www-form-urlencoded",
    Authorization: `Bearer ${process.env.NEXT_PUBLIC_STRIPE_SK}`,
  };

  const concatParam = {
    amount: amount * 100,
    currency: price.currency,
    "automatic_payment_methods[enabled]": price["automatic_payment_methods[enabled]"],
  }

  const formattedParam = qs.stringify(concatParam, { arrayFormat: "repeat" });

  try {
    const response = await axios.post<any>(url, formattedParam, {
      headers: headers,
    });
    return response.data;
  } catch (error) {
    console.log(error);
  }
};

export const getCartById = async (id: string): Promise<any> => {
  const endpoint = "http://localhost:3000/graphql";
  
  const query = `
    query Cart($id: ObjectID!) {
      cart(_id: $id) {
        _id
        items {
          menu_item {
            _id
            name
            price
          }
        }
        subtotal
      }
    }`;

  const headers = {
    "Authorization": "localtest",
    "Content-Type": "application/json",
    Accept: "application/json",
    "Access-Control-Allow-Origin": "*",
  };

  const variables = {
    id: id
  }

  try {
    const response = await axios.post<any>(
      endpoint,
      { query: query, variables },
      { headers },
    );
    return response.data;
  } catch (error) {
    console.log(error);
  }
};
