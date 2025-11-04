import { Text, View, ScrollView, StyleSheet } from "react-native";
import React, { useState, useEffect } from 'react'
import { fetchTrendingBills } from "@/api/billsHandler";
import { getUser } from "@/api/authHandler";
import BillWidget from "@/components/BillWidget";
import type { Bill } from "@/components/types/BillWidgetTypes";

export default function AccountSettings() {
const [bills, setBills] = useState<Bill[]>([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<{
    savedBills: string[];
    likedBills: string[];
    dislikedBills: string[];
    } | null>(null);
  
  useEffect(() => {
    const loadUser = async () => {
      try {
        const fetchedUser = await getUser();
        setUser(fetchedUser);
      } catch (err) {
        console.error("Error loading user:", err);
      }
    };
  
    loadUser();
  }, []);

  useEffect(() => {
    const loadTrendingBills = async () => {
      try {
        const bills = await fetchTrendingBills();
        setBills(bills);
      } catch (error) {
        console.error("Error fetching recommended bills:", error);
      } finally {
        setLoading(false);
      }
    };

    loadTrendingBills();
  }, []);

  // add animation later
  if (loading) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Text>Loading recommended bills...</Text>
      </View>
    );
  }

  return (

    <ScrollView contentContainerStyle={styles.scrollViewContainer}>
      <View style={styles.headerContainer}>
        <Text style={styles.headerText}>Trending Bills</Text>
      </View>
      <View style={styles.billsContainer}>
      {user && bills.map((bill) => (
        <BillWidget key={bill._id} bill={bill} user={user}/>
      ))}
      </View>
    </ScrollView>
  );  
}

  const styles = StyleSheet.create({
    scrollViewContainer: {
      width: '100%',
      alignItems: 'center',
      paddingVertical: 16,
    },

    headerText: {
      fontSize: 20,
      marginBottom: 16,
      fontFamily: 'InterSemiBold',
      letterSpacing: -0.8,
      alignSelf: "flex-start",
      paddingHorizontal: 10,
    },

    billsContainer: {
      width: '90%',
      alignItems: 'center',
    },

    headerContainer: {
      width: '90%',
      alignItems: 'center',
    }
  });

