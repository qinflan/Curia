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
import Ionicons from "@expo/vector-icons/Ionicons";
import BackButton from "@/components/BackButton";
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
      <ScrollView contentContainerStyle={{ padding: 24}} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <BackButton/>
            <Text style={styles.title}>Sign-in Settings</Text>
        </View>

        <View style={{ marginBottom: 12 }}>
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
  );
}

const styles = StyleSheet.create({
    header: {
        width: "100%",
        gap: 12,
        flexDirection: "row",
        alignItems: "center",
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
        marginBottom: 8,
        marginTop: 40,
        letterSpacing: -0.3
    },
  inputContainer: {
    overflow: "hidden",
    gap: 12,
  },
  input: {
    backgroundColor: "white",
    fontFamily: "InterRegular",
    fontSize: 16,
    color: "black",
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 14,
    letterSpacing: -0.2,
    width: "100%"
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
