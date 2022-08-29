import * as React from 'react';
import {useEffect, useState} from 'react';
import {Platform, BackHandler, ToastAndroid} from 'react-native';

//https://stackoverflow.com/questions/52253072/react-native-double-back-press-to-exit-app
export const ExecuteOnlyOnAndroid = (props) => {
  const {requestCamera, setRequestCamera} = props;
  const [exitApp, setExitApp] = useState(0);
  const backAction = () => {
    if(requestCamera) { 
        setRequestCamera(false);
        return true;
    };

    setTimeout(() => {
      setExitApp(0);
    }, 2000); // 2 seconds to tap second-time

    if (exitApp === 0) {
      setExitApp(exitApp + 1);

      ToastAndroid.show('뒤로 버튼을 한번 더 누르면 앱을 종료합니다.', ToastAndroid.SHORT);
    } else if (exitApp === 1) {
      BackHandler.exitApp();
    }
    return true;
  };
  useEffect(() => {
    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      backAction,
    );
    return () => backHandler.remove();
  });
  return <></>;
};

export default function DoubleTapToClose(props) {
  const {requestCamera, setRequestCamera} = props;
  return Platform.OS !== 'ios' ? (
    <ExecuteOnlyOnAndroid 
        requestCamera={requestCamera}
        setRequestCamera={setRequestCamera}
    />
  ) : (
    <></>
  );
}