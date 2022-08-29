import React, { FC, useEffect, useRef, useState } from "react";
import { Camera } from "expo-camera";
import styled from "styled-components/native";
import { 
  Alert,
  BackHandler, 
  SafeAreaView, 
  Platform,
  ToastAndroid
} from "react-native";
import { WebView } from 'react-native-webview';
import SplashView from "./components/SplashView";
import CameraView from "./components/CameraView";
import DoubleTapToClose from "./components/DoubleTapToClose";

interface NavState {
  canGoBack: Boolean;
  canGoForward: Boolean;
  loading: Boolean;
  target?: number;
  title?: String;
  url?: String;
}

const INJECTED_CODE = `
(function() {
  function wrap(fn) {
    return function wrapper() {
      var res = fn.apply(this, arguments);
      window.ReactNativeWebView.postMessage(JSON.stringify({ type: 'NAV_STATE_CHANGE' }));
      return res;
    }
  }

  history.pushState = wrap(history.pushState);
  history.replaceState = wrap(history.replaceState);
  window.addEventListener('popstate', function() {
    window.ReactNativeWebView.postMessage(JSON.stringify({ type: 'NAV_STATE_CHANGE' }));
  });
})();

true;
`;

const App: FC = () => {
  const webviewRef = useRef<any>(null);
  const [isAppReady, setIsAppReady] = useState<boolean>(false);
  const [isWebViewReady, setIsWebviewReady] = useState<boolean>(false);
  const [navState, setNavState] = useState<NavState>();
  const [requestCamera, setRequestCamera] = useState<boolean>(false);
  const [guideImageUrl, setGuideImageUrl] = useState<string>();
  const [method, setMethod] = useState<string>();
  const [exitApp, setExitApp] = useState(0);
  const [status] = Camera.useCameraPermissions();
  

  useEffect(() => {
    async function wait2s() {
      try {
        await new Promise(resolve => setTimeout(resolve, 2000));
      } finally {
        setIsAppReady(true);
      }
    }
    wait2s();
  }, []);

  return (
      <Container os={Platform.OS}>
        <WebView
          style={{
            flex: 1,
            backgroundColor: '#121212',
            alignItems: "center",
            justifyContent: "center",
          }}
          ref={webviewRef}
          originWhitelist={["*"]}
          onNavigationStateChange={setNavState}
          onLoadStart={() => webviewRef.current?.injectJavaScript(INJECTED_CODE)}
          onLoadEnd={() => setIsWebviewReady(true)}
          onError={(syntheticEvent) => {
            Alert.alert(
              'Zerolife 오류',
              '서버와 연결이 되지 않습니다. 어플리케이션을 종료합니다.',
              [ { text: "OK", onPress: () => BackHandler.exitApp()} ]
            )
          }}
          onMessage={({nativeEvent}) => {
            const { type, guideImageUrl, method } = JSON.parse(nativeEvent.data);
            console.log(nativeEvent.data);
            if (type === 'NAV_STATE_CHANGE') {
              setNavState(nativeEvent)
            }

            if (type === 'REQ_CAMERA_PERMISSION') {
              setRequestCamera(true);
              setGuideImageUrl(guideImageUrl);
              setMethod(method);
            }
          }}
          // source={{ uri: 'https://zerolife.shop' }}
          source={{ uri: 'http://192.168.0.31:3000' }}
        />
        {/* {(!isAppReady || !isWebViewReady || !status?.granted) && <SplashView />} */}
        {requestCamera && 
          <CameraView 
            webviewRef={webviewRef}
            guideImageUrl={guideImageUrl}
            method={method}
            requestCamera={requestCamera}
            setRequestCamera={setRequestCamera}
          />
        }
        <DoubleTapToClose 
          requestCamera={requestCamera} 
          setRequestCamera={setRequestCamera}
        />
      </Container>
  );
 }
 
 export default App;

const Container = styled(SafeAreaView)<{ os: string }>`
  flex: 1;

`;