import { useEffect } from 'react';
import { Camera } from "expo-camera";
import { 
    Alert,
    View,
    ImageBackground 
  } from "react-native";

const SplashView = (props) => {
    const [status, requestPermission] = Camera.useCameraPermissions();

    useEffect(() => {
        if(status && !status?.granted) {
            Alert.alert(
                'Zerolife',
                '카메라 권한이 필요합니다. 버튼을 누르면 카메라 권한을 획득합니다.',
                [ { text: "확인", onPress: requestPermission} ]
            )
        }
    },[status]);

    return (
        <View
            style={{
            backgroundColor: "transparent",
            flexDirection: "row",
            width: "100%",
            height: "100%",
            }}
        >
            <ImageBackground
                source={require('../assets/splash.png')}
                style={{
                    flex: 1,
                    backgroundColor: "transparent",
                }}
            />
        </View>
    );
}

export default SplashView;