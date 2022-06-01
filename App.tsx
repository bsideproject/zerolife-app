import React, { FC, useEffect, useRef, useState } from "react";
import { Camera } from "expo-camera";
import styled from "styled-components/native";
import { 
  BackHandler, 
  SafeAreaView, 
  Platform, 
  StatusBar, 
  View, 
  Text, 
  TouchableOpacity, 
  Button,
  ImageBackground 
} from "react-native";
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

const RequestCameraPermissionButton = () => {
  const [status, requestPermission] = Camera.useCameraPermissions();
  return (
    <View
      style={{ flex: 1, justifyContent: "center", alignContent: "center" }}
    >
      <Text style={{ textAlign: "center" }}>
        We need access to your camera
      </Text>
      <Button onPress={requestPermission} title="Grant permission" />
    </View>
  );
}

const App: FC = () => {
  const webviewRef = useRef<any>(null);
  const [navState, setNavState] = useState<NavState>();
  const [alertPermission, setAlertPermission] = useState<boolean>(false);
  const [status, requestPermission] = Camera.useCameraPermissions();
  const [type, setType] = useState(Camera.Constants.Type.back);
  const [lastPhotoURI, setLastPhotoURI] = useState(null);
  const cameraRef = useRef(null);

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
  }, [navState?.canGoBack, webviewRef.current]);

  if(!status?.granted) {
    return (
      <View
        style={{ flex: 1, justifyContent: "center", alignContent: "center" }}
      >
        <Text style={{ textAlign: "center" }}>
          We need access to your camera
        </Text>
        <Button onPress={requestPermission} title="Grant permission" />
      </View>
    );
  }

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
          onMessage={({nativeEvent}) => {
            const { type } = JSON.parse(nativeEvent.data);
            console.log(nativeEvent.data);
            if (type === 'NAV_STATE_CHANGE') {
              setNavState(nativeEvent)
            }

            if (type === 'REQ_CAMERA_PERMISSION') {
              setAlertPermission(true);
            }
          }}
          source={{ uri: 'http://192.168.0.31:3000/test' }}
        />
        {alertPermission && 
        <View
          style={{
            position: "absolute",
            width: "100%",
            height: "100%",
            backgroundColor: "transparent",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Camera 
            style={{ width: "70%", height: "50%", alignItems: "center", justifyContent: "center", }}
            type={type} 
            ref={cameraRef}
          >
            <View
              style={{
                backgroundColor: "transparent",
                flexDirection: "row",
                top: "-10%",
                width: "50%",
                height: "50%",
                opacity: 0.5 
              }}
            >
              <ImageBackground
                source={require('./pngwing.com.png')}
                style={{
                  flex: 1,
                  backgroundColor: "transparent",
                }}
              />
            </View>
          </Camera>
          <TouchableOpacity
              style={{
                alignItems: "center",
                position: "absolute",
                top: "60%",
                width: 60,
                height: 60,
              }}
              onPress={async () => {
                if (cameraRef.current) {
                  let photo = await cameraRef.current.takePictureAsync();
                  setLastPhotoURI(photo.uri);
                  console.log(photo.uri);

                  webviewRef.current?.postMessage(
                    JSON.stringify({
                      type: "PICTURE", 
                      message: "Hello RN Webview2",
                      file: { uri: photo.uri, name: `picture-[${Date.now()}].jpg`, type: 'image/jpg' }
                    })
                  );
                  setAlertPermission(false);
                  console.log("Send!!");
                }
              }}
            >
              <View 
                style={{ 
                  backgroundColor: "red", 
                  borderWidth: 8,
                  borderColor: "grey",
                  borderRadius: 50,
                  width: 60,
                  height: 60,
                  position: "absolute",
                }}
              />
            </TouchableOpacity>
        </View>}
      </Container>
  );
 }
 
 export default App;

const Container = styled(SafeAreaView)<{ os: string }>`
  flex: 1;
  padding-top: ${props => props.os === 'android' ? StatusBar.currentHeight : 0 }px;
`;