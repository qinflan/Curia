import { Text, View, ScrollView, StyleSheet } from "react-native";
import React, { useState, useEffect } from 'react'
import { fetchTrendingBills } from "@/api/billsHandler";
import BillWidget from "@/components/BillWidget";
import type { Bill } from "@/components/types/BillWidgetTypes";

export default function AccountSettings() {
const [bills, setBills] = useState<Bill[]>([]);
  const [loading, setLoading] = useState(true);

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
      {bills.map((bill) => (
        <BillWidget key={bill._id} bill={bill} />
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

