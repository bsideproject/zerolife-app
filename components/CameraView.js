import React, { FC, useEffect, useRef, useState } from "react";
import { Camera } from "expo-camera";
import styled from "styled-components/native";
import { 
  View, 
  TouchableOpacity, 
  ImageBackground 
} from "react-native";

const CameraView = (props) => {
    const { setRequestCamera, webviewRef } = props;
    const [type, setType] = useState(Camera.Constants.Type.back);
    const [lastPhotoURI, setLastPhotoURI] = useState(null);
    const cameraRef = useRef(null);

    return (
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
                source={require('../assets/tumbler.png')}
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
                  setRequestCamera(false);
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
        </View>
    )
}

export default CameraView;