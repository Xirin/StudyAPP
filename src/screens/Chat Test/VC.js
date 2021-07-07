import React, {useState} from 'react';
import AgoraUIKit from 'agora-rn-uikit';

const VideoCallScreen = () => {
  const [videoCall, setVideoCall] = useState(true);
  const rtcProps = {
    appId: '573557ec13bc4538bdf45c56fe439e73',
    channel: 'test',
  };
  const callbacks = {
    EndCall: () => setVideoCall(false),
  };
  return videoCall ? (
    <AgoraUIKit rtcProps={rtcProps} callbacks={callbacks} />
  ) : (
    <Text onPress={()=>setVideoCall(true)}>Start Call</Text>
  );
};

export default VideoCallScreen;


import React, {Component} from 'react';
import AgoraUIKit from 'agora-rn-uikit';

export default class VideoCallScreen extends Component {
    constructor(props) {
        super(props);
        this.state = {
            videoCall: true,
            rtcProps: { 
                appID: '573557ec13bc4538bdf45c56fe439e73',
                channel: 'test',
                enableVideo: true
            }
        }
    }    

    render() {
        if(this.state.videoCall == true) {
            return (
                <AgoraUIKit rtcProps= {this.state.rtcProps} />
            )
        }
    }
}