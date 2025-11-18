import { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
  TextInput,
  ScrollView,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";

import { useAuth } from "@/hooks/AuthContext";

export default function UpdateSignin() {
  const router = useRouter();
  const { user, update } = useAuth();

  const [email, setEmail] = useState(user?.email ?? "");
  const [editingEmail, setEditingEmail] = useState(false);

  const handleSaveEmail = async () => {
    if (!email.trim()) {
      Alert.alert("Invalid email", "Please enter a valid email.");
      return;
    }

    try {
      await update({ email });
      setEditingEmail(false);
      Alert.alert("Success", "Email updated successfully.");
    } catch (err) {
      Alert.alert("Error", "Failed to update email. Try again.");
    }
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ScrollView contentContainerStyle={{ padding: 24, paddingTop: 28 }} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Ionicons name="arrow-back-circle" size={32} color="black" style={styles.backButton} onPress={() => router.back()}/>
            <Text style={styles.title}>Sign-in Settings</Text>
        </View>

        <View style={{ marginBottom: 15 }}>
          <Text style={styles.subHeader}>Email</Text>
          {editingEmail ? (
            <View style={styles.inputContainer}>
              <TextInput
                placeholder="Email"
                placeholderTextColor="rgba(255,255,255,0.6)"
                style={styles.input}
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
              />
              <TouchableOpacity onPress={handleSaveEmail} style={{ marginTop: 10 }}>
                <View style={styles.saveButton}>
                  <Text style={styles.saveText}>Save</Text>
                </View>
              </TouchableOpacity>
            </View>
          ) : (
            <View style={styles.currentValueRow}>
              <Text style={styles.currentValue}>{email}</Text>
              <TouchableOpacity onPress={() => setEditingEmail(true)}>
                <Ionicons name="pencil" size={20} color="black" />
              </TouchableOpacity>
            </View>
          )}
        </View>

        <View>
          <TouchableOpacity onPress={() => router.push("/updatePassword")}>
            <View style={styles.saveButton}>
              <Text style={styles.saveText}>Change Password</Text>
            </View>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
    backButton: {
        position: "absolute",
        left: 0
    },
    header: {
        width: "100%",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        marginBottom: 5,
        position: "relative",
    },
    title: {
        fontSize: 20,
        fontWeight: "600",
        textAlign: "center",
        fontFamily: "InterSemiBold",
        letterSpacing: -0.6
    },
    subHeader: {
        fontFamily: "InterRegular",
        fontSize: 14,
        color: "black",
        textAlign: "center",
        marginBottom: 20,
        letterSpacing: -0.2
    },
  inputContainer: {
    overflow: "hidden",
  },
  input: {
    backgroundColor: "white",
    fontFamily: "InterRegular",
    fontSize: 16,
    color: "black",
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 14,
  },
  saveButton: {
    backgroundColor: "black",
    paddingVertical: 14,
    borderRadius: 14,
    alignItems: "center",
    overflow: "hidden",
  },
  saveText: {
    color: "white",
    fontFamily: "InterSemiBold",
    fontSize: 18,
    opacity: 0.85,
    letterSpacing: -0.5,
  },
  currentValueRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "rgba(255, 255, 255, 1)",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
  },
  currentValue: {
    color: "black",
    fontFamily: "InterRegular",
    fontSize: 16,

  },
});
