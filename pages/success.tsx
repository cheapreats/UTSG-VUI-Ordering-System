import { Heading, SmallText } from "@cheapreats/react-ui";
import React from "react";

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
    <div>
      <img src={require("../images/logo.jpg")} />
      <Heading {...headingProps}>Thanks for your order!</Heading>
      <SmallText {...smallTextProps}>
        We appreciate your business! If you have any questions, please email
        <a href="mailto:hello@cheapreats.com">hello@cheapreats.com</a>
      </SmallText>
    </div>
  );
};

export default Success;
