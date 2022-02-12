import { Card, Heading, SmallText, Button } from "@cheapreats/react-ui";
import React from "react";
import styled from "styled-components";
import Image from "next/image";
import Snowfall from "react-snowfall";
import { useState, useEffect } from "react";
import { useRouter } from "next/router";

const SESSION_EXPIRY_TIMEOUT = 7000;

export const Success: React.VFC = () => {
  const [orderId, setOrderId] = useState("");
  const router = useRouter();

  useEffect(() => {
    if (!!router.query.id) {
      setOrderId(router.query.id as string);
    }
  }, [router.query]);

  function newOrder() {
    window.location.replace("/order");
  }

  useEffect(() => {
    const timer = setTimeout(newOrder, SESSION_EXPIRY_TIMEOUT);
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
        <StyledButton primary onClick={newOrder}>
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
  margin: 10em auto auto;
  postion: relative;
  padding: 3em;
`;

const StyledButton = styled(Button)`
  margin: 1em auto auto;
  text-align: center;
`;
