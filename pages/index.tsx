import { BagFill, InfoCircleFill } from "@styled-icons/bootstrap";
import {
  Button,
  CarouselTestimonial,
  Heading,
  Loading,
} from "@cheapreats/react-ui";
import type { NextPage } from "next";
import { Parallax } from "react-parallax";
import Snowfall from "react-snowfall";
import styled, { useTheme } from "styled-components";
import { useRef, useState } from "react";

const LOGO =
  "https://www.cheapreats.com/static/90939a6dc8dacea8e44d046c72521a1b/16c7d/logo.png";
const IMAGE =
  "https://images.unsplash.com/photo-1604573714289-312a6972f67c?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1074&q=80";
const ROTDEGREE = -4;

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

const Home: NextPage = () => {
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef();
  const theme = useTheme();

  /**
   * Loads the Order page
   */
  const redirectToOrder = () => {
    setIsLoading(true);
    window.location.replace("/order");
  };

  /**
   * Scrolls to 'Learn More' section of the homepage
   */
  const scrollOnClick = () => {
    if (scrollRef && scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  if (isLoading) {
    return (
      <div>
        {isLoading && (
          <>
            <Loading loading={true} />
            <Snowfall color={theme.colors.primary} />
          </>
        )}
      </div>
    );
  } else {
    return (
      <div>
      {isLoading && (
        <>
          <Loading loading={true} />
          <Snowfall color={theme.colors.primary} />
        </>
      )}
      {!isLoading && (
        <>
          <Parallax
            blur={PARALLAXCONF.blur}
            bgImage={PARALLAXCONF.bgImage}
            strength={PARALLAXCONF.strength}
          >
            <Section>
              <Container>
                <StyledHeading
                  type="h1"
                  size="3rem"
                  bold={true}
                >
                  Welcome to the CheaprEats
                  <br />
                  Voice Ordering System
                </StyledHeading>
                <Button
                  onClick={redirectToOrder}
                  icon={BagFill}
                  primary={true}
                  iconSize="20px"
                  margin="5px"
                >
                  Start Ordering
                </Button>
                <Button
                  onClick={scrollOnClick}
                  icon={InfoCircleFill}
                  iconSize="20px"
                  margin="5px"
                >
                  Learn More
                </Button>
              </Container>
            </Section>
            <Snowfall color={theme.colors.primary} />
          </Parallax>
          <Section>
            <Subsection bgCol={theme.colors.primary}>
              <Img src={LOGO} />
            </Subsection>
            <Subsection>
              <Heading type="h1" color="black" bold={true}>
                How it works
              </Heading>
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
                iconSize="20px"
                margin="5px"
                primary={true}
              >
                Start Ordering
              </Button>
            </Subsection>
          </Section>
        </>
      )}
    </div>
    );
  }
};

const Img = styled.img`
  width: 30%;
  height: 30%;
  border-radius: 50%;
  background-color: ${({ theme }) => theme.colors.background};
`;

const Container = styled.div`
  :before {
    content: "";
    position: absolute;
    left: -10;
    width: 150vw;
    height: 50%;
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

const StyledHeading = styled(Heading)`
  margin: 0 0 10px 0;
  color: black;
  text-align: center;
  line-height: 1.3;
  max-width: 100%; 
  z-index: 1;
`;

export default Home;
