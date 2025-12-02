import React, { useState, useEffect } from 'react'
import { View, Text, FlatList, StyleSheet, TouchableOpacity } from 'react-native'
import { useRouter } from "expo-router";
import Ionicons from "@expo/vector-icons/Ionicons";
import { fetchSavedBills } from '@/api/billsHandler';
import * as Device from 'expo-device';
import { Bill } from '@/components/types/BillWidgetTypes';

interface Notification {
    id: string;
    title: string;
    body: string;
}

const Inbox = () => {
    const router = useRouter();
    const [notifications, setNotifications] = useState<Notification[]>([]);

    useEffect(() => {
        const loadNotifications = async () => {
            if (!Device.isDevice) {
                try {
                    const savedBills = await fetchSavedBills();
                    if (savedBills?.length) {
                        const generated: Notification[] = savedBills.map((bill: Bill) => {
                            const timeline = bill.status.timeline;
                            const latest = timeline && timeline.length > 0 ? timeline[timeline.length - 1] : null;
                            return {
                                id: bill._id,
                                title: `${bill.title}`,
                                body: latest
                                ? `Updated: ${latest.status} (${latest.chamber})`
                                : 'Updated in Congress',
                            }
                    });
                        setNotifications(generated);
                        return;
                    }
                } catch (err) {
                    console.error('Failed to fetch saved bills:', err);
                }
            } else {
                // fetch notifs from push notification service here
                setNotifications([]);
            }

        };
        loadNotifications();
    }, []);

    const renderItem = ({ item }: { item: Notification }) => (
        <TouchableOpacity onPress={() => router.push({ pathname: "/savedBill", params: { id: item.id } })}>
            <View style={styles.notificationItem}>
                <View style={styles.redDot} />
                <View style={styles.textContainer}>
                    <Text style={styles.title}>{item.title}</Text>
                    <Text style={styles.body}>{item.body}</Text>
                </View>
            </View>
        </TouchableOpacity>
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
        flexDirection: 'row',
        alignItems: 'center',
        gap: 20, 
        paddingHorizontal: 16,
        paddingVertical: 14,
        borderBottomWidth: 1,
        borderBottomColor: "#eee",
        backgroundColor: "#fff",
        borderRadius: 14,
        marginHorizontal: 16,
        marginBottom: 8,
    },

    textContainer: {
        flex: 1,
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

    redDot: {
        width: 8,
        height: 8,
        borderRadius: 50,
        backgroundColor: '#ff0000a1',
    },
})

export default Inbox