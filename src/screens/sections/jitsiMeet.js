import React, { useEffect } from 'react';
import { SafeAreaView } from 'react-native';
// import JitsiMeet, { JitsiMeetView } from 'react-native-jitsi-meet';
import 'react-native-gesture-handler';
const VideoCall = ({ route }) => {
  // const Data=route.params.data.data;
  console.log("Route Params inside the jitsiMeet..........", route)
  const onConferenceTerminated = (nativeEvent) => {
    /* Conference terminated event */
    console.log('conference terminated joined')

  }

  const onConferenceJoined = (nativeEvent) => {
    // meetFeatureFlags();
    console.log('conference joined')
  }

  const onConferenceWillJoin = (nativeEvent) => {
    /* Conference will join event */
    console.log('conference will joined')

  }

  useEffect(() => {
    //setTimeout(() => {
    // const url = `https://conf.edusity.com/${Data.room}`; // can also be only room name and will connect to jitsi meet servers
    // const userInfo = { displayName: Data.name, email:  Data.email, avatar: ''};
    // const options = {
    //   audioMuted: false,
    //   audioOnly: false,
    //   videoMuted: false,
    //   subject: "your subject",
    //   token: Data.token
    // }
    const meetFeatureFlags = {
      addPeopleEnabled: true,
      calendarEnabled: true,
      callIntegrationEnabled: true,
      chatEnabled: true,
      closeCaptionsEnabled: true,
      inviteEnabled: true,
      androidScreenSharingEnabled: true,
      liveStreamingEnabled: true,
      meetingNameEnabled: true,
      meetingPasswordEnabled: true,
      pipEnabled: true,
      kickOutEnabled: true,
      conferenceTimerEnabled: true,
      videoShareButtonEnabled: true,
      recordingEnabled: true,
      reactionsEnabled: true,
      raiseHandEnabled: true,
      tileViewEnabled: true,
      toolboxAlwaysVisible: false,
      toolboxEnabled: true,
      welcomePageEnabled: false,
    }
    // JitsiMeet.call(url, userInfo, options, meetFeatureFlags);

    /* You can also use JitsiMeet.audioCall(url) for audio only call */
    /* You can programmatically end the call with JitsiMeet.endCall() */
    //}, 1000);
  }, [])

  return (
    <SafeAreaView style={{ backgroundColor: 'white', flex: 1 }}>
      {/* <JitsiMeetView onConferenceTerminated={onConferenceTerminated} onConferenceJoined={onConferenceJoined} onConferenceWillJoin={onConferenceWillJoin} style={{ flex: 1, height: '100%', width: '100%' }} /> */}
    </SafeAreaView>
  )
}

export default VideoCall;