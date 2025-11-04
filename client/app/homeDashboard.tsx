import React, { useState, useEffect, useCallback } from "react";
import { View, Text, StyleSheet, ScrollView, ActivityIndicator, RefreshControl, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { 
  fetchSavedBills, 
  fetchStateRepBills, 
} from "@/api/billsHandler";
import { getUser } from "@/api/authHandler";
import BillWidget from "@/components/BillWidget";
import { Bill } from "@/components/types/BillWidgetTypes";

export default function HomeDashboard() {
  const router = useRouter();
  const [savedBills, setSavedBills] = useState<Bill[]>([]);
  const [stateRepBills, setStateRepBills] = useState<Bill[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [user, setUser] = useState<{
  savedBills: string[];
  likedBills: string[];
  dislikedBills: string[];
  state: string;
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

  const loadSavedBills = useCallback(async () => {
    try {
      const bills = await fetchSavedBills();
      setSavedBills(bills);
    } catch (error) {
      console.error("Error fetching saved bills:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadSavedBills();
  }, [loadSavedBills]);

    const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await loadSavedBills();
    setRefreshing(false);
  }, [loadSavedBills]);

  useEffect(() => {
    if (!user?.state) return;
    const loadStateRepBills = async () => {
      try {
        const stateRepBills = await fetchStateRepBills(user.state);
        setStateRepBills(stateRepBills);
      } catch (error) {
        console.error("Error fetching state rep bills:", error);
      } finally {
        setLoading(false);
      }
    };

    loadStateRepBills();
  }, [user]);

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
        <Text style={styles.headerText}>Saved</Text>
      </View>
      <View style={styles.billsContainer}>
      {user && savedBills.length > 0 ?
      
      (savedBills.map((bill) => (<BillWidget key={bill._id} bill={bill} user={user} />))) 
        :
      (
      <View style={styles.emptyBillsContainer}>
      <Text style={styles.caption}>No bills saved yet.</Text>
      <TouchableOpacity style={styles.navigateButton} onPress={() => {router.push("/recommendedFeed")}}>
        <Text style={styles.navigateButtonText}>Find legislation you care about</Text>
        <Ionicons name="document-text-outline" size={16} color="white"/>
      </TouchableOpacity>
    </View>
      )}
      </View>

      <View style={styles.stateRepContainer}>
        <View style={styles.headerContainer}>
          <Text style={styles.headerText}>Supported by Sen. Elizabeth Warren</Text>
        </View>
        <View style={styles.billsContainer}>
        {user && stateRepBills.map((bill) => (
          <BillWidget key={bill._id} bill={bill} user={user} />
        ))}
        </View>
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
    },

    emptyBillsContainer: {
      flexDirection: "column",
      alignItems: "center"
    },

    stateRepContainer: {
      marginTop: 50
    },

    caption: {
      fontSize: 12,
      marginBottom: 12,
      fontFamily: "InterRegular",
      letterSpacing: -0.4,
    },

    navigateButton: {
      borderRadius: 14,
      paddingHorizontal: 26,
      paddingVertical: 12,
      flexDirection: "row",
      alignItems: "center",
      gap: 6,
      backgroundColor: "black"
    },

    navigateButtonText: {
      fontFamily: "InterSemiBold",
      letterSpacing: -0.5,
      color: "white",
      fontSize: 12
    }
  });
