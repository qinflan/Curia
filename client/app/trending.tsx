import { Text, View, ScrollView, StyleSheet, ActivityIndicator, RefreshControl } from "react-native";
import React, { useState, useEffect, useCallback } from 'react'
import { fetchTrendingBills } from "@/api/billsHandler";
import { getUser } from "@/api/authHandler";
import BillWidget from "@/components/BillWidget";
import type { Bill } from "@/components/types/BillWidgetTypes";

export default function AccountSettings() {
  const [bills, setBills] = useState<Bill[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
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

  const loadTrendingBills = useCallback(async () => {
    try {
      const bills = await fetchTrendingBills();
      setBills(bills);
    } catch (error) {
      console.error("Error fetching trending bills:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadTrendingBills();
  }, [loadTrendingBills]);

    const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await loadTrendingBills();
    setRefreshing(false);
  }, [loadTrendingBills]);

  if (loading) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <ActivityIndicator/>
      </View>
    );
  }

  return (

    <ScrollView contentContainerStyle={styles.scrollViewContainer} refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh}/>}>
      <View style={styles.headerContainer}>
        <Text style={styles.headerText}>Trending</Text>
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

