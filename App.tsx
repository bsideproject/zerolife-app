import React, { FC, useEffect, useRef, useState } from "react";
import styled from "styled-components/native";
import { BackHandler, SafeAreaView, Platform, StatusBar } from "react-native";
import { WebView } from 'react-native-webview';

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
      window.ReactNativeWebView.postMessage('navigationStateChange');
      return res;
    }
  }

  history.pushState = wrap(history.pushState);
  history.replaceState = wrap(history.replaceState);
  window.addEventListener('popstate', function() {
    window.ReactNativeWebView.postMessage('navigationStateChange');
  });
})();

true;
`;

const App: FC = () => {
  const webviewRef = useRef<any>(null);
  const [navState, setNavState] = useState<NavState>();
  
  useEffect(() => {
    const onPress = () => {
      if(navState?.canGoBack) {
        webviewRef.current?.goBack?.();
        /**
         * When true is returned the event will not be bubbled up
         * & no other back action will execute
         */
        return true;
      } else {
        return false;
      }
    }
    
    BackHandler.addEventListener('hardwareBackPress', onPress);
    return () => {
      BackHandler.removeEventListener('hardwareBackPress', onPress);
    }
  }, [navState?.canGoBack, webviewRef.current])

  return (
      <Container os={Platform.OS}>
        <WebView
        ref={webviewRef}
        originWhitelist={["*"]}
        onNavigationStateChange={setNavState}
        onLoadStart={() => webviewRef.current?.injectJavaScript(INJECTED_CODE)}
        onMessage={({nativeEvent}) => {
          if (nativeEvent.data === 'navigationStateChange') {
            setNavState(nativeEvent)
          }
        }}
        source={{ uri: 'https://m.naver.com/' }}
      />
      </Container>
  );
 }
 
 export default App;

const Container = styled(SafeAreaView)<{ os: string }>`
  flex: 1;
  padding-top: ${props => props.os === 'android' ? StatusBar.currentHeight : 0 };
`;