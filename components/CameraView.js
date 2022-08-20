import React, { FC, useEffect, useRef, useState } from "react";
import { Camera } from "expo-camera";
import { manipulateAsync, FlipType, SaveFormat } from 'expo-image-manipulator';
import MissionTextGuide from "./MissionTextGuide";
import { 
  View, 
  TouchableOpacity, 
  Image,
  ImageBackground, 
  Text,
  StyleSheet,
  Alert
} from "react-native";

const styles = StyleSheet.create({
  cameraViewWrapper: {
    position: "relative",
    width: "100%",
    height: "100%",
    backgroundColor: "white",
    alignItems: "center",
    justifyContent: "center",
  },
  cameraView: {
    width: "100%", 
    alignItems: "center",
    justifyContent: "center",
    aspectRatio: 1
  },
  imageGuideMask: {
    backgroundColor: "transparent",
    flexDirection: "row",
    top: "10%",
    left: "10%",
    width: "80%",
    height: "80%",
    opacity: 0.5 
  },
  captureGuideMethod: {
    color: "#000000",
    fontWeight: "500",
    fontSize: 16,
    lineHeight: 24
  },
  captureButton: {
    alignItems: "center",
    position: "absolute",
    top: "90%",
    width: 60,
    height: 60,
  },
  captureButtonIcon: {
    borderRadius: 50,
    width: 60,
    height: 60,
  }
});

const CameraView = (props) => {
    const { requestCamera, setRequestCamera, webviewRef, guideImageUrl, method } = props;
    const [ type, setType ] = useState(Camera.Constants.Type.back);
    const [ textGuideVisible, setTextGuideVisible ] = useState(false);
    const [ isGranted, setIsGranted ] = useState(false);
    const cameraRef = useRef(null);

    const getCameraPermission = async () => {
      const result = await Camera.requestCameraPermissionsAsync();
        if(result.granted) {
          setIsGranted(true);
        } else {
          setRequestCamera(false);  
        }
    }

    const initCamera = async () => {
      const permission = await Camera.getCameraPermissionsAsync();
      if(!permission?.canAskAgain) {
        Alert.alert(
          "카메라 권한 요청", 
          "어플리케이션 설정에서 zerolife 앱의 카메라 권한을 허용해주세요."
        );
      }
      if (!permission?.granted) {
        getCameraPermission();            
      } else {
        setIsGranted(true);
      }
    } 

    useEffect(() => {
      if(requestCamera) {
        setTextGuideVisible(true);
        initCamera();
      }
    }, [requestCamera]);

    return requestCamera && isGranted
          ? <View style={styles.cameraViewWrapper}>
            <View>
              <Camera 
                style={styles.cameraView}
                ratio={"1:1"}
                type={type} 
                ref={cameraRef}
              />
              <View style={{ position: "absolute", width: "100%", height: "100%" }}>
                {textGuideVisible 
                  ? <MissionTextGuide 
                    description={method}
                    setTextGuideVisible={setTextGuideVisible}
                  />
                  : <View style={styles.imageGuideMask}>
                    <ImageBackground
                      source={{
                        uri: guideImageUrl,
                      }}
                      style={{
                        flex: 1,
                        backgroundColor: "transparent",
                      }}
                    />
                  </View>
                }
              </View>
            </View>
            <View
              style={{
                position: "absolute",
                top: "85%"
              }}
            >
              <Text
                style={styles.captureGuideMethod}
              >
                프레임 모양에 맞춰 찍어주세요!
              </Text>
            </View>
            <TouchableOpacity
                style={styles.captureButton}
                onPress={async () => {
                  if (cameraRef.current) {
                    let photo = await cameraRef.current.takePictureAsync();
                    const manipResult = await manipulateAsync(
                      photo.uri,
                      [
                        { resize: {height: 512, width: 512} }
                      ],
                      { 
                        base64: true,
                        compress: 1, 
                        format: SaveFormat.JPEG 
                      }
                    );

                    webviewRef.current?.postMessage(
                      JSON.stringify({
                        type: 'image/jpg', 
                        file: { 
                          name: `picture-[${Date.now()}].jpeg`, 
                          type: 'image/jpeg',
                          ...photo,
                          base64: manipResult.base64
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
                  style={styles.captureButtonIcon}
                />
              </TouchableOpacity>
          </View>
          : <></>;
}

export default CameraView;