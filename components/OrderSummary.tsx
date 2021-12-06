import styled from "styled-components";
import { MenuItem, Cart } from "../components/interfaces";
import { Heading } from "@cheapreats/react-ui";
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

  const headingProps = {
    type: "h5",
    textAlign: "center",
  };

  return (
    <div>
      <Header {...headingProps}>Order Summary</Header>
      <OrderTable>
        <tr>
          <TH>Item</TH>
          <TH>Price</TH>
          <TH>Quantity</TH>
        </tr>
        {renderRows()}
      </OrderTable>
      <PriceTable>
        <tr>
          <TD>Subtotal: ${cart.subtotal.toFixed(2)}</TD>
        </tr>
        <tr>
          <TD>Tax: ${(cart.subtotal * 0.13).toFixed(2)}</TD>
        </tr>
        <tr>
          <TD>Total: ${(cart.subtotal * 1.13).toFixed(2)}</TD>
        </tr>
      </PriceTable>
    </div>
  );
};

const Header = styled(Heading)`
  margin-top: 1em;
  margin-bottom: 1em;
  text-decoration: underline;
`;

const OrderTable = styled.table`
  width: 60%;
  margin-left: auto;
  margin-right: auto;
  margin-bottom: 1em;
`;

const PriceTable = styled.table`
  width: 50%;
  margin-left: auto;
  margin-right: auto;
  margin-bottom: 3em;
`;

const TH = styled.th`
  width: 40em;
`;

const TD = styled.td.attrs({
  colSpan: 3,
})`
  text-align: right;
`;
