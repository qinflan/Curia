import React, { useState, useEffect, useMemo } from 'react'
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Linking } from 'react-native'
import { VerticalStatusProgress } from 'react-native-vertical-status-progress';
import Ionicons from '@expo/vector-icons/Ionicons';
import type { Bill } from '@/components/types/BillWidgetTypes'
import { fetchBillById } from '@/api/billsHandler';
import { useLocalSearchParams, useRouter } from 'expo-router';
import SpinnerFallback from '@/components/SpinnerFallback';



const SavedBillScreen: React.FC = () => {
    const router = useRouter();
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

    //   const openBillUrl = () => {
    //     if (!bill.urls?.congress) return;
    //     Linking.openURL(bill.urls.congress);
    //   };

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                <Ionicons name="arrow-back" size={24} color="black" />
            </TouchableOpacity>
            <Text style={styles.title}>{bill.title}</Text>
            <Text style={styles.subheader}>{bill.policyArea}</Text>

            <View style={styles.cardContainer}>
                <Text style={styles.sectionHeader}>Summary</Text>
                {bill.shortSummary && <Text style={styles.summary}>{bill.shortSummary}</Text>}
            </View>
            {/* {bill.longSummary && <Text style={styles.summary}>{bill.longSummary}</Text>} */}
            

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
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: { padding: 16, },
    title: { fontSize: 18, fontWeight: 'bold', marginBottom: 6 },
    subheader: { fontSize: 14, marginBottom: 12, color: '#333' },
    sectionHeader: { fontSize: 14, fontWeight: '600', marginBottom: 8 },
    summary: { fontSize: 14 },
    partisanBarContainer: { 
        flexDirection: 'row',
        height: 10, 
        borderRadius: 5, 
        overflow: 'hidden', 
        marginBottom: 6,  
    },
    partisanBarSegment: { height: '100%' },
    sponsorCount: { fontSize: 12, color: '#555' },
    cardContainer: {
        backgroundColor: "#fff",
        borderRadius: 20,
        padding: 20,
        marginBottom: 10,
    },
    link: { color: '#007aff', fontSize: 14, marginTop: 10 },
    backButton: {
        marginRight: 12,
        marginBottom: 16,
    },
});

export default SavedBillScreen;