import { StyleSheet, Text, View } from "react-native";
import {ResizeMode, Video} from "expo-av";

export default function Index() {
  return (

    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Video
        source={require("../assets/videos/gradient.mp4")}
        style={StyleSheet.absoluteFill}
        resizeMode={ResizeMode.COVER}
        isLooping
        shouldPlay
        isMuted
        />
      <Text>Get to know how politics are actually happening around you.</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  
});

