import type { NextPage } from "next";
import { Button, SmallText, HighlightedText, HighlightedString, ClickableSmallText, ScrollableListContent, VoiceButtonProps, ButtonProps, Mixins, BaseStyles, Heading } from "@cheapreats/react-ui";
import { NavigationBar, INavigationBarProps } from "@cheapreats/react-ui";
import React, {useEffect, useState, useRef} from 'react';
import { Microphone } from '@styled-icons/fa-solid/Microphone';
import styled from 'styled-components';
import {CartItem, SmartVoiceButton, Submit} from '../components';
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';
import QRCode from 'qrcode';
import Theme from "@cheapreats/react-ui/dist/Themes/ThemeTemplate";
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
  width: '50%',
  height: '50px',
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
let imgUrl;

const Landing: NextPage = () => {
  const [highlightedStrings, setHighlightedStrings] = useState<Array<HighlightedString>>([]);
  const [numStrings, setNumStrings] = useState<number>(0);
  const [isWaiting, setIsWaiting] = useState<boolean>(false);
  const [cart, setCart] = useState<Array<CartItem>>([]);
  const [isBegan, setBegan] = useState<boolean>(false);

  const {
    transcript,
    listening,
    resetTranscript
  } = useSpeechRecognition();

  const nextHighlightedStrings = highlightedStrings.slice()
  const addHighlightedString = (HString: HighlightedString): void => {
    nextHighlightedStrings.push(HString);
    setHighlightedStrings([...nextHighlightedStrings]);
    // setNumStrings(nextHighlightedStrings.length);
  }

  const highlightifyString = (fromBot: boolean, text: string, list: undefined | Array<any>):HighlightedString => {
    let txtAlign = 'right';
    if (fromBot){
      txtAlign = 'left';
      text = 'Bot:\n' + text;
    } else {
      text = 'You:\n' + text;
    }

    let margin_left = 'auto'; 
    let margin_right = '0';
    if (fromBot) {
      margin_left = '0'; 
      margin_right = 'auto';
    }

    let isSpecial = false;
    if (list){
      isSpecial = true;
    }

    const textMarginSize = '10px'

    return {
      text: text,
      isSpecial: isSpecial,
      listItemsBodies: list,
      isRight: fromBot,
      listProps: {
        // dropdownButton: <div/>,
        beginOpen: true,
        right: false,
        style:{
          // width: '80%',
          left: '1px',
          marginLeft: textMarginSize,
          marginRight: textMarginSize,
        },
      },
      textProps: {
        textAlign: txtAlign,
        type: 'div',
        style:{
          // width: '80%',
          marginLeft: textMarginSize,
          marginRight: textMarginSize,
        },
      },
    };
  }

  const marginSize = '10px'
  const createTextBubble = (highlightedString: HighlightedString):React.ReactElement => {
    let margin_left = 'auto'; 
    let margin_right = marginSize;
    if (highlightedString.isRight) {
      margin_left = marginSize; 
      margin_right = 'auto';
    }
    
    let textBubbleStyle = {
      width: 'fit-content',
      marginLeft: margin_left,
      marginRight: margin_right,
    }
    
    return (
      <TextBubble style={textBubbleStyle}>
        <div>
          <HighlightedText labels={[highlightedString]}/>
        </div>
      </TextBubble>
    )
  }

  const displayHighlightedText = ():React.ReactElement => {
    
    return <>
      {highlightedStrings.map((_, i) => (
          // <TextBubble style={{width: 'fit-content'}}>
          //   <div>
          //     <HighlightedText labels={[highlightedStrings[i]]}/>
          //   </div>
          // </TextBubble>
          createTextBubble(highlightedStrings[i])
      ))}
    </>
  }

  const smallTextifyList = (strings: Array<string>):Array<any> => {
    let smallTexts: Array<any> = []
    for (var str of strings) {
      smallTexts.push(<SmallText>{str}</SmallText>);
    }
    return smallTexts
  }


  const parseResponse = async (resData: any) => {
    for (var item of resData) {
      if (item.type == "speak" && item.payload.type == "message"){
        let res: string = item.payload.message;

        let list:Array<any> | undefined = undefined;
        if (item.payload.message.indexOf('[') != -1){
          console.warn("Received a list.");
          
          let varIndicatorStart: number = item.payload.message.indexOf('[')
          let varIndicatorEnd: number = item.payload.message.indexOf(']')
          
          const response = await axios({
            method: 'GET',
            baseURL: VFBaseURL,
            url: ''.concat('/state/', ver, '/user/', userID),
            headers: { Authorization: apiKey,}
          });

          let targetVariable: string = item.payload.message.substring(varIndicatorStart + 1, varIndicatorEnd);
          res = res.replace(''.concat('[', targetVariable, ']'), "");

          if (targetVariable == "cartID"){
            let cartID = response.data.variables[targetVariable];
            
            //window.location.replace("http://localhost:8080/checkout?id=".concat(cartID));
            //return

            const checkoutURL = "http://localhost:8080/checkout?id=".concat(cartID)
            QRCode.toDataURL(checkoutURL, (err, url) => {
              if (err) {
                console.error(err);
              }
              else {
                imgUrl = url;
                list = [<a href={checkoutURL}><CheckoutQR src={imgUrl}/></a>];
                console.log("Checkout is at: " + checkoutURL);
              }
            });

          } else {
            list = smallTextifyList(response.data.variables[targetVariable]);
          }

          console.log(response.data)
        }


        speak(res);
        addHighlightedString(highlightifyString(true, res, list));

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

  const getVendorNavigationBarProps = (): INavigationBarProps => ({
    navigationBarItems: [
        {
            label: 'Home',
        },
        {
            label: 'Delivery',
        },
        {
            label: 'PickUp',
        },
        {
            label: 'Cart'
        },
    ],
  })

  const getResponse = async (requestText: string) => {
    if (requestText === ''){return false}
    addHighlightedString(highlightifyString(false, requestText, undefined));

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
  
  //initialize the voiceflow session
  useEffect(() => {
    if (!isBegan) {
      setBegan(true);

      initVF();
    }
  })
  
  const VBClicked = () => {
    if (!isWaiting){
      resetTranscript();
      synth.cancel();
      SpeechRecognition.startListening();
    } else {
      SpeechRecognition.stopListening();
      // console.log(transcript);

      getResponse(transcript);
    }
    setIsWaiting(!isWaiting);
  }

  const synth = window.speechSynthesis;

  const speak = async (text: string) => {
    if (text != '') {
      const speakText = new SpeechSynthesisUtterance(text);
      speakText.onend = e => {
        console.log('Done speaking');
      }
      speakText.onerror = e => {
        console.log('Something went wrong');
      }
      synth.speak(speakText);
    }
  }


  return (
    <SuperContainer>
      <NavigationBarContainer>
        <img
          src='https://www.cheapreats.com/static/90939a6dc8dacea8e44d046c72521a1b/16c7d/logo.png'
          width='50px'
          alt='CheaprEats logo'
        />
        <Heading color='primary'>CheaprEats</Heading>
        <NavigationBar {...getVendorNavigationBarProps()} />
      </NavigationBarContainer>
      <LandingPageContainer>
        <LandingPageContent>
          <LandingPage>
            <ScrollingList>
              {displayHighlightedText()}
              {/* <HighlightedText labels={highlightedStrings}>
              </HighlightedText> */}
            </ScrollingList>
            <SmartVoiceButton onClick={VBClicked} isPulsing={isWaiting} {...VBProps} {...VBArgs}/>
            <br></br>
            <Submit onSubmit = {function(submission: string){
              synth.cancel()
              getResponse(submission)
            }}/>
          </LandingPage>
        </LandingPageContent>
      </LandingPageContainer>
    </SuperContainer>
  );
};

const NavigationBarContainer = styled.div`
  ${Mixins.flex('row')};
`;

const SuperContainer = styled.div`
`;

const ScrollingList = styled.div`
  ${Mixins.scroll}
  height: calc(100% - 100px); 
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
`;

const LandingPage = styled.div`
width: 60%;
height: 80vh;
color: #fff;
background: #eee;
padding: 1rem;
border-radius: 5px;
min-height: 300px;
margin-left: auto;
margin-right: auto;
`;

const TextBubble = styled.div`
border: 1.5px solid rgba(0,0,0,0.1);
border-radius: 20px; 
margin-bottom: 10px;  
`;

export default Landing;
