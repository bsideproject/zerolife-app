import React, { FC, useEffect, useRef, useState } from "react";
import { Camera } from "expo-camera";
import styled from "styled-components/native";
import { 
  View, 
  TouchableOpacity, 
  Image,
  ImageBackground, 
  Text
} from "react-native";

const CameraView = (props) => {
    const { setRequestCamera, webviewRef } = props;
    const [type, setType] = useState(Camera.Constants.Type.back);
    const cameraRef = useRef(null);

    return (
        <View
          style={{
            position: "relative",
            width: "100%",
            height: "100%",
            backgroundColor: "white",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Camera 
            style={{ 
              width: "100%", 
              alignItems: "center", 
              justifyContent: "center", 
              aspectRatio: 1
            }}
            ratio={"1:1"}
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
          <View
            style={{
              position: "absolute",
              top: "85%"
            }}
          >
            <Text
              style={{
                color: "#000000",
                fontWeight: "500",
                fontSize: 16,
                lineHeight: 24
              }}
            >
              프레임 모양에 맞춰 찍어주세요!
            </Text>
          </View>
          <TouchableOpacity
              style={{
                alignItems: "center",
                position: "absolute",
                top: "90%",
                width: 60,
                height: 60,
              }}
              onPress={async () => {
                if (cameraRef.current) {
                  let photo = await cameraRef.current.takePictureAsync({
                    base64: true
                  });
                  const { base64, ...less } = photo;
                  console.log(less);

                  webviewRef.current?.postMessage(
                    JSON.stringify({
                      type: 'image/jpg', 
                      file: { 
                        name: `picture-[${Date.now()}].jpg`, 
                        type: 'image/jpg',
                        ...photo
                      }
                    })
                  );
                  setRequestCamera(false);
                  console.log("Send!!");
                }
              }}
            >
              <Image
                source={require('../assets/camera.png')}
                style={{
                  borderRadius: 50,
                  width: 60,
                  height: 60,
                }}
              />
            </TouchableOpacity>
        </View>
    )
}

export default CameraView;