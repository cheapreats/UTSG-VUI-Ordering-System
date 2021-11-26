import type { NextPage } from "next";
import { Button, HighlightedText, HighlightedString, VoiceButton, ClickableSmallText, ScrollableListContent, VoiceButtonProps, ButtonProps } from "@cheapreats/react-ui";
import React, {useEffect, useState, useRef} from 'react';
import { Microphone } from '@styled-icons/fa-solid/Microphone';
import styled from 'styled-components';
import {CartItem} from '../components';
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';

var userID = '1';
const ver = '61a016e9aacf9300069da9be';
const VFURL = 'https://general-runtime.voiceflow.com/state/'.concat(ver, '/user/', userID, '/interact');
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

  const parseResponse = (res: string, newHighlightedStrings: Array<HighlightedString>):void => {
    // console.log(res.status);
    // console.log(res.text);
    console.log(JSON.parse(res));
    console.log("Hello.");
    // data = res
    // for (var item of JSON.parse(data)) {
    //   if (item.type == "speak" && item.payload.type == "message"){
    //     let res: string = item.payload.message;
    //     speak(res);
    //     newHighlightedStrings.push(highlightifyString(true, res));
    //     setHighlightedStrings(newHighlightedStrings);
    //   } else {
    //     console.warn("Received an unexpected data type.");
    //   }
    // }
  }

  const getResponse = async (requestText: string) => {
    let newHighlightedStrings: Array<HighlightedString> = highlightedStrings.slice();
    newHighlightedStrings.push(highlightifyString(false, requestText));
    setHighlightedStrings(newHighlightedStrings);

    //TODO: Use Voiceflow API
    const reqBody = {
      request: {
        type: "text",
        payload: requestText,
      }
    };
    
    console.log(VFURL);
    fetch(VFURL, {
      method: 'POST',
      headers: { Authorization: apiKey,},
      data: reqBody,
      // mode: 'no-cors',
    })
    .then(res => res.text())
    .then(res => {
      parseResponse(res, newHighlightedStrings);
    })
  }
  
  //initialize the voiceflow session
  useEffect(() => {
    if (!isBegan) {
      let newHighlightedStrings: Array<HighlightedString> = highlightedStrings.slice();

      let reqBody = {
        "request": {
          "type": "launch",
        }
      };
      
      fetch(VFURL, {
        method: 'POST',
        headers: { Authorization: apiKey,},
        body: JSON.stringify(reqBody),
      })
      .then(res => res.text())
      .then(res => {
        parseResponse(res, newHighlightedStrings);
      })

      setBegan(true);
    }
  })
  
  const VBClicked = () => {
    if (!isWaiting){
      resetTranscript();
      SpeechRecognition.startListening();
    } else {
      SpeechRecognition.stopListening();
      
      // console.log(transcript);

      getResponse(transcript);
    }
    setIsWaiting(!isWaiting);
  }

  const synth = window.speechSynthesis;

  const speak = (text: string) => {
    //Check if speaking
    if (synth.speaking) {
      console.error('Already speaking');
      return;
    }
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