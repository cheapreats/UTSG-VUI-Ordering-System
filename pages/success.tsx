import { Card, Heading, SmallText } from "@cheapreats/react-ui";
import React from "react";
import styled from "styled-components";
import Image from "next/image";
import Snowfall from "react-snowfall";

export const Success: React.VFC = () => {
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
          We appreciate your business! If you have any questions, please email
          <a href="mailto:hello@cheapreats.com"> hello@cheapreats.com</a>
        </SmallText>
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
