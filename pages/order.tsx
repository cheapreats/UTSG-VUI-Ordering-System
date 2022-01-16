import {
  Button,
  HighlightedString,
  HighlightedText,
  Heading,
  Loading,
  Mixins,
  QRScan,
  QRScanProps,
  SmallText,
  Tag,
  TextLayoutProps,
  IDropDownProps,
  HighlightedTextProps,
} from "@cheapreats/react-ui";
import {
  Microphone,
  Robot,
  ShoppingCart,
  User,
} from "@styled-icons/fa-solid/";
import type { NextPage } from "next";
import QRCode from "qrcode";
import React, { useEffect, useState, useRef } from "react";
import { SmartVoiceButton, Submit } from "../components";
import Snowfall from "react-snowfall";
import SpeechRecognition, {
  useSpeechRecognition,
} from "react-speech-recognition";
import styled, { useTheme } from "styled-components";

const axios = require("axios");

interface IOrder {
  store: string;
  storeid: string;
  item: string;
  itemid: string;
  price: number;
}

/**
 * Bot Response Variables
 * 
 * HIGHLIGHTEDTEXT_START - beginning of list of HighlightedText
 * HIGHLIGHTEDTEXT_END - ending of list of HighlightedText
 * MAIN_MENU - displays user order options
 * SESSIONS_RESET - resets total order price
 * NEWLINE - detects new line in list of text to display
 * CART_ID - VoiceFlow has current cartID
 * FOOD_ITEM_PRICE - VoiceFlow has current foodItemPrice
 * ORDERS - displays cart items
 */
const enum BotResponsesEnum {
  HIGHLIGHTEDTEXT_START = 'highlight',
  HIGHLIGHTEDTEXT_END = '\\highlight',
  MAIN_MENU = 'main menu',
  SESSION_RESET = 'session reset',
  NEWLINE = 'n',
  CART_ID = 'cartID',
  FOOD_ITEM_PRICE = 'foodItemPrice',
  ORDERS = 'orders'
};

var userID = "2";
const ver = "61a45af9bb4f63000637acef";
const VFBaseURL = "https://general-runtime.voiceflow.com";
const VFURL = "".concat("/state/", ver, "/user/", userID, "/interact");
const apiKey =
  "VF.61a1370a341ed7001c8e93e8.t7VKYPofdIS3X91hkvquHSTHJeQIMJpuL6RP2U1lt7";

const mainFramePadding = "1rem";
const iconSize = 50;
const noMarginSize = "0px";

const VBArgs = {
  disabled: false,
  icon: Microphone,
  iconSize: "20px",
  // color: '#e00',
  width: "100%",
  height: "50px",
  props: {
    "margin-left": "auto",
    "margin-right": "auto",
  },
};

const VBStyle = {
  justifyContent: "center",
  marginLeft: "auto",
  marginRight: "auto",
  width: "75px",
  height: "75px",
  "border-radius": "50%",
};

interface SpecialRange {
  begin: number;
  end: number;
}

const VBProps: any = {
  buttonProps: {
    style: VBStyle,
  },
};

const CheckoutQR = styled.img`
  width: 300px;
  height: 300px;
  border: 1px solid black;
`;

const textMarginSize = "10px";
let imgUrl;
const SUGGESTED_RESPONSES = ['Place Order', 'Cancel Order', 'List Orders', 'Done']
const priceDisplayText = "Hey there User!";

const Landing: NextPage = () => {
  const [highlightedStrings, setHighlightedStrings] = useState<
    Array<React.ReactElement>
  >([]);
  const [isWaiting, setIsWaiting] = useState(false);
  const [isBegan, setBegan] = useState(false);
  const [tagsVisible, setTagsVisible] = useState(false);
  const [tagSelected, setTagSelected] = useState(-1);
  const [price, setPrice] = useState(0);
  const [quantity, setQuantity] = useState(0);
  const [isFocused, setIsFocused] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const theme = useTheme();

  const scrollRef = useRef<HTMLDivElement>(null);
  /**
   * Scrolls to bottom of the chat history for the most recent messages
   */
  const scrollToBottom = () => {
    if (scrollRef && scrollRef.current) {
      scrollRef.current.scrollTo({
        top: scrollRef.current.scrollHeight,
        behavior: "smooth",
      });
    }
  };

  const { transcript, listening, resetTranscript } = useSpeechRecognition();

  const nextHighlightedStrings = highlightedStrings.slice();
  const addElement = (newElement: React.ReactElement): void => {
    nextHighlightedStrings.push(newElement);
    setHighlightedStrings([...nextHighlightedStrings]);
  };

  useEffect(() => {
    // scrollToBottom();
    if (true) {
      setTimeout(() => {
        scrollToBottom();
      }, 400);
    }
  }, [highlightedStrings]);

  const addHighlightedString = (HString: HighlightedString): void => {
    const chatBubble = createTextBubble(HString);

    nextHighlightedStrings.push(chatBubble);
    setHighlightedStrings([...nextHighlightedStrings]);
    // setNumStrings(nextHighlightedStrings.length);
  };

  /**
   * Get arguments for HighlightedString
   * @param {boolean} isFromBot - True if bot response
   * @param {string} text
   * @param {undefined | Array<React.ReactElement} list - List of string variables
   * @param {SpecialRange | undefined} specialRange - Identify range of elements to highlight
   * @returns {HighlightedString}
   */
  const highlightifyString = (
    isFromBot: boolean,
    text: string,
    list: undefined | Array<React.ReactElement>,
    specialRange: SpecialRange | undefined
  ): HighlightedString => {

    return {
      text: text,
      isSpecial: list ? true : false,
      specialRange: specialRange,
      listItemsBodies: list,
      isRight: isFromBot,
      listProps: {
        // dropdownButton: <div/>,
        beginOpen: true,
        right: false,
        dropdownWidth: "90%",
        style: returnStyling(isFromBot, 'listProps'),
      },
      textProps: {
        type: "div",
        style: returnStyling(isFromBot, "textProps"),
      },
    };
  };

   /**
   * Return textProps and listProps styling depending on sender
   * @param {boolean} isFromBot 
   * @param {'listProps' | 'textProps'}} propName 
   * @returns {React.CSSProperties}
   */
    const returnStyling = (isFromBot: boolean, propName: 'listProps' | 'textProps'): React.CSSProperties => {
      let textAlign: "left" | "right" = "right";
      let textColor = "white";
      if (isFromBot) {
        textAlign = "left";
        textColor = "black";
      }
      switch (propName) {
        case "listProps":
          return ({
              'left': "1px",
              'marginLeft': textMarginSize,
              'marginRight': textMarginSize,
          });
        case "textProps":
          return (
            {
              'textAlign': textAlign,
              'color': textColor,
              'whiteSpace': "pre-line",
              // width: '80%',
              'marginLeft': "2px",
              'marginRight': "2px",
            }
          );
        default:
          return ({});
      }
    }

  const createQRBubble = (QRFrame: React.ReactElement): React.ReactElement => {
    return (
      <TextBubbleContainer isFromBot={true}>
        <TextBubble isFromBot={true}>{QRFrame}</TextBubble>
      </TextBubbleContainer>
    );
  };

  const createTextBubble = (
    highlightedString: HighlightedString
  ): React.ReactElement => {
    var icon = User;
    const { isRight } = highlightedString;
  
    if (isRight) {
      icon = Robot;
    }

    return (
      <TextBubbleContainer isFromBot={!!isRight}>
        <StyledImg isFromBot={!!isRight} as={icon} imgSize={iconSize} />
        <TextBubble isFromBot={!!isRight}>
          <StyledP textMarginSize={textMarginSize}>
            <HighlightedText labels={[highlightedString]} />
          </StyledP>
        </TextBubble>
      </TextBubbleContainer>
    );

  };

  const displayHighlightedText = (): React.ReactElement => {
    return <>{highlightedStrings}</>;
  };

  const formatSmallTextChildren = (index: number, children: string): string => {
    return "".concat((index + 1).toString(), ". ", children);
  }

  /**
   * Map string array to SmallText array
   * @param {Array<string>} strings 
   * @returns {Array<React.ReactElement>}}
   */
  const smallTextifyList = (
    strings: Array<string>
  ): Array<React.ReactElement> => {
    let smallTexts: Array<React.ReactElement> = [];
    for (let i = 0; i < strings.length; i++) {
      smallTexts.push(
        <SmallText>{formatSmallTextChildren(i, strings[i])}</SmallText>
      );
    }
    return smallTexts;
  };

  const handleQRClick = () => {
    setIsLoading(true);
  };

  /**
   * Parse the bot's response
   * @param {any} resData - response text
   */
  const parseBotResponse = async (resData: any) => {
    for (var item of resData) {
      if (item.type == "speak" && item.payload.type == "message") {
        let res: string = item.payload.message;
        let isSpecial = true;

        let specialRange: SpecialRange = {
          begin: 0,
          end: 0,
        };

        let list: Array<React.ReactElement> | undefined = undefined;
        while (res.indexOf("[") != -1) {
          let varIndicatorStart: number = res.indexOf("[");
          let varIndicatorEnd: number = res.indexOf("]");

          let targetVariable: string = res.substring(
            varIndicatorStart + 1,
            varIndicatorEnd
          );

          if (targetVariable == BotResponsesEnum.NEWLINE) {
            res = res.replace("".concat("[", targetVariable, "]"), "\n");
            continue;
          } else {
            res = res.replace("".concat("[", targetVariable, "]"), "");
          }

          switch(targetVariable) {
            case BotResponsesEnum.HIGHLIGHTEDTEXT_START:
              specialRange.begin = varIndicatorStart;
              continue;
            case BotResponsesEnum.HIGHLIGHTEDTEXT_END:
              specialRange.end = varIndicatorStart;
              continue;
            case BotResponsesEnum.MAIN_MENU:
              // bot prints menu options
              setTagsVisible(true);
              continue;
            case BotResponsesEnum.SESSION_RESET:
              setPrice(0);
              continue;
          }

          const response = await axios({
            method: "GET",
            baseURL: VFBaseURL,
            url: "".concat("/state/", ver, "/user/", userID),
            headers: { Authorization: apiKey },
          });

          if (targetVariable == BotResponsesEnum.CART_ID) {
            let cartID = response.data.variables[targetVariable];

            //window.location.replace("http://localhost:8080/checkout?id=".concat(cartID));

            const checkoutURL = "http://localhost:8080/checkout?id=".concat(
              cartID
            );
            QRCode.toDataURL(checkoutURL, (err, url) => {
              if (err) {
                console.error(err);
              } else {
                imgUrl = url;
                isSpecial = false;

                let QRArgs: QRScanProps = {
                  title: "Checkout",
                  qrDisplay: <CheckoutQR src={imgUrl} />,
                  qrRightContent: (
                    <SmallText margin="10px">
                      Scan this QR Code to pay with your phone.
                      <br />
                      OR, press the QR Code to pay from this device.
                    </SmallText>
                  ),
                };

                addElement(
                  createQRBubble(
                    <a href={checkoutURL} onClick={handleQRClick}>
                      <QRScan {...QRArgs} />
                    </a>
                  )
                );
              }
            });
          } else if (targetVariable == BotResponsesEnum.FOOD_ITEM_PRICE) {
            // update order summary
            setPrice(
              (prevPrice) => prevPrice + response.data.variables[targetVariable]
            );
            setQuantity((prevQuantity) => prevQuantity + 1);
            continue;
          } else if (targetVariable == BotResponsesEnum.SESSION_RESET) {
            let sumPrices = 0;
            let orders: IOrder[] = response.data.variables[targetVariable];
            for (var i = 0; i < orders.length; i++) {
              sumPrices += orders[i].price;
            }
            setPrice(sumPrices);
            setQuantity((prevQuantity) => prevQuantity - 1);
            continue;
          } else {
            if (!response.data.variables[targetVariable]) {
              console.warn(
                targetVariable + " is not a valid Voiceflow variable."
              );
              continue;
            }
            list = smallTextifyList(response.data.variables[targetVariable]);
          }

        }

        if (specialRange.end == 0) {
          specialRange.end = res.length;
        }

        speak(res);
        addHighlightedString(highlightifyString(true, res, list, specialRange));
      } else {
        console.warn("Received an unexpected data type: Item - ".concat(item));
      }
    }
  };

  /**
   * Gets the first bot message
   */
  const initVF = async () => {
    const reqBody = {
      request: {
        type: "launch",
      },
    };

    // await axios({
    //   method: 'DELETE',
    //   baseURL: VFBaseURL,
    //   url: ''.concat('/state/', ver, '/user/', userID),
    //   headers: { Authorization: apiKey,},
    // });

    const response = await axios({
      method: "POST",
      baseURL: VFBaseURL,
      url: VFURL,
      headers: { Authorization: apiKey },
      data: reqBody,
    });

    parseBotResponse(response.data);
  };

  /**
   * Get the bot's response to a request the user sent
   * @param {string} requestText - user's request                 
   * @returns {boolean} False if no response.
   */
  const getBotResponse = async (requestText: string) => {
    if (requestText === "") {
      return false;
    }
    addHighlightedString(
      highlightifyString(false, requestText, undefined, undefined)
    );

    const reqBody = {
      request: {
        type: "text",
        payload: requestText,
      },
    };

    const response = await axios({
      method: "POST",
      baseURL: VFBaseURL,
      url: VFURL,
      headers: { Authorization: apiKey },
      data: reqBody,
    });

    parseBotResponse(response.data);
  };

  let synth: SpeechSynthesis | undefined = undefined;

  /**
   * initializes Voiceflow session
   */
  useEffect(() => {
    if (!isBegan) {
      setBegan(true);

      initVF();
    }

    synth = window.speechSynthesis;
  });

  const VBClicked = () => {
    if (!isWaiting) {
      resetTranscript();
      if (synth) synth.cancel();
      SpeechRecognition.startListening();
    } else {
      SpeechRecognition.stopListening();

      getBotResponse(transcript);
    }
    setIsWaiting(!isWaiting);
  };

  /**
   * Voiceflow API speaks
   * @param {string} text - voice prompt
   */
  const speak = async (text: string) => {
    if (text != "") {
      const speakText = new SpeechSynthesisUtterance(text);
      speakText.onend = (e) => {
        console.log("Done speaking");
      };
      speakText.onerror = (e) => {
        console.log("Something went wrong");
      };
      if (synth) synth.speak(speakText);
    }
  };

  /**
   * Handles onClick event for TagContainer components
   * @param submission 
   */
  const submitUserRequest = function (submission: string) {
    if (synth) synth.cancel(); // stops VoiceBot from talking
    getBotResponse(submission);
  };

  /**
   * Map tags to StyledTag components
   * @param {string[]} tags
   * @returns {React.ReactElement[]}
   */
  const displayTags = (tags: string[]) => {
    var tagComponents: React.ReactElement[] = [];
    tags.map((tag, index) => {
      tagComponents.push(
        <StyledTag
          onClick={function () {
            setTagSelected(index);
            setTagsVisible(false);
            submitUserRequest(tag);
          }}
          iconBehaviour="None"
          isVisible={tagsVisible}
          isSelected={index === tagSelected}
        >
          {tag}
        </StyledTag>
      );
    });
    return tagComponents;
  };

  const setFocusTrue = function () {
    setIsFocused(true);
  };
  const setFocusFalse = function () {
    setIsFocused(false);
  };

  const formatPriceDisplayButton = (quantity: string, price: string): string => {
    return `${quantity} | $${price}`;
  }

  return (
    <>
      {isLoading && (
        <>
          <Loading loading={true} />
          <Snowfall color={theme.colors.primary} />
        </>
      )}
      {!isLoading && (
        <LandingPageContainer>
          <LandingPageContent>
            <StyledSnowfall />
            <PopupContainer
              onMouseEnter={setFocusTrue}
              onMouseLeave={setFocusFalse}
            >
              <Popup isHovered={isFocused}>
                <PriceDisplayHeading>{priceDisplayText}</PriceDisplayHeading>
                <PriceDisplayButton
                  onClick={undefined}
                  icon={ShoppingCart}
                  primary={true}
                  iconSize="25px"
                  margin="5px"
                >
                  {formatPriceDisplayButton(quantity.toString(), price.toString())}
                </PriceDisplayButton>
                {/* <PriceDisplay icon={ShoppingCart}>{price}</PriceDisplay> */}
              </Popup>
            </PopupContainer>
            <LandingPage>
              <TopBox>
                <ScrollingList
                  ref={scrollRef}
                >
                  {displayHighlightedText()}
                  {/* <HighlightedText labels={highlightedStrings}>
              </HighlightedText> */}
                </ScrollingList>
                <SmartVoiceButton
                  onClick={VBClicked}
                  isPulsing={isWaiting}
                  {...VBProps}
                  {...VBArgs}
                />
                <StyledFieldSet>
                  <legend>
                    <SmallText>OR</SmallText>
                  </legend>
                </StyledFieldSet>
              </TopBox>
              <InputContainer>
                <TagContainer>{displayTags(SUGGESTED_RESPONSES)}</TagContainer>
                <Submit onSubmit={submitUserRequest} />
              </InputContainer>
            </LandingPage>
          </LandingPageContent>
        </LandingPageContainer>
      )}
    </>
  );
};

const SLIDEFADEIN_ANIMATION = `
  animation: slidefadein 0.5s linear 1;
  @keyframes slidefadein {
    from {
      opacity: 0;
      transform: translate3d(0,-100%,0);
    }
    to {
      opacity: 1;
      transform: translate3d(0,0,0);
    }

  }
`;

const SLIDEFADEOUT_ANIMATION = `
  animation: slidefadeout 0.5s linear 1;
  @keyframes slidefadeout {
    from {
      opacity: 1;
      transform: translate3d(0,0,0);
    }
    to {
      opacity: 0;
      transform: translate3d(0,100%,0);
    }

  }
`;

const FADEOUT_ANIMATION = `
  animation: fadeout 0.5s linear 1;
  @keyframes fadeout {
    from {
      opacity: 1;
    }
    to {
      opacity: 0;
    }
  }
`;

const StyledTag = styled(Tag)<{ isVisible: boolean, isSelected: boolean }>`
  ${Mixins.transition(['visibility'])}
  ${({ theme }): string => `
    background-color: ${theme.colors['background']};
  `}

  ${({ isVisible, isSelected }): string => 
      isVisible ? `
          ${SLIDEFADEIN_ANIMATION}
          visibility: visible;
      ` : `
          ${isSelected ? FADEOUT_ANIMATION 
              : SLIDEFADEOUT_ANIMATION}
          visibility: hidden;
      `
  }
`;

const PriceDisplayHeading = styled(Heading)`
  width: 45%;
  overflow: hidden;
  margin-left: 5px;
  margin-right: auto;
`;

const PriceDisplayButton = styled(Button)`
  width: 45%;
  margin-left: auto;
  margin-right: 5px;
`;

const PopupContainer = styled.div`
  position: absolute;
  top: 0%;
  width: 100%;
  height: 150px;
  z-index: 2;
`;

const Popup = styled.div<{ isHovered: boolean }>`
  ${Mixins.flex("row")};
  position: relative;
  top: -50%;
  height: 50%;
  margin-left: auto;
  margin-right: auto;
  max-width: calc(800px);
  width: calc(80%);
  ${({ theme }): string => `
    background-color: ${theme.colors["background"]};
  `}
  box-shadow: 0 1mm 5mm;
  border-radius: 0 0 20px 20px;
  padding: 10px;
  z-index: 2;

  transition: 0.5s;

  ${({ isHovered }): string =>
    isHovered
      ? `
    transition: 0.25s ease-out 1;
    top: calc(0%);
  `
      : ``}
`;

const TagContainer = styled.div`
  ${Mixins.flex("row")};
  justify-content: space-between;
  width: 35%;
  margin: auto auto 10px auto;
`;

const StyledSnowfall = styled(Snowfall)`
  position: absolute;
  z-index: -1;
`;

const StyledFieldSet = styled.fieldset`
  border-top: 1px solid #8a8a8a;
  border-bottom: none;
  border-left: none;
  border-right: none;
  display: block;
  text-align: center;
  margin-top: 10px;
`;

const InputContainer = styled.div`
  ${Mixins.flex("column")};
  position: absolute;
  top: calc(100% - 150px);
  width: calc(100% - calc(${mainFramePadding} * 2));
  height: calc(125px);
  justify-content: end;
`;

const TopBox = styled.div`
  position: absolute;
  width: calc(100% - calc(${mainFramePadding} * 2));
  height: calc(100% - 25px);
`;

const ScrollingList = styled.div`
  ${Mixins.scroll}
  &::-webkit-scrollbar {
    background-color: rgba(0, 0, 0, 0);
  }
  ${Mixins.transition(["height"])}
  height: calc(100% - 275px);
  background: rgba(238, 238, 238, 0.25);
  padding: 5px;
  padding-top: 25px;
  overflow: hidden;
  overflow-y: scroll;
  overflow-wrap: break-word;

`;

const LandingPageContainer = styled.div`
  display: table;
  height: 100%;
  position: absolute;
  overflow: hidden;
  width: 100%;
`;

const LandingPageContent = styled.div`
  vertical-align: middle;
  display: table-cell;

  background: linear-gradient(#ee2434, #f25e6a);
  min-height: 500px;
  background-attachment: fixed;
  background-position: center;
  background-repeat: no-repeat;
  background-size: cover;
`;

const LandingPage = styled.div`
  min-width: 400px;
  min-height: 600px;
  width: 60%;
  height: 100%;
  background: rgba(238, 238, 238, 0.6);
  padding: ${mainFramePadding};
  border-radius: 5px;
  margin-left: auto;
  margin-right: auto;
  overflow: hidden;
  overflow-y: hidden;
  overflow-wrap: break-word;
  position: relative;
`;

const container_margin = "10px";
const TextBubbleContainer = styled.div<{ isFromBot: boolean }>`
  ${Mixins.flex("row")};
  ${Mixins.flex("center")};
  position: relative;

  maxwidth: "80%";
  width: "fit-content";
  ${({ isFromBot }): string =>
    isFromBot
      ? `
    justify-content: left;
    margin-left: 0px;
    margin-right: ${container_margin};
  `
      : `
    justify-content: right;
    margin-left: ${container_margin};
    margin-right: 0px;
  `}
  marginTop: standardMarginSize;

  margin-top: -20px;
  margin-bottom: 20px;
  ${({ theme }): string => `
    padding: ${theme.dimensions.padding.withBorder};
  `}

  animation: appear 0.5s ease-in 1;
  @keyframes appear {
    from {
      opacity: 0;
    }
    to {
      opacity: 100;
    }
  }
`;

const bubble_margin = "50px";
const TextBubble = styled.div<{ isFromBot: boolean }>`
  ${({ isFromBot }): string =>
    isFromBot
      ? `
    margin-left: ${bubble_margin};
    margin-right: 0px;
  `
      : `
    margin-left: 0px;
    margin-right: ${bubble_margin};
  `}
  border: 1.5px solid rgba(0,0,0,0.1);
  ${({ theme, isFromBot }): string =>
    isFromBot
      ? `
    border-radius: 20px 20px 20px 5px;
    background-color:  ${theme.colors["background"]};
    `
      : `
    border-radius: 20px 20px 5px 20px;
    background-color: ${theme.colors["primary"]};
    `}
  }
  margin-bottom: 10px;  
`;

const StyledP = styled.p<{ textMarginSize: string }>`
  margin: 0 ${textMarginSize} 0 ${textMarginSize};
`;

const StyledImg = styled.svg<{ imgSize: number; isFromBot: boolean }>`
  ${({ isFromBot }): string =>
    isFromBot
      ? `
    bottom: calc(0px);
    left: calc(0px);
  `
      : `
    bottom: calc(0px);
    right: calc(0px);
  `}

  position: absolute;
  ${({ imgSize }) => `
    width: ${imgSize}px;
    height: ${imgSize}px;
  `}
  margin-left: 10px;
  margin-right: 10px;

  border-radius: 999px;
  border-style: solid;
  padding: 10px;
`;

export default Landing;
