import React, { useMemo, useState } from 'react'
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Linking, Touchable} from 'react-native'
import {VerticalStatusProgress} from 'react-native-vertical-status-progress';
import Ionicons from '@expo/vector-icons/Ionicons';
import {
    likeBill,
    dislikeBill,
    saveBill,
    unsaveBill,
    unlikeBill,
    undislikeBill
} from "@/api/billsHandler";
import type { Bill } from './types/BillWidgetTypes';
import { useRouter } from 'expo-router';

type BillWidgetProps = {
    bill: Bill;
    user: {
        savedBills: string[],
        likedBills: string[],
        dislikedBills: string[]
    }
};

const SavedBillWidget: React.FC<BillWidgetProps> = ({bill, user}) => {
    const router = useRouter();
    // const [expanded, setExpanded] = useState(false);
    const [liked, setLiked] = useState(user.likedBills.includes(bill._id));
    const [disliked, setDisliked] = useState(user.dislikedBills.includes(bill._id));
    const [saved, setSaved] = useState(user.savedBills.includes(bill._id));

    const [likes, setLikes] = useState(bill.likes);
    const [dislikes, setDislikes] = useState(bill.dislikes);

    // const timelineData = useMemo(() => {
    // if (!bill.status.timeline?.length) return [];

    // const sorted = [...bill.status.timeline].sort(
    //     (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
    // );

    // // Track how many actions we've seen per date to add counter for duplicates
    // const dateCountMap: Record<string, number> = {};

    // return sorted.map((t, index) => {
    //     const dateStr = new Date(t.date).toLocaleDateString();
    //     dateCountMap[dateStr] = (dateCountMap[dateStr] || 0) + 1;
    //     const countForDate = dateCountMap[dateStr];
        
    //     const uniqueStatus = `${bill._id}-${t.date}-${index}`;
    //     const titleWithCounter = countForDate > 1 ? `${dateStr} (${countForDate})` : dateStr;

    //         return {
    //             title: titleWithCounter,
    //             subtitle: `${t.status} - ${t.chamber}`,
    //             status: uniqueStatus,
    //         };
    //     });
    //   }, [bill]);

    // optimistic UI update handlers
    const handleLike = async () => {
        if (liked) {
            await unlikeBill(bill._id);
            setLikes(likes - 1);
            setLiked(false);
            return;
        };
        setLikes(likes + 1);
        setLiked(true);
        await likeBill(bill._id);
    };

    const handleDislike = async () => {
        if (disliked) {
            await undislikeBill(bill._id);
            setDislikes(dislikes - 1);
            setDisliked(false);
            return;
        }
        setDislikes(dislikes + 1);
        setDisliked(true);
        await dislikeBill(bill._id);
    };

    const handleSaveBill = async () => {
        setSaved(true);
        try {
            await saveBill(bill._id);
        } catch {
            setSaved(false);
        }
    };

    const handleUnsaveBill = async () => {
        setSaved(false);
        try {
            await unsaveBill(bill._id);
        } catch {
            setSaved(true); 
        }  
    };

  return (
    <TouchableOpacity onPress={() => router.push({pathname: "/savedBill", params: {id: bill._id}})}>
    <View style={styles.card}>
        <Text style={styles.title}>{bill.title}</Text>
        <Text style={styles.subheader}>{bill.policyArea}</Text>

        <View style={styles.footer}>
            <TouchableOpacity onPress={handleLike} style={styles.likeButton}>
                <Ionicons 
                    name={liked? "heart" : "heart-outline"} 
                    size={20} 
                    color={liked? "red" : "black"} 
                /> 
                <Text style={styles.likeCount}>{likes}</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={handleDislike} style={styles.likeButton}>
                <Ionicons 
                    name={disliked? "heart-dislike" : "heart-dislike-outline"} 
                    size={20} 
                    color={disliked? "purple" : "black"} 
                />
                <Text style={styles.likeCount}>{dislikes}</Text>
            </TouchableOpacity>
            
            <View style={styles.rightInteractions}>

            <TouchableOpacity style={styles.saveButton} onPress={saved ? handleUnsaveBill : handleSaveBill} >
                <Ionicons 
                    name={saved ? "bookmark" : "bookmark-outline"}
                    size={18} 
                    color={"black"} 
                />
            </TouchableOpacity>
            </View>
        </View>

    </View>
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
    card: {
        width: '100%',
        backgroundColor: '#fff',
        borderRadius: 22,
        padding: 16,
        marginBottom: 10,
    },

    title: {
        fontSize: 14,
        fontWeight: 'bold',
        marginBottom: 6,
        fontFamily: "InterBold",
    },

    subheader: {
        fontSize: 12,
        fontFamily: 'InterSemiBold',
        marginBottom: 12,
        color: "#000000d4",
        letterSpacing: -0.2
    },

    sectionHeader: {
        flexDirection: "row",
        alignItems: "center",
        fontFamily: "InterSemiBold",
        fontSize: 12,
        marginBottom: 8
    },

    footer: {
        flexDirection: "row",
        width: "100%",
        alignItems: "center",
        marginTop: 4,
    },

    likeCount: {
        fontSize: 10,
        fontFamily: 'InterRegular',
        letterSpacing: -0.4,
    },

    likeButton: {
        flexDirection: 'row',
        alignItems: 'center',
        marginRight: 16,
        gap: 4,
    },

    rightInteractions: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        marginLeft: "auto",
    },

    saveButton: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
        fontSize: 10
    },
    
});

export default SavedBillWidget