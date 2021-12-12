import type { NextPage } from "next";
import styled from "styled-components";
import { Button, Heading, CarouselTestimonial } from "@cheapreats/react-ui";
import { BagFill, InfoCircleFill } from "@styled-icons/bootstrap";
import { Parallax } from "react-parallax";
import { useRef, useState, useEffect } from "react";
import Snowfall from "react-snowfall";

const LOGO =
  "https://www.cheapreats.com/static/90939a6dc8dacea8e44d046c72521a1b/16c7d/logo.png";
const IMAGE =
  "https://images.unsplash.com/photo-1604573714289-312a6972f67c?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1074&q=80";
const ROTDEGREE = -3;

const CAROUSELCONF = {
  title: "",
  image: "",
  reviews: [
    { testimony: "Follow the instructions of the chat bot", reviewer: "" },
    { testimony: "Order with your voice or text", reviewer: "" },
    { testimony: "Scan the QR code to pay", reviewer: "" },
  ],
  autoPlay: true,
  interval: 5000,
  loop: true,
};

const PARALLAXCONF = {
  blur: { min: -8, max: 8 },
  bgImage: IMAGE,
  strength: 300,
};

const COLORS = {
  primary: "#EE2434",
  background: "#FFFFFF",
};

const Home: NextPage = () => {
  const scrollRef = useRef();
  const redirectToOrder = () => {
    window.location.replace("/order");
  };

  const scrollOnClick = () => {
    scrollRef.current.scrollIntoView({ behavior: "smooth" });
  };


  return (
    <div>
      <Parallax
        blur={PARALLAXCONF.blur}
        bgImage={PARALLAXCONF.bgImage}
        strength={PARALLAXCONF.strength}
      >
        <Section>
          <Container>
            <Heading
              margin="0 0 10px 0"
              color="black"
              type="h1"
              size="3rem"
              textAlign="center"
              bold={true}
              children="Welcome to our Voice Ordering System"
              lineHeight="1.3"
              inlineStyle="max-width: 80%; z-index: 1"
            />
              <Button
                onClick={redirectToOrder}
                icon={BagFill}
                children="Start Ordering"
                primary={true}
                iconSize="20px"
                margin="5px"
              />
              <Button
                onClick={scrollOnClick}
                icon={InfoCircleFill}
                children="Learn More"
                iconSize="20px"
                margin="5px"
              />
          </Container>
        </Section>
        <Snowfall color={COLORS.primary} />
      </Parallax>
      <Section>
        <Subsection bgCol={COLORS.primary}>
          <Img src={LOGO} />
        </Subsection>
        <Subsection>
          <Heading
            type="h1"
            color="black"
            bold={true}
            children="How it works"
          />
          <h1 ref={scrollRef}></h1>
          <CarouselTestimonial
            carouselTitle={CAROUSELCONF.title}
            carouselImage={CAROUSELCONF.image}
            reviews={CAROUSELCONF.reviews}
            isAutoplaying={CAROUSELCONF.autoPlay}
            carouselInterval={CAROUSELCONF.interval}
            isLooping={CAROUSELCONF.loop}
          />
          <Button
            onClick={redirectToOrder}
            icon={BagFill}
            children="Start Ordering"
            iconSize="20px"
            margin="5px"
            primary={true}
          />
        </Subsection>
      </Section>
    </div>
  );
};

const Img = styled.img`
  width: 15%;
  height: 15%;
  border-radius: 50%;
  background-color: ${COLORS.background};
`;

const Container = styled.div`
  :before {
    content: '';
    position: absolute;
    left: -10;
    width: 150vw;
    height: 40%;
    background-color: ${({ theme }) => theme.colors.background};
    transform: rotateZ(${ROTDEGREE}deg);
  }
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
`;

const Section = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  width: 100%;
  height: 100vh;
`;

const Subsection = styled.div<{ bgCol?: string }>`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  width: 50%;
  height: 100vh;
  background-color: ${(p) => p.bgCol || "#FFF"};
`;

export default Home;
