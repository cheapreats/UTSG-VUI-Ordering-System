import { Heading, SmallText } from "@cheapreats/react-ui";
import React from "react";
import styled from "styled-components";
import Image from "next/image";

export const Success: React.VFC = () => {
  const headingProps = {
    color: "green",
    textAlign: "center",
  };

  const smallTextProps = {
    size: "large",
    textAlign: "center",
  };

  return (
    <StyledDiv>
      <Image src={require("../images/logo.jpg")} />
      <Heading {...headingProps}>Thanks for your order!</Heading>
      <SmallText {...smallTextProps}>
        We appreciate your business! If you have any questions, please email
        <A href="mailto:hello@cheapreats.com"> hello@cheapreats.com</A>
      </SmallText>
    </StyledDiv>
  );
};

export default Success;

const StyledDiv = styled.div`
  text-align: center;
  margin-top: 10em;
`;

const A = styled.a`
  color: blue;
`;
