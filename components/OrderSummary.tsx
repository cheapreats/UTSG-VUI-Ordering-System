import styled from "styled-components";
import { MenuItem, Cart } from "../components/interfaces";
import {
  Heading,
  SmallText,
  Paragraph,
  OrderTotalCard,
} from "@cheapreats/react-ui";
import { TableRow } from "../components/TableRow";

interface OrderSummaryProps {
  cart: Cart;
  align?: "left" | "center" | "right";
}
export const OrderSummary: React.VFC<OrderSummaryProps> = ({
  cart,
  ...props
}) => {
  if (!cart) {
    return <SmallText>Loading...</SmallText>;
  }

  let quantities: {
    [id: string]: {
      name: string;
      price: number;
      quantity: number;
    };
  } = {};

  const appendToQuantities = (element: { menu_item: MenuItem }) => {
    if (!element.menu_item) {
      return;
    }

    if (!(element.menu_item._id in quantities)) {
      quantities[element.menu_item._id] = {
        name: element.menu_item.name,
        price: element.menu_item.price,
        quantity: 1,
      };
    } else {
      quantities[element.menu_item._id].quantity += 1;
    }
  };

  // TODO: change to map
  cart.items.forEach(appendToQuantities);

  const renderRows = () => {
    let rows = [];
    for (const row in quantities) {
      rows.push(
        <TableRow
          name={quantities[row].name}
          price={quantities[row].price}
          quantity={quantities[row].quantity}
        />
      );
    }

    return rows;
  };

  const paragraphProps = {
    color: "black",
    bold: true,
    size: "2em",
    textAlign: "center",
  };

  return (
    <div>
      <UnderlinedParagraph {...paragraphProps}>
        Order Summary
      </UnderlinedParagraph>
      <OrderTable>
        <tr>
          <TH>Item</TH>
          <TH>Price</TH>
          <TH>Quantity</TH>
        </tr>
        {renderRows()}
      </OrderTable>
      <OrderCard
        orderCardContents={[
          {
            name: "Subtotal",
            price: cart.subtotal.toFixed(2),
          },
          {
            name: "Tax",
            price: (cart.subtotal * 0.13).toFixed(2),
          },
          {
            isBold: true,
            name: "Total",
            price: (cart.subtotal * 1.13).toFixed(2),
          },
        ]}
      />
    </div>
  );
};

const OrderTable = styled.table`
  width: 80%;
  margin-left: auto;
  margin-right: auto;
  margin-bottom: 1em;
`;

const TH = styled.th`
  width: 40em;
`;

const UnderlinedParagraph = styled(Paragraph)`
  margin-bottom: 0.5em;
  text-decoration: underline;
`;

const OrderCard = styled(OrderTotalCard)`
  width: 80%;
  padding: 0.5em;
  margin-top: 1em;
  margin-bottom: 1em;
  margin-left: auto;
  margin-right: auto;
`;
