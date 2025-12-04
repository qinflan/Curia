import React, { useState, useEffect, useMemo } from 'react'
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Linking, Dimensions } from 'react-native'
import { VerticalStatusProgress } from 'react-native-vertical-status-progress';
import Ionicons from '@expo/vector-icons/Ionicons';
import type { Bill } from '@/components/types/BillWidgetTypes'
import { fetchBillById } from '@/api/billsHandler';
import { useLocalSearchParams } from 'expo-router';
import SpinnerFallback from '@/components/SpinnerFallback';
import BackButton from '@/components/BackButton';

import * as WebBrowser from 'expo-web-browser';

const SavedBillScreen: React.FC = () => {
    const { id } = useLocalSearchParams<{ id: string }>();
    const [bill, setBill] = useState<Bill | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadBill = async () => {
            if (!id) return;
            try {
                const fetchedBill = await fetchBillById(id);
                setBill(fetchedBill);
            } catch (err) {
                console.error('Failed to fetch bill:', err);
            } finally {
                setLoading(false);
            }
        };
        loadBill();
    }, [id]);

    const timelineData = useMemo(() => {
        if (!bill?.status.timeline?.length) return [];

        const sorted = [...bill.status.timeline].sort(
            (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
        );

        const dateCountMap: Record<string, number> = {};

        return sorted.map((t, index) => {
            const dateStr = new Date(t.date).toLocaleDateString();
            dateCountMap[dateStr] = (dateCountMap[dateStr] || 0) + 1;
            const countForDate = dateCountMap[dateStr];

            const uniqueStatus = `${bill._id}-${t.date}-${index}`;
            const titleWithCounter = countForDate > 1 ? `${dateStr} (${countForDate})` : dateStr;

            return {
                title: titleWithCounter,
                subtitle: `${t.status} - ${t.chamber}`,
                status: uniqueStatus,
            };
        });
    }, [bill]);

    if (loading) return <SpinnerFallback />;
    if (!bill) return <Text style={{ flex: 1, textAlign: 'center', marginTop: 50 }}>Bill not found</Text>;

    const totalSponsors = bill.republicanCount + bill.democratCount;
    const repPercent = totalSponsors > 0 ? bill.republicanCount / totalSponsors : 0;
    const demPercent = totalSponsors > 0 ? bill.democratCount / totalSponsors : 0;

    const openInAppBrowser = async (url: string) => {
        await WebBrowser.openBrowserAsync(url);
    };

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <View style={styles.header}>
                <BackButton/>
                <View style={{ flexDirection: 'column' }}>
                    <Text style={styles.title}>{bill.title}</Text>
                    <Text style={styles.subheader}>{bill.policyArea}</Text>
                </View>
            </View>

            <View style={styles.cardContainer}>
                <Text style={styles.sectionHeader}>Summary</Text>
                {bill.shortSummary && <Text style={styles.summary}>{bill.shortSummary}</Text>}
            </View>

            <View style={styles.cardContainer}>
                <Text style={styles.sectionHeader}>Partisan Breakdown</Text>
                <View style={styles.partisanBarContainer}>
                    <View style={[styles.partisanBarSegment, { flex: repPercent, backgroundColor: '#f16363ff' }]} />
                    <View style={[styles.partisanBarSegment, { flex: demPercent, backgroundColor: '#548cedff' }]} />
                </View>
                <Text style={styles.sponsorCount}>R: {bill.republicanCount} | D: {bill.democratCount}</Text>
            </View>
            <View style={styles.cardContainer}>
                <Text style={styles.sectionHeader}>Bill Progression</Text>
                {bill.status.timeline?.length ? (
                    <VerticalStatusProgress
                        showOrder={false}
                        statuses={timelineData}
                        currentStatus={timelineData[timelineData.length - 1].status} // last timeline entry
                        statusColors={{
                            prevBallColor: '#000',
                            currentBallColor: '#000',
                            futureBallColor: '#c4c4c4',
                            prevStickColor: '#000',
                            currentStickColor: '#000',
                            futureStickColor: '#c4c4c4',
                            prevTitleColor: '#000',
                            currentTitleColor: '#000',
                            futureTitleColor: '#000a6',
                            prevSubtitleColor: '#000',
                            currentSubtitleColor: '#000',
                            futureSubtitleColor: '#000a6',
                        }}
                    />
                ) : (
                    <Text>No timeline data available</Text>
                )}
            </View>
                {bill.document ? (
                    <TouchableOpacity onPress={() => openInAppBrowser(bill.document)} style={[styles.cardContainer, {borderWidth: 1, borderColor: '#000000c9'}]}>
                        <Text style={styles.link}>View Full Document</Text>
                    </TouchableOpacity>
                ) : (
                    <Text>No document available.</Text>
                )}
        </ScrollView>

    );
};


const styles = StyleSheet.create({
    container: { 
        padding: 16, 
    },
    header: {
        width: '90%',
        flexDirection: 'row',
        marginBottom: 16,
        alignItems: 'center',
        gap: 12,
    },
    title: { 
        fontSize: 18,
        fontFamily: "InterSemiBold",
        letterSpacing: -0.5,
    },
    subheader: { 
        fontSize: 14,
        fontFamily: 'InterSemiBold',
        color: "#000000d4",
        letterSpacing: -0.5,
    },
    sectionHeader: { 
        fontFamily: 'InterSemiBold',
        letterSpacing: -0.2,
        fontSize: 14, 
        marginBottom: 8 
    },
    summary: { 
        fontSize: 14,
        fontFamily: 'InterRegular',
        letterSpacing: -0.2,
    },
    partisanBarContainer: {
        flexDirection: 'row',
        height: 10,
        borderRadius: 5,
        overflow: 'hidden',
        marginBottom: 6,
    },
    partisanBarSegment: { 
        height: '100%' 
    },
    sponsorCount: { 
        fontSize: 12, color: '#555' 
    },
    cardContainer: {
        backgroundColor: "#fff",
        borderRadius: 20,
        padding: 20,
        marginBottom: 10,
    },
    link: { 
        fontFamily: "InterSemiBold",
        color: '#0066ffc9', 
        fontSize: 14,
        letterSpacing: -0.2,
    },
    backButton: {
        marginRight: 12,
        marginBottom: 16,
    },
});

export default SavedBillScreen;