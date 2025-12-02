import React, { useState, useEffect } from 'react'
import { View, Text, FlatList, StyleSheet, TouchableOpacity } from 'react-native'
import { useRouter } from "expo-router";
import Ionicons from "@expo/vector-icons/Ionicons";

interface Notification {
    id: string;
    title: string;
    body: string;
}

// dummy notifications for emulator
const DUMMY_NOTIFICATIONS: Notification[] = [
    { id: "1", title: "Bill HR 1767 updated", body: "Significant action: Bill introduced in House" },
    { id: "2", title: "Bill S 712 updated", body: "Significant action: Bill introduced in Senate" },
    { id: "3", title: "Bill HR 999 updated", body: "Significant action: Passed House" },
];

const Inbox = () => {
    const router = useRouter();
    const [notifications, setNotifications] = useState<Notification[]>([]);
    useEffect(() => {
        // Set dummy notifications initially
        setNotifications(DUMMY_NOTIFICATIONS);

        // add expo push notif fetch logic here:
    }, []);

    const renderItem = ({ item }: { item: Notification }) => (
        <View style={styles.notificationItem}>
            <Text style={styles.title}>{item.title}</Text>
            <Text style={styles.body}>{item.body}</Text>
        </View>
    );

    return (
        <View style={styles.container}>

        {/* Back button */}
        <View style={styles.header}>
            <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color="black" />
            </TouchableOpacity>
            <Text style={styles.headerText}>Inbox</Text>
        </View>

        {/* Notifications list */}
        <FlatList
            data={notifications}
            keyExtractor={(item) => item.id}
            renderItem={renderItem}
            contentContainerStyle={notifications.length === 0 ? styles.emptyContainer : undefined}
            ListEmptyComponent={<Text style={styles.emptyText}>No notifications yet</Text>}
        />
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: 20,
    },

    header: {
        flexDirection: "row",
        alignItems: "center",
        paddingHorizontal: 16,
        marginBottom: 20,
    },

    backButton: {
        marginRight: 12,
    },

    headerText: {
        fontSize: 20,
        fontWeight: "600",
    },

    notificationItem: {
        paddingHorizontal: 16,
        paddingVertical: 14,
        borderBottomWidth: 1,
        borderBottomColor: "#eee",
        backgroundColor: "#fff",
        borderRadius: 14,
        marginHorizontal: 16,
        marginBottom: 8,
    },

    title: {
        fontWeight: "bold",
    },

    body: {
        marginTop: 2,
        fontSize: 14,
        color: "#555",
    },

    emptyContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        paddingTop: 100,
    },

    emptyText: {
        color: "#777",
        fontSize: 16,
    },
})

export default Inbox