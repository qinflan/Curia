import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ImageBackground,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";

export default function LoginScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  return (
    <LinearGradient
      colors={["#cfd9df", "#e2ebf0", "#a1c4fd", "#c2e9fb"]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.container}
    >
      <Text style={styles.logo}>curia</Text>
      <Text style={styles.title}>Login</Text>
      <Text style={styles.subtitle}>
        Enter your email to sign up for this app
      </Text>

      <TextInput
        style={styles.input}
        placeholder="email@domain.com"
        placeholderTextColor="#ddd"
        value={email}
        onChangeText={setEmail}
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        placeholderTextColor="#ddd"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />

      <TouchableOpacity style={styles.button}>
        <Text style={styles.buttonText}>Continue</Text>
      </TouchableOpacity>

      <TouchableOpacity>
        <Text style={styles.forgotText}>Forgot my Password</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.socialButton}>
        <Ionicons name="logo-google" size={18} color="#fff" />
        <Text style={styles.socialText}>Continue with Google</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.socialButton}>
        <Ionicons name="logo-apple" size={18} color="#fff" />
        <Text style={styles.socialText}>Continue with Apple</Text>
      </TouchableOpacity>

      <Text style={styles.terms}>
        By clicking continue, you agree to our{" "}
        <Text style={styles.link}>Terms of Service</Text> and{" "}
        <Text style={styles.link}>Privacy Policy</Text>
      </Text>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 30,
  },
  logo: {
    fontSize: 36,
    fontWeight: "900",
    color: "#fff",
    marginBottom: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: "700",
    color: "#fff",
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 14,
    color: "#eee",
    marginBottom: 30,
    textAlign: "center",
  },
  input: {
    width: "100%",
    borderWidth: 1,
    borderColor: "#fff",
    borderRadius: 25,
    paddingVertical: 12,
    paddingHorizontal: 20,
    fontSize: 16,
    color: "#fff",
    marginBottom: 15,
  },
  button: {
    backgroundColor: "rgba(255,255,255,0.2)",
    borderRadius: 25,
    paddingVertical: 15,
    paddingHorizontal: 20,
    width: "100%",
    alignItems: "center",
    marginBottom: 20,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  forgotText: {
    color: "#fff",
    fontSize: 14,
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
    color: "#fff",
    fontSize: 16,
    marginLeft: 10,
  },
  terms: {
    fontSize: 12,
    color: "#ddd",
    textAlign: "center",
    marginTop: 30,
    paddingHorizontal: 20,
  },
  link: {
    color: "#fff",
    fontWeight: "600",
    textDecorationLine: "underline",
  },
});