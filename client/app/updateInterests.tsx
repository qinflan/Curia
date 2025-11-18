import { useState } from "react";
import {
    View,
    Text,
    ScrollView,
    TouchableOpacity,
    StyleSheet,
    Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useAuth } from "@/hooks/AuthContext";
import { FED_POLICY_AREAS } from "./enums/BillsEnums";

export default function UpdateInterests() {
    const router = useRouter();
    const { user, update } = useAuth();

    const [interests, setInterests] = useState<string[]>(
        user?.preferences?.interests ?? []
    );

    const toggleInterest = (interest: string) => {
        setInterests((prev) => {
            const exists = prev.includes(interest);

            if (exists) return prev.filter((i) => i !== interest);
            if (prev.length >= 5) {
                Alert.alert("Limit reached", "You can select up to 5 interests.");
                return prev;
            }

            return [...prev, interest];
        });
    };

    const handleSave = async () => {
        try {
            await update({ preferences: { interests } });
            router.back();
        } catch (err) {
            Alert.alert("Error", "Failed to update interests. Try again.");
        }
    };

    return (
        <ScrollView
            contentContainerStyle={{ padding: 24, paddingTop: 10 }}
            showsVerticalScrollIndicator={false}
        >
            <View style={styles.header}>
                    <Ionicons 
                        name="arrow-back-circle" 
                        size={32} 
                        color="black" 
                        style={styles.backButton} 
                        onPress={() => router.back()} 
                    />
                <Text style={styles.title}>Update Policy Interest</Text>
            </View>
            <Text style={styles.subHeader}>Select up to 5 interests</Text>

            <View style={styles.interestContainer}>
                {FED_POLICY_AREAS.map((area) => {
                    const selected = interests.includes(area);

                    return (
                        <TouchableOpacity
                            key={area}
                            onPress={() => toggleInterest(area)}
                            style={[styles.interestTile, selected && styles.selectedTile]}
                        >
                            <Text
                                style={[styles.interestText, selected && styles.selectedText]}
                            >
                                {area}
                            </Text>
                        </TouchableOpacity>
                    );
                })}
            </View>

            {/* Save Button */}
            <TouchableOpacity onPress={handleSave} style={styles.saveButton}>
                <Text style={styles.saveText}>Save</Text>
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
        textAlign: "center"
    },
    subHeader: {
        fontFamily: "InterRegular",
        fontSize: 14,
        color: "black",
        textAlign: "center",
        marginBottom: 20
    },
    interestContainer: {
        flexDirection: "row",
        flexWrap: "wrap",
        justifyContent: "center",
        gap: 10,
        marginBottom: 40,
    },
    interestTile: {
        paddingHorizontal: 16,
        paddingVertical: 10,
        borderRadius: 50,
        backgroundColor: "#fff",
    },
    selectedTile: {
        backgroundColor: "#000",
    },
    interestText: {
        color: "#000",
        fontFamily: "InterRegular",
        fontSize: 14,
        textAlign: "center",
    },
    selectedText: {
        color: "#fff",
        fontFamily: "InterSemiBold",
    },
    saveButton: {
        paddingVertical: 14,
        borderRadius: 14,
        backgroundColor: "#000",
        alignItems: "center",
    },
    saveText: {
        color: "#fff",
        fontFamily: "InterSemiBold",
        fontSize: 18,
        letterSpacing: -0.5,
    },
});
