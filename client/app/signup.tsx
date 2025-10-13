import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";

export default function SignupScreen({ navigation }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleSignup = () => {
    if (!name || !email || !password || !confirmPassword) {
      alert("Please fill out all fields.");
      return;
    }
    if (password !== confirmPassword) {
      alert("Passwords do not match.");
      return;
    }
    alert("Account created successfully!");
    // navigation.navigate("Home");
  };

  return (
    <LinearGradient
      colors={["#cfd9df", "#e2ebf0", "#a1c4fd", "#c2e9fb"]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.container}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.logo}>curia</Text>
        <Text style={styles.title}>Sign Up</Text>
        <Text style={styles.subtitle}>
          Create an account to get started
        </Text>

        <TextInput
          style={styles.input}
          placeholder="Full Name"
          placeholderTextColor="#ddd"
          value={name}
          onChangeText={setName}
        />
        <TextInput
          style={styles.input}
          placeholder="email@domain.com"
          placeholderTextColor="#ddd"
          keyboardType="email-address"
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
        <TextInput
          style={styles.input}
          placeholder="Confirm Password"
          placeholderTextColor="#ddd"
          secureTextEntry
          value={confirmPassword}
          onChangeText={setConfirmPassword}
        />

        <TouchableOpacity style={styles.button} onPress={handleSignup}>
          <Text style={styles.buttonText}>Create Account</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => navigation.navigate("Login")}>
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
    </LinearGradient>
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
    width: "100%",
    alignItems: "center",
    marginTop: 10,
    marginBottom: 20,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  linkText: {
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

