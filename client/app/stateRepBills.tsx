import React, { useState, useEffect } from "react"
import { View, Text, ScrollView, StyleSheet } from "react-native"
import { useLocalSearchParams, useRouter } from "expo-router";
import BillWidget from "@/components/BillWidget";
import { fetchBillsByRep } from "@/api/billsHandler";
import { getUser } from "@/api/authHandler";
import { Ionicons } from "@expo/vector-icons"
import SpinnerFallback from "@/components/SpinnerFallback";
import BackButton from "@/components/BackButton";

export default function StateRepBills() {
    const { repId, firstName, lastName } = useLocalSearchParams<{ repId: string; firstName: string; lastName: string }>();
    const router = useRouter();
    const [bills, setBills] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [user, setUser] = useState<any>(null);

    useEffect(() => {
        const loadUserAndBills = async () => {
            try {
                const fetchedUser = await getUser();
                setUser(fetchedUser);

                const fetchedBills = await fetchBillsByRep(repId);
                setBills(fetchedBills);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        loadUserAndBills();
    }, [repId]);

    if (loading) {
        return (
            <SpinnerFallback />
        );
    }

    const formatName = (firstName: string, lastName: string) => {
        const cap = (s: string) => s.charAt(0).toUpperCase() + s.slice(1).toLowerCase();
        return `${cap(firstName)} ${cap(lastName)}`;
    };

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <View style={styles.header}>
                <BackButton/>
                <Text style={styles.title}>{formatName(firstName, lastName)}&apos;s Bill Report</Text>
            </View>
            {bills.length > 0 ? (
                bills.map((bill) => <BillWidget key={bill._id} bill={bill} user={user} />)
            ) : (
                <Text style={styles.noBillsText}>No bills found for this representative.</Text>
            )}
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        padding: 16,
        alignItems: "center",
    },
    loadingContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
    header: {
        width: "100%",
        gap: 12,
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 22,
        position: "relative",
    },
    backButton: {
        position: "absolute",
        left: 0
    },
    title: {
        fontSize: 20,
        fontFamily: "InterSemiBold",
        letterSpacing: -0.5,
    },
    noBillsText: {
        fontSize: 14,
        color: "gray",
        marginTop: 16,
    },
});