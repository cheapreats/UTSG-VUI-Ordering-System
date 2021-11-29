import qs from "qs";
import axios from "axios";
export interface Price {
  amount: number;
  currency: string;
}

export const getCustomerSecret = async (price: Price): Promise<any> => {
  const url = "https://api.stripe.com/v1/payment_intents";
  const headers = {
    "Content-Type": "application/x-www-form-urlencoded",
    Authorization: `Bearer ${process.env.NEXT_PUBLIC_STRIPE_SK}`,
  };

  const formattedParam = qs.stringify(price, { arrayFormat: "repeat" });

  try {
    const response = await axios.post<any>(url, formattedParam, {
      headers: headers,
    });
    return response.data;
  } catch (error) {
    console.log(error);
  }
};

export const getCartById = async (id: string) => {
  const endpoint = "https://graphql-v1.cheapreats.com/graphql";

  const query = `
    {
      Cart(id: ${id}) {
        items {
          menu_item {
            name
            price
          }
        }
        subtotal
      }
    }
  `;

  const headers = {
    "Content-Type": "application/json",
    Accept: "application/json",
    "Access-Control-Allow-Origin": "*",
  };

  try {
    const response = await axios.post<any>(
      endpoint,
      { query: query },
      { headers }
    );
    return response.data;
  } catch (error) {
    console.log(error);
  }
};
