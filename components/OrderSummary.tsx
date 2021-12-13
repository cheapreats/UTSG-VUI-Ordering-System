import styled from "styled-components";
import { MenuItem, Cart } from "../components/interfaces";
import {
  SmallText,
  Paragraph,
  OrderTotalCard,
  OrderItemList,
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

  let itemList: { name: string; price: string }[] = [];

  const buildItems = (element: { menu_item: MenuItem }) => {
    if (!element.menu_item) {
      return;
    }

    const item = {
      name: element.menu_item.name,
      price: "$" + element.menu_item.price.toString(),
    };

    itemList.push(item);
  };

  // TODO: change to map
  cart.items.forEach(buildItems);

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
      <OrderTable items={itemList} />
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

const OrderTable = styled(OrderItemList)`
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
  // text-decoration: underline;
`;

const OrderCard = styled(OrderTotalCard)`
  width: 80%;
  padding: 0.5em;
  margin-top: 1em;
  margin-bottom: 1em;
  margin-left: auto;
  margin-right: auto;
`;
