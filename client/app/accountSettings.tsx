import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { ResizeMode, Video } from "expo-av";
import { BlurView } from "expo-blur";

export default function AccountSettings() {
  const router = useRouter();

  const handlePress = (action: string) => {
    alert(`${action} pressed`);
    // TODO: Add navigation or modal logic here later
  };

  const settingsOptions = [
    { label: "Change Legislative Preferences", icon: "document-text-outline" },
    { label: "Change Password", icon: "lock-closed-outline" },
    { label: "Premium Subscription", icon: "star-outline" },
    { label: "Change to Light Mode", icon: "sunny-outline" },
    { label: "Notification Settings", icon: "notifications-outline" },
    { label: "Help and Support", icon: "help-circle-outline" },
    { label: "Logout", icon: "log-out-outline" },
  ];

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

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.title}>Account Settings</Text>

        {settingsOptions.map((option, index) => (
          <TouchableOpacity
            key={index}
            style={{ width: "100%" }}
            onPress={() => handlePress(option.label)}
          >
            <BlurView intensity={50} tint="dark" style={styles.option}>
              <Ionicons
                name={option.icon as any}
                size={22}
                color="#fff"
                style={styles.icon}
              />
              <Text style={styles.optionText}>{option.label}</Text>
            </BlurView>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 30,
    paddingVertical: 60,
  },
  title: {
    fontFamily: "InterSemiBold",
    width: "100%",
    textAlign: "center",
    textShadowColor: "rgba(0,0,0,0.3)",
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 10,
    letterSpacing: -1,
    fontSize: 24,
    color: "#fff",
    marginBottom: 40,
  },
  option: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",
    borderRadius: 50,
    paddingVertical: 16,
    paddingHorizontal: 20,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.4)",
    width: "100%",
  },
  icon: {
    marginRight: 15,
  },
  optionText: {
    fontFamily: "InterRegular",
    letterSpacing: -0.3,
    fontSize: 16,
    color: "#fff",
  },
});
