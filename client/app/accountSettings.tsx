import { Text, View, StyleSheet, TouchableOpacity, ScrollView, Modal, Alert } from "react-native";
import { useState } from "react";
import { useAuth } from "@/hooks/AuthContext";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { FED_POLICY_AREAS } from "./enums/BillsEnums";

export default function AccountSettings() {
  const { user, logout } = useAuth();
  const router = useRouter();

  return (
    <View style={styles.container}>
      <View style={styles.profileContainer}>
        <Ionicons name="person-circle" size={28} />
        <Text style={styles.headerText}>{user?.firstName} {user?.lastName} </Text>
      </View>

      <TouchableOpacity style={styles.settingRow} onPress={() => router.push("/updateInterests")}>
        <Text style={styles.settingLabel}>Your Political Interests</Text>
        <Ionicons name="chevron-forward" size={20} />
      </TouchableOpacity>

      <TouchableOpacity style={styles.settingRow} onPress={() => router.push("/updateLocation")}>
        <Text style={styles.settingLabel}>Update Location</Text>
        <Ionicons name="chevron-forward" size={20} />
      </TouchableOpacity>

      <TouchableOpacity style={styles.settingRow} onPress={() => router.push("/updateSignin")}>
        <Text style={styles.settingLabel}>Sign-in Settings</Text>
        <Ionicons name="lock-closed" size={20} />
      </TouchableOpacity>

      <TouchableOpacity onPress={logout} style={styles.settingRow}>
        <Text style={styles.settingLabel}>Log Out</Text>
        <Ionicons name="log-out" size={20} />
      </TouchableOpacity>

      <TouchableOpacity onPress={() => router.push("/faq")} style={styles.settingRow}>
        <Text style={styles.settingLabel}>Frequently Asked Questions</Text>
        <Ionicons name="help-circle" size={20} />
      </TouchableOpacity>
    </View>

  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    padding: 20,
  },

  profileContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    width: "100%",
    marginBottom: 35
  },

  headerText: {
    fontFamily: "InterSemiBold",
    letterSpacing: -0.4,
    fontSize: 18
  },

  settingRow: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderColor: "#ddd",
  },

  settingLabel: {
    fontSize: 16,
    fontFamily: "InterRegular",
  },
});
