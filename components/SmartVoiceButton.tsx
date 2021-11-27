
import { VoiceButton, VoiceButtonProps } from "@cheapreats/react-ui"
import React, {useEffect, useState, useRef} from 'react';

var UMStream: MediaStream | void;

var audioContext: AudioContext | void;
var analyser: AnalyserNode | void;
var microphone: MediaStreamAudioSourceNode | void;
var javascriptNode: ScriptProcessorNode | void;
var isWaiting: boolean;

export const SmartVoiceButton: React.FC<VoiceButtonProps> = ({
    onClick,
    isPulsing,
    ...props
}) => {
    const [volume, setVolume] = useState<string>('0%');
    isWaiting = isPulsing || false;

    useEffect(() => {
        // Anything in here is fired on component mount.
        return () => {
            // Anything in here is fired on component unmount.
            if (UMStream) UMStream.getTracks().forEach(function(track) {
                if (track.kind === 'audio'){
                    track.stop();
                }
                UMStream = undefined;
            });

            if (audioContext && audioContext.state != 'closed'){
                audioContext.close().then(function(){
                    analyser?.disconnect()
                    microphone?.disconnect()
                    javascriptNode?.disconnect()

                    analyser = undefined;
                    microphone = undefined;
                    javascriptNode = undefined;
                })
            }
        }
    }, [])

    const extendedOnClick = (event: React.MouseEvent<Element, MouseEvent>):void => {
        
        isWaiting = !isWaiting;
        // console.log("I've been clicked.", isWaiting);

        if (onClick) onClick(event);
    }

    if (!UMStream) navigator.mediaDevices.getUserMedia({ audio: true })
    .then(function(stream) {
        if ((!audioContext) || (!analyser) || (!microphone) || (!javascriptNode)){
            audioContext = new AudioContext();
            analyser = audioContext.createAnalyser();
            microphone = audioContext.createMediaStreamSource(stream);
            javascriptNode = audioContext.createScriptProcessor(2048, 1, 1);
        }

        UMStream = stream;
        
        analyser.smoothingTimeConstant = 0.8;
        analyser.fftSize = 1024;
        
        microphone.connect(analyser);
        analyser.connect(javascriptNode);
        javascriptNode.connect(audioContext.destination);
        javascriptNode.onaudioprocess = function() {
            
            if (analyser){
                var array = new Uint8Array(analyser.frequencyBinCount);
                analyser?.getByteFrequencyData(array);
                var values = 0;
            
                var length = array.length;
                for (var i = 0; i < length; i++) {
                    values += (array[i]);
                }
            
                var average = values / length;
    
                // console.log(isWaiting);
                if (!isWaiting) average = 0;
                setVolume(average.toString() + "%");
            }
        
        }

        })
        .catch(function(err) {
            /* handle the error */
    });
        

    return <VoiceButton onClick={extendedOnClick} isPulsing={isWaiting} volume={volume} {...props}/>
}

export default SmartVoiceButton;