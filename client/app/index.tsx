import { StyleSheet, Text, View, TouchableOpacity } from "react-native";
import { ResizeMode, Video } from "expo-av";
import { BlurView } from "expo-blur";
import Logo from "../assets/images/logo-dark.svg";
import Ionicons from '@expo/vector-icons/Ionicons';
import { useRouter } from "expo-router";


export default function Landing() {
  const router = useRouter();

  return (

    <View style={styles.container}>
      <Video
        source={require("../assets/videos/gradient.mp4")}
        style={StyleSheet.absoluteFill}
        resizeMode={ResizeMode.COVER}
        isLooping
        shouldPlay
        isMuted
        />

      <Logo width={200} height={100} style={styles.logo}/>

      <Text style={styles.heroText}>Learn to know how politics are actually happening around you.</Text>

      <TouchableOpacity 
        onPress={() => {router.push("/signup")}}
      >
        <BlurView intensity={60} tint="light" style={styles.button}>
          <Text style={styles.buttonText}>get started</Text>
          <Ionicons name="enter" size={20} color="white" style={styles.buttonIcon} />
        </BlurView>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center"
  },

  logo: {
    marginBottom: 20,
    opacity: 0.75,
  },

  heroText: {
    fontFamily: "InterSemiBold",
    fontSize: 20,
    letterSpacing: -1,
    color: "white",
    width: "65%",
    textAlign: "center",
    textShadowColor: "rgba(0, 0, 0, 0.1)",
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 8,
    opacity: 0.75,
    marginBottom: 20,
  },

  button: {
    marginTop: 20,
    borderRadius: 50,
    width: 225,
    padding: 20,
    textAlign: "center",
    borderWidth: 2,
    borderColor: "rgba(255, 255, 255, 0.5)",
    overflow: "hidden",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },

  buttonText: {
    fontFamily: "InterRegular",
    fontSize: 20,
    letterSpacing: -1,
    color: "white",
    opacity: 0.75,
    textAlign: "center",
  },

  buttonIcon: {
    marginLeft: 8,
    opacity: 0.75,
    textAlign: "center",
    color: "white",
  }

});

