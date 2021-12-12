import type { NextPage } from "next";
import { QRScan, QRScanProps, Button, SmallText, HighlightedText, HighlightedString, ClickableSmallText, ScrollableListContent, 
  VoiceButtonProps, ButtonProps, Mixins, BaseStyles, Heading, TagGroup } from "@cheapreats/react-ui";
import { NavigationBar, INavigationBarProps } from "@cheapreats/react-ui";
import React, {useEffect, useState, useRef} from 'react';
import { Robot, User, Microphone } from '@styled-icons/fa-solid/';
import styled, { useTheme } from 'styled-components';
import {CartItem, SmartVoiceButton, Submit} from '../components';
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';
import QRCode from 'qrcode';
import Theme from "@cheapreats/react-ui/dist/Themes/ThemeTemplate";
import Snowfall from 'react-snowfall';
const axios = require('axios');


var userID = '2';
const ver = '61a45af9bb4f63000637acef';
const VFBaseURL = 'https://general-runtime.voiceflow.com';
const VFURL = ''.concat('/state/', ver, '/user/', userID, '/interact');
const apiKey = 'VF.61a1370a341ed7001c8e93e8.t7VKYPofdIS3X91hkvquHSTHJeQIMJpuL6RP2U1lt7';

const VBArgs = {
  disabled: false,
  icon: Microphone,
  iconSize: '20px',
  // color: '#e00',
  width: '100%',
  height: '50px',
  props: {
    "margin-left": 'auto',
    "margin-right": 'auto',
  },
};

const VBStyle = {
  justifyContent: 'center',
  'marginLeft': 'auto',
  'marginRight': 'auto',
  width: '75px',
  height: '75px',
  'border-radius': '50%',
}

interface SpecialRange {
  begin: number,
  end: number,
}

const VBProps: any = {
  buttonProps: {
    style: VBStyle,
  },
}

const CheckoutQR = styled.img`
  width: 300px;
  height: 300px;
  border: 1px solid black;
`

const textMarginSize = '10px'
let imgUrl;

const Landing: NextPage = () => {
  const [highlightedStrings, setHighlightedStrings] = useState<Array<React.ReactElement>>([]);
  const [isWaiting, setIsWaiting] = useState<boolean>(false);
  const [isBegan, setBegan] = useState<boolean>(false);

  // const theme = useTheme();

  //auto scroll to bottom
  const scrollRef = useRef<HTMLDivElement>(null)
  const scrollToBottom = () => {
    if (scrollRef && scrollRef.current){
      console.log(scrollRef)
      scrollRef.current.scrollTo({ 
          top: scrollRef.current.scrollHeight, 
          behavior: 'smooth'
        })
    }
  }
  
  const {
    transcript,
    listening,
    resetTranscript
  } = useSpeechRecognition();

  const nextHighlightedStrings = highlightedStrings.slice()
  const addElement = (newElement: React.ReactElement): void => {
    nextHighlightedStrings.push(newElement);
    setHighlightedStrings([...nextHighlightedStrings]);
  }

  const addHighlightedString = (HString: HighlightedString): void => {

    const chatBubble = createTextBubble(HString);

    nextHighlightedStrings.push(chatBubble);
    setHighlightedStrings([...nextHighlightedStrings]);
    // setNumStrings(nextHighlightedStrings.length);

    scrollToBottom();
  }

  const highlightifyString = (fromBot: boolean, text: string, list: undefined | Array<any>, specialRange: SpecialRange|undefined):HighlightedString => {
    let txtAlign = 'right';
    if (fromBot){
      txtAlign = 'left';
      // text = 'Bot:\n' + text;
    } else {
      // text = 'You:\n' + text;
    }

    let margin_left = 'auto'; 
    let margin_right = '0';
    var textColor = 'white';
    if (fromBot) {
      margin_left = '0'; 
      margin_right = 'auto';
      textColor = 'black';
    }

    let isSpecial = false;
    if (list){
      isSpecial = true;
    }
    
    return {
      text: text,
      isSpecial: isSpecial,
      specialRange: specialRange,
      listItemsBodies: list,
      isRight: fromBot,
      listProps: {
        // dropdownButton: <div/>,
        beginOpen: true,
        right: false,
        dropdownWidth: '90%',
        style:{
          left: '1px',
          marginLeft: textMarginSize,
          marginRight: textMarginSize,
        },
      },
      textProps: {
        textAlign: txtAlign,
        type: 'div',
        color: textColor,
        style:{
          whiteSpace: 'pre-line',
          // width: '80%',
          marginLeft: '2px',
          marginRight: '2px',
        },
      },
    };
  }

  const marginSize = '10px'
  const noMarginSize = '0px'
  const createQRBubble = (QRFrame: React.ReactElement):React.ReactElement => {
    let textBubbleStyle = {
      maxWidth: '80%',
      width: 'fit-content',
      marginLeft: marginSize,
      marginRight: 'auto',
    }
    
    return (
      <TextBubble style={textBubbleStyle} fromBot={true}>
        {QRFrame}
      </TextBubble>
    )
  }

  const createTextBubble = (highlightedString: HighlightedString):React.ReactElement => {
    let margin_left = 'auto'; 
    let margin_right = noMarginSize;
    var icon = User;
    if (highlightedString.isRight) { // highlighted string appears on right of icon
      margin_left = noMarginSize; 
      margin_right = 'auto';
      icon = Robot;
    }

    console.log(highlightedString.listItemsBodies)
    
    let textBubbleStyle = {
      maxWidth: '80%',
      width: 'fit-content',
      marginLeft: margin_left,
      marginRight: margin_right,
      marginTop: '10px',
    }
    
    if (highlightedString.isRight){
      return (
        <TextBubbleContainer style={textBubbleStyle} >
          <StyledImg 
                as={icon}
                imgSize={50}
          />
          <TextBubble fromBot={highlightedString.isRight || false}>
              <p style={{marginLeft: textMarginSize, marginRight: textMarginSize}}>
                <HighlightedText labels={[highlightedString]}/>
              </p>
          </TextBubble>
        </TextBubbleContainer>
      )
    } else {
      return (
        <TextBubbleContainer style={textBubbleStyle} >
          <TextBubble fromBot={highlightedString.isRight || false}>
              <p style={{marginLeft: textMarginSize, marginRight: textMarginSize}}>
                <HighlightedText labels={[highlightedString]}/>
              </p>
          </TextBubble>
          <StyledImg 
                as={icon}
                imgSize={50}
          />
        </TextBubbleContainer>
      )
    }
  }

  const TextBubbleContainer = styled.div`
    ${Mixins.flex('row')};
    ${Mixins.flex('center')};

    margin-top: -20px;
    margin-bottom: -20px;
    ${({ theme }): string => `
      padding: ${theme.dimensions.padding.withBorder};
    `}
  `;

  const StyledImg = styled.svg<{ imgSize: number}>`
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

  const displayHighlightedText = ():React.ReactElement => {
    
    return <>
      {highlightedStrings}
    </>
  }

  const smallTextifyList = (strings: Array<string>):Array<any> => {
    let smallTexts: Array<any> = [];
    for (let i = 0; i < strings.length; i++) {
      smallTexts.push(<SmallText>{"".concat((i+1).toString(), ". ", strings[i])}</SmallText>);
    }
    return smallTexts
  }


  const parseResponse = async (resData: any) => {
    for (var item of resData) {
      if (item.type == "speak" && item.payload.type == "message"){
        let res: string = item.payload.message;
        let isSpecial = true;

        let specialRange:SpecialRange = {
          begin: 0,
          end: 0,
        }

        let list:Array<any> | undefined = undefined;
        while (res.indexOf('[') != -1){
          
          let varIndicatorStart: number = res.indexOf('[')
          let varIndicatorEnd: number = res.indexOf(']')

          let targetVariable: string = res.substring(varIndicatorStart + 1, varIndicatorEnd);
          if (targetVariable == 'n'){
            res = res.replace(''.concat('[', targetVariable, ']'), '\n');
            continue
          } else {
            res = res.replace(''.concat('[', targetVariable, ']'), "");
          }

          if (targetVariable == "highlight"){
            specialRange.begin = varIndicatorStart
            continue
          } else if (targetVariable == "\\highlight"){
            specialRange.end = varIndicatorStart
            continue
          } else if (targetVariable == 'main menu'){ // bot prints menu options
            continue;
          }
          
          const response = await axios({
            method: 'GET',
            baseURL: VFBaseURL,
            url: ''.concat('/state/', ver, '/user/', userID),
            headers: { Authorization: apiKey,}
          });

          if (targetVariable == "cartID"){
            let cartID = response.data.variables[targetVariable];
            
            //window.location.replace("http://localhost:8080/checkout?id=".concat(cartID));

            const checkoutURL = "http://localhost:8080/checkout?id=".concat(cartID)
            QRCode.toDataURL(checkoutURL, (err, url) => {
              if (err) {
                console.error(err);
              } else {
                imgUrl = url;
                isSpecial = false;

                let QRArgs:QRScanProps = {
                  title: 'Checkout',
                  qrDisplay: <CheckoutQR src={imgUrl}/>,
                  qrRightContent: (
                    <SmallText margin="10px">Scan this QR Code to pay with your phone.<br/>OR, press the QR Code to pay from this device.</SmallText>
                  ),
                }

                addElement(
                  createQRBubble(<a href={checkoutURL}><QRScan {...QRArgs}/></a>)
                );
              }
            });

          } else {
            if (!response.data.variables[targetVariable]){
              console.warn(targetVariable + ' is not a valid Voiceflow variable.');
              continue
            }
            list = smallTextifyList(response.data.variables[targetVariable]);
          }
        }

        if (specialRange.end == 0) {specialRange.end = res.length}

        speak(res);
        addHighlightedString(highlightifyString(isSpecial, res, list, specialRange));

      } else {
        console.warn("Received an unexpected data type: Item - ".concat(item));
      }
    }
  }

  const initVF = async () => {
    
    const reqBody = {
      "request": {
        "type": "launch",
      }
    };
    
    // await axios({
    //   method: 'DELETE',
    //   baseURL: VFBaseURL,
    //   url: ''.concat('/state/', ver, '/user/', userID),
    //   headers: { Authorization: apiKey,},
    // });

    const response = await axios({
      method: 'POST',
      baseURL: VFBaseURL,
      url: VFURL,
      headers: { Authorization: apiKey,},
      data: reqBody,
    });

    console.log(response)
    
    parseResponse(response.data);
  }

  const getResponse = async (requestText: string) => {
    if (requestText === ''){return false}
    addHighlightedString(highlightifyString(false, requestText, undefined, undefined));

    //TODO: Use Voiceflow API
    const reqBody = {
      request: {
        type: "text",
        payload: requestText,
      }
    };
    
    const response = await axios({
      method: 'POST',
      baseURL: VFBaseURL,
      url: VFURL,
      headers: { Authorization: apiKey,},
      data: reqBody,
    });

    // console.log(response.data);
    parseResponse(response.data);
  }

  let synth:SpeechSynthesis|undefined = undefined;
  
  //initialize the voiceflow session
  useEffect(() => {
    if (!isBegan) {
      setBegan(true);

      initVF();
    }

    synth = window.speechSynthesis;
  })
  
  const VBClicked = () => {
    if (!isWaiting){
      resetTranscript();
      if (synth) synth.cancel();
      SpeechRecognition.startListening();
    } else {
      SpeechRecognition.stopListening();
      // console.log(transcript);

      getResponse(transcript);
    }
    setIsWaiting(!isWaiting);
  }

  const speak = async (text: string) => {
    if (text != '') {
      const speakText = new SpeechSynthesisUtterance(text);
      speakText.onend = e => {
        console.log('Done speaking');
      }
      speakText.onerror = e => {
        console.log('Something went wrong');
      }
      if (synth) synth.speak(speakText);
    }
  }


  return (
    <LandingPageContainer>
      <LandingPageContent>
        <StyledSnowfall/>
        <LandingPage>
          <ScrollingList ref={scrollRef}>
            {displayHighlightedText()}
            {/* <HighlightedText labels={highlightedStrings}>
            </HighlightedText> */}
          </ScrollingList>
          <InputContainer>
            <SmartVoiceButton onClick={VBClicked} isPulsing={isWaiting} {...VBProps} {...VBArgs}/>
            <StyledFieldSet>
              <legend><SmallText>OR</SmallText></legend>
            </StyledFieldSet>
            <StyledTagGroup tags={[
              {children: "Place Order"},
              {children: "Cancel Order"},
              {children: "List Order"},
              {children: "Done"},
            ]} />
            <Submit onSubmit = {function(submission: string){
              if (synth) synth.cancel();
              getResponse(submission);
            }}/>
          </InputContainer>
        </LandingPage>
      </LandingPageContent>
    </LandingPageContainer>
  );
};

const StyledTagGroup = styled(TagGroup)`
  margin-left: auto;
  margin-right: auto;
  margin-bottom: 10px;
`;

const StyledSnowfall = styled(Snowfall)`
  position: absolute;
  zIndex: -1;
`;

const InputContainer = styled.div`
  ${Mixins.flex('column')};
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

const ScrollingList = styled.div`
  ${Mixins.scroll}
  &::-webkit-scrollbar {
    background-color: rgba(0, 0, 0, 0);
  }

  height: calc(100% - 250px);
  background: rgba(238, 238, 238, 0.25);
  padding: 10px;
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
`

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
  width: 60%;
  height: 100%;
  background: rgba(238, 238, 238, 0.6);
  padding: 1rem;
  border-radius: 5px;
  min-height: 300px;
  margin-left: auto;
  margin-right: auto;
  overflow: hidden; 
  overflow-y: auto;
  overflow-wrap: break-word; 
  position: relative;
  zIndex: 0;
`;

const TextBubble = styled.div<{ fromBot: boolean }>`
border: 1.5px solid rgba(0,0,0,0.1);
${({ theme, fromBot }): string =>
  fromBot ? `
  border-radius: 20px 20px 20px 5px;
  background-color:  ${theme.colors['background']};
  ` : 
  `
  border-radius: 20px 20px 5px 20px;
  background-color: ${theme.colors['primary']};
  `}
}
margin-bottom: 10px;  
`;

export default Landing;
