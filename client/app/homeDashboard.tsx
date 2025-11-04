import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, ScrollView } from "react-native";
import { 
  fetchSavedBills, 
  fetchStateRepBills, 
} from "@/api/billsHandler";
import { getUser } from "@/api/authHandler";
import BillWidget from "@/components/BillWidget";
import { Bill } from "@/components/types/BillWidgetTypes";

export default function HomeDashboard() {
  // const user = getUser();
  const [savedBills, setSavedBills] = useState<Bill[]>([]);
  // const [stateRepBills, setStateRepBills] = useState<Bill[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadSavedBills = async () => {
      try {
        const savedBills = await fetchSavedBills();
        setSavedBills(savedBills);
      } catch (error) {
        console.error("Error fetching saved bills:", error);
      } finally {
        setLoading(false);
      }
    };

    loadSavedBills();
  }, []);

  // useEffect(() => {
  //   const loadStateRepBills = async () => {
  //     try {
  //       const stateRepBills = await fetchStateRepBills(user.state);
  //       setStateRepBills(stateRepBills);
  //     } catch (error) {
  //       console.error("Error fetching state rep bills:", error);
  //     } finally {
  //       setLoading(false);
  //     }
  //   };

  //   loadStateRepBills();
  // }, []);

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
        <Text style={styles.headerText}>Your Bills</Text>
      </View>
      <View style={styles.billsContainer}>
      {savedBills.map((bill) => (
        <BillWidget key={bill._id} bill={bill} />
      ))}
      </View>

      {/* <View style={styles.headerContainer}>
        <Text style={styles.headerText}>Bills Your State Representatives Support</Text>
      </View>
      <View style={styles.billsContainer}>
      {stateRepBills.map((bill) => (
        <BillWidget key={bill._id} bill={bill} />
      ))}
      </View> */}
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
