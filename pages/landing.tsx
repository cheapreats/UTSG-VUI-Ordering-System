import type { NextPage } from "next";
import { Button, SmallText, HighlightedText, HighlightedString, ClickableSmallText, ScrollableListContent, VoiceButtonProps, ButtonProps } from "@cheapreats/react-ui";
import React, {useEffect, useState, useRef} from 'react';
import { Microphone } from '@styled-icons/fa-solid/Microphone';
import styled from 'styled-components';
import {CartItem, SmartVoiceButton, Submit} from '../components';
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';
const axios = require('axios');

var userID = '1';
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

const testHighlightedStrings = [
{
    text: 'Ordering a',
    isSpecial: false,
},
{
    text: 'Burger',
    isSpecial: true,
    listItemsArgs: [],
    listItemsBodies: [
        <ClickableSmallText>Burger</ClickableSmallText>, 
        <ClickableSmallText>Fries</ClickableSmallText>
    ],
},
{
    text: 'from',
    isSpecial: false,
},
{
    text: 'Wendy\'s',
    isSpecial: true,
    listItemsArgs: [],
    listItemsBodies: [
        <ClickableSmallText>{'Wendy\'s'}</ClickableSmallText>, 
        <ClickableSmallText>Burger King</ClickableSmallText>
    ],
},
]

const VBProps: any = {
  buttonProps: {
    style: VBStyle,
  },
}


const Landing: NextPage = () => {
  const [highlightedStrings, setHighlightedStrings] = useState<Array<HighlightedString>>([]);
  const [numStrings, setNumStrings] = useState<number>(0);
  const [isWaiting, setIsWaiting] = useState<boolean>(false);
  const [cart, setCart] = useState<Array<CartItem>>([]);
  const [isBegan, setBegan] = useState<boolean>(false);

  const {
    transcript,
    listening,
    resetTranscript,
    browserSupportsSpeechRecognition
  } = useSpeechRecognition();

  const nextHighlightedStrings = highlightedStrings.slice()
  const addHighlightedString = (HString: HighlightedString): void => {
    nextHighlightedStrings.push(HString);
    setHighlightedStrings(nextHighlightedStrings);
    setNumStrings(nextHighlightedStrings.length);
  }

  if (!browserSupportsSpeechRecognition) {
    console.warn("Browser doesn't support speech recognition.");
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

    return {
      text: text,
      isSpecial: isSpecial,
      listItemsBodies: list,
      textProps: {
        textAlign: txtAlign,
        type: 'div',
        style:{
          width: '80%',
          marginLeft: margin_left,
          marginRight: margin_right,
        },
      },
    };
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
            
            window.location.replace("http://localhost:8080/checkout?id=".concat(cartID));
            return
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
    
    await axios({
      method: 'DELETE',
      baseURL: VFBaseURL,
      url: ''.concat('/state/', ver, '/user/', userID),
      headers: { Authorization: apiKey,},
    });

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
    <LandingPageContainer>
      <LandingPageContent>
        <LandingPage>
          <ScrollingList>
            <HighlightedText labels={highlightedStrings}>
            </HighlightedText>
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
  );
};

const ScrollingList = styled.div`
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

export default Landing;