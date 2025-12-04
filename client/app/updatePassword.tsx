import { useState } from "react";
import {
    View,
    Text,
    TouchableOpacity,
    TextInput,
    StyleSheet,
    Alert,
    ScrollView,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { BlurView } from "expo-blur";
import { useRouter } from "expo-router";
import BackButton from "@/components/BackButton";

import { useAuth } from "@/hooks/AuthContext";

export default function UpdatePassword() {
    const router = useRouter();
    const { update } = useAuth();

    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const handleSavePassword = async () => {
        if (!currentPassword || !newPassword || !confirmPassword) {
            Alert.alert("Missing info", "Please fill out all fields.");
            return;
        }

        if (newPassword !== confirmPassword) {
            Alert.alert("Mismatch", "New password and confirmation do not match.");
            return;
        }

        try {
            await update({ password: newPassword, currentPassword }); // assuming update supports currentPassword
            Alert.alert("Success", "Password updated successfully.");
            router.back();
        } catch (err) {
            Alert.alert("Error", "Failed to update password. Please try again.");
        }
    };

    return (
            <ScrollView contentContainerStyle={{ padding: 24 }} showsVerticalScrollIndicator={false}>

                <View style={styles.header}>
                    <BackButton/>
                    <Text style={styles.title}>Change Password</Text>
                </View>

                <View style={styles.inputContainer}>
                    <TextInput
                        placeholder="Current Password"
                        placeholderTextColor="rgba(0, 0, 0, 0.6)"
                        secureTextEntry
                        style={styles.input}
                        value={currentPassword}
                        onChangeText={setCurrentPassword}
                    />

                    <TextInput
                        placeholder="New Password"
                        placeholderTextColor="rgba(0, 0, 0, 0.6)"
                        secureTextEntry
                        style={styles.input}
                        value={newPassword}
                        onChangeText={setNewPassword}
                    />

                    <TextInput
                        placeholder="Confirm New Password"
                        placeholderTextColor="rgba(0, 0, 0, 0.6)"
                        secureTextEntry
                        style={styles.input}
                        value={confirmPassword}
                        onChangeText={setConfirmPassword}
                    />
                </View>


                <TouchableOpacity onPress={handleSavePassword} style={{ marginTop: 20 }}>
                    <BlurView intensity={20} tint="dark" style={styles.saveButton}>
                        <Text style={styles.saveText}>Save Password</Text>
                    </BlurView>
                </TouchableOpacity>
            </ScrollView>
    );
}

const styles = StyleSheet.create({
    backButton: {
        position: "absolute",
        left: 0
    },
    header: {
        width: "100%",
        gap: 12,
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 40,
        position: "relative",
    },
    title: {
        fontSize: 20,
        fontFamily: "InterSemiBold",
        letterSpacing: -0.5
    },
    inputContainer: {
        overflow: "hidden",
        marginBottom: 15,
        gap: 10
    },
    input: {
        backgroundColor: "white",
        fontFamily: "InterRegular",
        fontSize: 16,
        color: "black",
        paddingHorizontal: 12,
        paddingVertical: 10,
        borderRadius: 12,
    },
    saveButton: {
        paddingVertical: 14,
        borderRadius: 12,
        alignItems: "center",
        overflow: "hidden",
        backgroundColor: "black"
    },
    saveText: {
        color: "white",
        fontFamily: "InterSemiBold",
        fontSize: 18,
        opacity: 0.85,
        letterSpacing: -0.5,
    },
});
