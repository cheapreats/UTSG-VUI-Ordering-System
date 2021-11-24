import type { NextPage } from "next";
import { Button, HighlightedText, HighlightedString, VoiceButton, ClickableSmallText, ScrollableListContent, VoiceButtonProps, ButtonProps } from "@cheapreats/react-ui";
import React, {useEffect, useState} from 'react';
import { Microphone } from '@styled-icons/fa-solid/Microphone';
import styled from 'styled-components';


const Landing: NextPage = () => {
  const [highlightedStrings, setHighlightedStrings] = useState<Array<HighlightedString>>([]);
  const [volume, setVolume] = useState<string>('0%');
  const [isWaiting, setIsWaiting] = useState<boolean>(true);

  let args = {
      disabled: false,
      isPulsing: isWaiting,
      icon: Microphone,
      iconSize: '20px',
      volume: volume,
      // color: '#e00',
      width: '100%',
      props: {
        "margin-left": 'auto',
        "margin-right": 'auto',
      },
  };
  
  let VBStyle = {
    justifyContent: 'center',
    'margin-left': 'auto',
    'margin-right': 'auto',
    width: '50%',
  }

  let testHighlightedStrings = [
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

  let VBProps: VoiceButtonProps = {
    buttonProps: {
      style: VBStyle,
    },
  }

  return (
    <LandingPage>
      <ScrollableListContent>
        <HighlightedText style={VBStyle} labels={testHighlightedStrings}>
        </HighlightedText>
        <VoiceButton {...VBProps} {...args}/>
      </ScrollableListContent>
    </LandingPage>
  );
};

  
const LandingPage = styled.div`
width: 50%;
color: #fff;
padding: 1rem;
border-radius: 5px;
min-height: 325px;
margin-left: auto;
margin-right: auto;
transform: translate(0, 25vh);
vertical-align: middle;
`;

export default Landing;