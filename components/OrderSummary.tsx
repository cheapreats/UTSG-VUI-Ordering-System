import styled from "styled-components";
import { Cart } from "../components/interfaces";

interface OrderSummaryProps {
  cart: Cart;
}

export const OrderSummary: React.VFC<OrderSummaryProps> = ({
  cart,
  ...props
}) => {
  return <StyledSummary>order summary goes here</StyledSummary>;
};

const StyledSummary = styled.div`
  text-align: center;
`;
