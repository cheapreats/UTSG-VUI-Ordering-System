import type { NextPage } from "next";
import { Button, HighlightedText, HighlightedString, VoiceButton, ClickableSmallText, ScrollableListContent, VoiceButtonProps, ButtonProps } from "@cheapreats/react-ui";
import React, {useEffect, useState, useRef} from 'react';
import { Microphone } from '@styled-icons/fa-solid/Microphone';
import styled from 'styled-components';
import {CartItem} from '../components';
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';
const axios = require('axios');

var userID = '1';
const ver = '61a016e9aacf9300069da9be';
const VFBaseURL = 'https://general-runtime.voiceflow.com';
const VFURL = ''.concat('/state/', ver, '/user/', userID, '/interact');
const apiKey = 'VF.61a1370a341ed7001c8e93e8.t7VKYPofdIS3X91hkvquHSTHJeQIMJpuL6RP2U1lt7';

const args = {
  disabled: false,
  icon: Microphone,
  iconSize: '20px',
  // color: '#e00',
  width: '100%',
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
height: '5vh',
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

const VBProps: VoiceButtonProps = {
  buttonProps: {
    style: VBStyle,
  },
}


const Landing: NextPage = () => {
  const [highlightedStrings, setHighlightedStrings] = useState<Array<HighlightedString>>([]);
  const [numStrings, setNumStrings] = useState<number>(0);
  const [volume, setVolume] = useState<string>('0%');
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

  const highlightifyString = (fromBot: boolean, text: string):HighlightedString => {
    let txtAlign:string = 'right';
    if (fromBot){
      txtAlign = 'left';
      text = 'Bot:\n' + text;
    } else {
      text = 'You:\n' + text;
    }

    let margin_left:string = 'auto'; 
    let margin_right:string = '0';
    if (fromBot) {
      margin_left = '0'; 
      margin_right = 'auto';
    }

    return {
      text: text,
      isSpecial: false,
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

  const parseResponse = (resData: any):void => {
    
    console.log(resData);
    for (var item of resData) {
      if (item.type == "speak" && item.payload.type == "message"){
        let res: string = item.payload.message;
        speak(res);
        addHighlightedString(highlightifyString(true, res));
      } else {
        console.warn("Received an unexpected data type.");
      }
    }
  }

  const initVF = async () => {
    
    const reqBody = {
      "request": {
        "type": "launch",
      }
    };
    
    const response = await axios({
      method: 'POST',
      baseURL: VFBaseURL,
      url: VFURL,
      headers: { Authorization: apiKey,},
      data: reqBody,
    });
    
    parseResponse(response.data);
  }

  const getResponse = async (requestText: string) => {
    addHighlightedString(highlightifyString(false, requestText));

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
          <VoiceButton onClick={VBClicked} isPulsing={isWaiting} volume={volume} {...VBProps} {...args}/>
        </LandingPage>
      </LandingPageContent>
    </LandingPageContainer>
  );
};

const ScrollingList = styled.div`
height: 48vh; 
overflow: hidden; 
overflow-y: scroll;
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
height: 60%;
color: #fff;
background: #eee;
padding: 1rem;
border-radius: 5px;
min-height: 400px;
margin-left: auto;
margin-right: auto;
`;

export default Landing;