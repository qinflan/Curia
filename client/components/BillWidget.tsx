import React, { useMemo, useState } from 'react'
import { View, Text, StyleSheet, TouchableOpacity, ScrollView} from 'react-native'
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

type BillWidgetProps = {
    bill: Bill;
    user: {
        savedBills: string[],
        likedBills: string[],
        dislikedBills: string[]
    }
};

const BillWidget: React.FC<BillWidgetProps> = ({bill, user}) => {
    const [expanded, setExpanded] = useState(false);
    const [liked, setLiked] = useState(user.likedBills.includes(bill._id));
    const [disliked, setDisliked] = useState(user.dislikedBills.includes(bill._id));
    const [saved, setSaved] = useState(user.savedBills.includes(bill._id));

    const [likes, setLikes] = useState(bill.likes);
    const [dislikes, setDislikes] = useState(bill.dislikes);

    const timelineData = useMemo(() => {
    return bill.status.timeline
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
        .map((t) => ({
        title: t.status,      
        subtitle: `${t.chamber} • ${new Date(t.date).toLocaleDateString()}`,
        status: "completed",                        
        renderContent: (
            <Text style={{ fontSize: 11, color: "#555", fontFamily: "InterRegular" }}>
            {`Action taken in the ${t.chamber} on ${new Date(t.date).toLocaleDateString()}`}
            </Text>
        ),
        }));
      }, [bill.status.timeline]);

    //   calculate partisan percentages
    const total = bill.republicanCount + bill.democratCount;
    const repPercent = total > 0 ? (bill.republicanCount /total) : 0;
    const demPercent = total > 0 ? (bill.democratCount / total) : 0;

    const toggleTimeline = () => {
        setExpanded(!expanded);
    }

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
    <View style={styles.card}>
        <Text style={styles.title}>{bill.title}</Text>
        <Text style={styles.subheader}>{bill.policyArea}</Text>
        <Text style={styles.caption}>{bill.shortSummary}</Text>

        {/* TODO: add on view sliding animation */}
        <Text style={styles.sectionHeader}>Partisan Breakdown</Text>
          <View style={styles.partisanBarContainer}>
              <View style={styles.partisanBar}>
                  <View style={[styles.partisanBarSegment, {
                      flex: repPercent,
                      backgroundColor: '#ff4d4d',
                  }]} />
                  <View style={[styles.partisanBarSegment, {
                      flex: demPercent,
                      backgroundColor: '#4d79ff',
                  }]} />
              </View>
          </View>

        {expanded && (
            <>
                <Text style={styles.sectionHeader}>Bill Progression</Text>
                <ScrollView style={styles.timelineContainer} nestedScrollEnabled={true}>
                    <VerticalStatusProgress showOrder={false} statuses={timelineData} currentStatus={bill.status.currentStatus}/>
                </ScrollView>
            </>
        )}

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
            <TouchableOpacity style={styles.detailsButton} onPress={toggleTimeline}>
                <Text style={styles.detailsText}>{expanded? "show less": "show more"}</Text>
                <Ionicons 
                    name={expanded ? "chevron-up-outline" : "chevron-down-outline"} 
                    size={20}
                    color={"black"}
                    style={{alignSelf: 'flex-end'}}
                />
            </TouchableOpacity>
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
  )
}

const styles = StyleSheet.create({
    card: {
        width: '100%',
        backgroundColor: '#fff',
        borderRadius: 22,
        padding: 16,
        marginBottom: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.01,
        shadowRadius: 12,
        elevation: 5,
    },

    title: {
        fontSize: 14,
        fontWeight: 'bold',
        marginBottom: 8,
        fontFamily: "InterBold",
    },

    subheader: {
        fontSize: 12,
        fontFamily: 'InterSemiBold',

    },

    caption: {
        fontSize: 12,
        marginBottom: 12,
        fontFamily: "InterRegular",
        letterSpacing: -0.4,
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
        marginTop: 12,
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

    detailsButton: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
        fontSize: 10
    },

    detailsText: {
        fontSize: 10,
        fontFamily: 'InterRegular',
        letterSpacing: -0.4,
    },

    partisanBarContainer: {
        height: 12,
        borderRadius: 50,
        width: '100%',
        flexDirection: 'row',
        marginBottom: 12,
    },

    partisanBar: {
        height: 8,
        borderRadius: 50,
        width: '100%',
        flexDirection: 'row',
        overflow: 'hidden',
    },

    partisanBarSegment: {
        height: 12,
    },

    timelineContainer: {
        maxHeight: 300,
    },

    
});

export default BillWidget