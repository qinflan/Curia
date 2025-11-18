import { useState } from "react";
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    ScrollView,
    Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";

import { useAuth } from "@/hooks/AuthContext";

export default function UpdateLocation() {
    const router = useRouter();
    const { user, update } = useAuth();

    const [city, setCity] = useState(user?.city ?? "");
    const [state, setState] = useState(user?.state ?? "");

    const handleSave = async () => {
        if (!city.trim() || !state.trim()) {
            Alert.alert("Missing info", "Please enter both city and state.");
            return;
        }

        try {
            await update({ city, state });
            router.back();
        } catch (err) {
            Alert.alert("Error", "Failed to update location. Try again.");
        }
    };

    return (
        <ScrollView
            contentContainerStyle={{ padding: 24, paddingTop: 28 }}
            showsVerticalScrollIndicator={false}
        >

            <View style={styles.header}>
                <Ionicons name="arrow-back-circle" 
                    size={32} 
                    color="black" 
                    style={styles.backButton}
                    onPress={() => router.back()} 
                />
                <Text style={styles.title}>Update Location</Text>
            </View>
            <Text style={styles.subHeader}>Enter your current city and state</Text>

            <View style={styles.inputContainer}>
                <TextInput
                    placeholder="City"
                    placeholderTextColor="rgba(104, 104, 104, 0.6)"
                    style={styles.input}
                    value={city}
                    onChangeText={setCity}
                />
                <TextInput
                    placeholder="State"
                    placeholderTextColor="rgba(104, 104, 104, 0.6)"
                    style={styles.input}
                    value={state}
                    onChangeText={setState}
                />
            </View>

            <TouchableOpacity onPress={handleSave} style={{ marginTop: 20 }}>
                <View style={styles.saveButton}>
                    <Text style={styles.saveText}>Save</Text>
                </View>
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
        marginBottom: 15,
        paddingHorizontal: 12,
        paddingVertical: 10,
        borderRadius: 14,
        borderWidth: 1,
        letterSpacing: -0.2,
        borderColor: "rgba(0, 0, 0, 0.3)",
        width: "100%"
    },
    saveButton: {
        paddingVertical: 14,
        backgroundColor: "black",
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
});
