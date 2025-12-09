import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from "react-native";
import { useRouter } from "expo-router";
import { useAuth } from "@/hooks/AuthContext";
import { Ionicons } from "@expo/vector-icons";
import Logo from "../assets/images/lockup-dark.svg";
import { ResizeMode, Video } from "expo-av";
import { BlurView } from "expo-blur";

export default function Signup() {
  const { register } = useAuth();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleSignup = () => {
    if ( !email || !password || !confirmPassword) {
      alert("Please fill out all fields.");
      return;
    }
    if (password !== confirmPassword) {
      alert("Passwords do not match.");
      return;
    }

    try {
      register(email, password);
    }
    catch (error: any) {
      alert("Error creating account: " + error.message);
      return;
    }
    alert("Account created successfully!");
  };

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
        <Logo width={200} height={80} style={styles.logo} />
        <Text style={styles.title}>Sign Up</Text>
        <Text style={styles.subtitle}>
          Create an account to get started
        </Text>

        <BlurView intensity={20} tint="dark" style={styles.blurInput}>
          <TextInput
            style={styles.input}
            placeholder="email@domain.com"
            placeholderTextColor={"rgba(255, 255, 255, 0.6)"}
            keyboardType="email-address"
            value={email}
            onChangeText={setEmail}
            autoComplete="off" 
            autoCapitalize="none"
          />
        </BlurView>
        <BlurView intensity={20} tint="dark" style={styles.blurInput}>
        <TextInput
          style={styles.input}
          placeholder="Password"
          placeholderTextColor={"rgba(255, 255, 255, 0.6)"}
          secureTextEntry
          value={password}
          onChangeText={setPassword}
          textContentType="oneTimeCode"
          autoComplete="off"
          autoCapitalize="none"
        />
        </BlurView>
        <BlurView intensity={20} tint="dark" style={styles.blurInput}>
        <TextInput
          style={styles.input}
          placeholder="Confirm Password"
          placeholderTextColor={"rgba(255, 255, 255, 0.6)"}
          secureTextEntry
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          textContentType="oneTimeCode" // disable password autofill for dev
          autoComplete="off"
          autoCapitalize="none"
        />
        </BlurView>

        <TouchableOpacity onPress={handleSignup} style={{width: "100%"}}>
          <BlurView intensity={80} tint="light" style={styles.button}>
            <Text style={styles.buttonText}>Create Account</Text>
          </BlurView>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => router.push("/login")}>
          <Text style={styles.linkText}>
            Already have an account? <Text style={styles.link}>Login</Text>
          </Text>
        </TouchableOpacity>

        <View style={styles.socialContainer}>
          <TouchableOpacity style={styles.socialButton}>
            <Ionicons name="logo-google" size={18} color="#fff" />
            <Text style={styles.socialText}>Continue with Google</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.socialButton}>
            <Ionicons name="logo-apple" size={18} color="#fff" />
            <Text style={styles.socialText}>Continue with Apple</Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.terms}>
          By signing up, you agree to our{" "}
          <Text style={styles.link}>Terms of Service</Text> and{" "}
          <Text style={styles.link}>Privacy Policy</Text>.
        </Text>
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
    paddingVertical: 40,
  },
  logo: {
    fontSize: 36,
    fontWeight: "900",
    color: "#fff",
    marginBottom: 20,
  },
  title: {
    fontFamily: "InterSemiBold",
    width: "100%",
    textAlign: "center",
    textShadowColor: "rgba(0,0,0,0.3)",
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 4,
    letterSpacing: -1,
    fontSize: 22,
    color: "#fff",
    marginBottom: 5,
  },
  subtitle: {
    fontFamily: "InterRegular",
    width: "100%",
    textAlign: "center",
    textShadowColor: "rgba(0,0,0,0.3)",
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 4,
    fontSize: 14,
    color: "#ffffffff",
    marginBottom: 30,
  },
  blurInput: {
    padding: 0,
    width: "100%",
    paddingLeft: 20,
    alignContent: "center",
    borderRadius: 50,
    overflow: "hidden",
    marginBottom: 15,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.5)",
  },
  input: {
    paddingVertical: 12,
    fontFamily: "InterRegular",
    letterSpacing: -0.5,
    width: "100%",
    borderRadius: 25,
    fontSize: 16,
    color: "#fff",
  },
  button: {
    marginTop: 10,
    marginBottom: 20,
    borderRadius: 50,
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
    fontFamily: "InterSemiBold",
    letterSpacing: -0.5,
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  linkText: {
    fontFamily: "InterRegular",
    width: "100%",
    textAlign: "center",
    textShadowColor: "rgba(0,0,0,0.3)",
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 4,
    color: "#fff",
    fontSize: 14,
    marginBottom: 20,
  },
  link: {
    textDecorationLine: "underline",
    fontWeight: "600",
  },
  socialContainer: {
    width: "100%",
    marginBottom: 20,
  },
  socialButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "#fff",
    borderRadius: 25,
    paddingVertical: 12,
    width: "100%",
    marginBottom: 15,
  },
  socialText: {
    fontFamily: "InterRegular",
    textAlign: "center",
    letterSpacing: -0.5,
    textShadowColor: "rgba(0,0,0,0.2)",
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 15,
    color: "#fff",
    fontSize: 16,
    marginLeft: 10,
  },
  terms: {
    fontSize: 12,
    color: "#ddd",
    textAlign: "center",
    marginTop: 10,
    paddingHorizontal: 20,
  },
});
