import { StyleSheet, Text, View, TouchableOpacity } from "react-native";
import { ResizeMode, Video } from "expo-av";
import { BlurView } from "expo-blur";
import Logo from "../assets/images/logo-dark.svg";
import Ionicons from '@expo/vector-icons/Ionicons';
import { useRouter } from "expo-router";

export default function SignUp() {
  const router = useRouter();

  return (

    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Text>Sign up for a new account now.</Text>
      <TouchableOpacity
        onPress={() => router.push("/accountSetup")}
        style={{
          marginTop: 20,
          padding: 10,
          backgroundColor: "#007AFF",
          borderRadius: 5,
        }}
      >
        <Text style={{ color: "white", fontWeight: "bold" }}>Sign Up</Text>
      </TouchableOpacity>
    </View>
  );
}
