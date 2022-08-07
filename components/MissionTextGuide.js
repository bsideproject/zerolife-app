import { 
  View, 
  Text,
  TouchableOpacity,
  Image,
  StyleSheet
} from "react-native";

const styles = StyleSheet.create({
  textGuideMask: {
    display: "flex",
    alignItems: "center",
    backgroundColor: 'rgba(255,255,255,0.72)',
    flexDirection: "column",
    width: "100%",
    height: "85%",
    top: "15%"
  },
  textGuideWrapper: {
    width: 280,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    textAlign: "center",
    backgroundColor: "transparent",
  },
  closeGuideButton: {
    width: 54,
    height: 54,
    borderRadius: 50,
    borderWidth: 1,
    borderColor: "#B2B1BA",
    backgroundColor: "white",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 52,
    top: "10%"
  },
  closeGuideButtonIcon: {
    width: 24,
    height: 24,
  },
  textGuideTitle: {
    color: "#000000",
    fontWeight: "500",
    fontSize: 20,
    lineHeight: 30,
    marginBottom: 35
  },
  textGuideMethod: {
    color: "#4D4C54",
    fontWeight: "500",
    fontSize: 16,
    lineHeight: 24,
    textAlign: "center"
  },
});

const MissionTextGuide = (props) => (
  <View style={styles.textGuideMask}>
    <TouchableOpacity
      style={styles.closeGuideButton}
      onPress={() => { props.setTextGuideVisible(false) }}
    >
      <Image
        source={require('../assets/X.png')}
        style={styles.closeGuideButtonIcon}
      />
    </TouchableOpacity>
    <View style={styles.textGuideWrapper}>
      <Text style={styles.textGuideTitle}>이렇게 인증해주세요!</Text>
      <Text style={styles.textGuideMethod}>{props.description}</Text>
    </View>
  </View>
)

export default MissionTextGuide;