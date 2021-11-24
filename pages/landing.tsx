import type { NextPage } from "next";
import { Button, HighlightedText, HighlightedString, VoiceButton } from "@cheapreats/react-ui";
import React, {useEffect, useState} from 'react';


const Home: NextPage = () => {
    const [highlightedStrings, setHighlightedStrings] = useState<Array<HighlightedString>>([]);

    return (
      <div>
        <HighlightedText labels={highlightedStrings}>
        </HighlightedText>
        <VoiceButton>
        </VoiceButton>
      </div>
    );
  };