import { Card, Heading, SmallText, Button } from "@cheapreats/react-ui";
import React from "react";
import styled from "styled-components";
import Image from "next/image";
import Snowfall from "react-snowfall";
import { useState, useEffect } from "react";
import { useRouter } from "next/router";

export const Success: React.VFC = () => {
  const [orderId, setOrderId] = useState<string>("");
  const router = useRouter();

  useEffect(() => {
    const orderIdString: string = router.query.id as string;

    if (!!router.query) {
      setOrderId(orderIdString);
    }
  }, [router.query]);

  useEffect(() => {
    const timer = setTimeout(() => window.location.replace("/order"), 7000);
    return () => clearTimeout(timer);
  }, []);

  const headingProps = {
    color: "green",
    textAlign: "center",
    bold: true,
  };

  const smallTextProps = {
    size: "large",
    textAlign: "center",
  };

  const buttonProps = {
    color: "red",
    onClick: () => window.location.replace("/order"),
  };

  return (
    <div
      style={{
        backgroundColor: "#ff6666",
        width: "100%",
        height: "100%",
        position: "absolute",
      }}
    >
      <Snowfall color="white" />
      <StyledCard animated>
        <Image src={require("../images/logo.jpg")} />
        <Heading {...headingProps}>Thanks for your order!</Heading>
        <SmallText {...smallTextProps}>
          Your order id is {orderId}. We appreciate your business! If you have
          any questions, please email
          <a href="mailto:hello@cheapreats.com"> hello@cheapreats.com</a>
        </SmallText>
        <StyledButton primary {...buttonProps}>
          Start New Order
        </StyledButton>
      </StyledCard>
    </div>
  );
};

export default Success;

const StyledCard = styled(Card)`
  width: 60%;
  text-align: center;
  margin-top: 10em;
  margin-left: auto;
  margin-right: auto;
  postion: relative;
  padding: 3em;
`;

const StyledButton = styled(Button)`
  margin-left: auto;
  margin-right: auto;
  text-align: center;
  margin-top: 1em;
`;
