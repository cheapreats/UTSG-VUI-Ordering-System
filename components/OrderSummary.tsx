import styled from "styled-components";
import { MenuItem, Cart } from "../components/interfaces";
import { SmallText } from "@cheapreats/react-ui";
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

  // TODO: change to existing styling
  return (
    <StyledTable>
      <thead>
        <tr>
          <StyledTH>Item</StyledTH>
          <StyledTH>Price</StyledTH>
          <StyledTH>Quantity</StyledTH>
        </tr>
      </thead>
      <tbody>
        {renderRows()}
        <tr>
          <StyledTD>Subtotal: ${cart.subtotal.toFixed(2)}</StyledTD>
        </tr>
        <tr>
          <StyledTD>Tax: ${(cart.subtotal * 0.13).toFixed(2)}</StyledTD>
        </tr>
        <tr>
          <StyledTD>Total: ${(cart.subtotal * 1.13).toFixed(2)}</StyledTD>
        </tr>
      </tbody>
    </StyledTable>
  );
};

const StyledTable = styled.table`
  width: 60%;
  margin-left: auto;
  margin-right: auto;
  margin-bottom: 3em;
`;

const StyledTH = styled.th`
  text-align: left;
`;

const StyledTD = styled.td.attrs({
  colSpan: 3,
})`
  text-align: left;
`;
