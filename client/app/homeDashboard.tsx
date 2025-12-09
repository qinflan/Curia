import React, { useState, useEffect, useCallback } from "react";
import { View, Text, StyleSheet, ScrollView, RefreshControl, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import {
  fetchSavedBills,
  fetchStateReps
} from "@/api/billsHandler";
import { getUser } from "@/api/authHandler";
import SavedBillWidget from "@/components/SavedBillWidget";
import { Bill } from "@/components/types/BillWidgetTypes";
import SpinnerFallback from "@/components/SpinnerFallback";

export default function HomeDashboard() {
  const router = useRouter();
  const [savedBills, setSavedBills] = useState<Bill[]>([]);
  const [stateReps, setStateReps] = useState<any[]>([]);
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
    const loadStateReps = async () => {
      try {
        const reps = await fetchStateReps(user.state);
        setStateReps(reps);
      } catch (error) {
        console.error("Error fetching state rep bills:", error);
      } finally {
        setLoading(false);
      }
    };

    loadStateReps();
  }, [user]);

  const formatName = (firstName: string, lastName: string) => {
    const cap = (s: string) => s.charAt(0).toUpperCase() + s.slice(1).toLowerCase();
    return `${cap(firstName)} ${cap(lastName)}`;
  };


  if (loading) {
    return (
      <SpinnerFallback/>
    );
  }

  return (

    <ScrollView contentContainerStyle={styles.scrollViewContainer} refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}>
      <View style={styles.headerContainer}>
        <Text style={styles.headerText}>Saved</Text>
      </View>
      <View style={styles.billsContainer}>
        {user && savedBills.length > 0 ?

          (savedBills.map((bill) => (<SavedBillWidget key={bill._id} bill={bill} user={user} />)))
          :
          (
            <View style={styles.emptyBillsContainer}>
              <Text style={styles.caption}>No bills saved yet.</Text>
              <TouchableOpacity style={styles.navigateButton} onPress={() => { router.push("/recommendedFeed") }}>
                <Text style={styles.navigateButtonText}>Find legislation you care about</Text>
                <Ionicons name="document-text-outline" size={16} color="white" />
              </TouchableOpacity>
            </View>
          )}
      </View>

      <View style={styles.stateRepContainer}>
        <View style={styles.headerContainer}>
          <Text style={styles.headerText}>Your State&apos;s Representatives</Text>
        </View>
        <View style={styles.repBtnContainer}>
          {stateReps.map((rep) => (
            <TouchableOpacity
              key={rep._id}
              onPress={() =>
              router.push({
                pathname: '/stateRepBills',
                params: {
                  repId: rep._id,
                  firstName: rep.firstName,
                  lastName: rep.lastName,
                },
              })
            }
              style={styles.repButton}
            >
              <View>
                <Text style={styles.repNameText}>{formatName(rep.firstName, rep.lastName)}</Text>
                <Text style={styles.repPartyText}>
                  {rep.party === "D" ? "Democrat" : rep.party === "R" ? "Republican" : rep.party}
                </Text>
              </View>
              <Ionicons style={styles.repBtnIcon} name="arrow-forward" size={14}/>
            </TouchableOpacity>
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
    fontSize: 22,
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
    marginTop: 50,
    width: '100%',
    alignItems: 'center',
  },

  caption: {
    fontSize: 16,
    marginBottom: 12,
    fontFamily: "InterRegular",
    letterSpacing: -0.4,
  },

  navigateButton: {
    borderRadius: 16,
    paddingHorizontal: 26,
    paddingVertical: 16,
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: "black"
  },

  navigateButtonText: {
    fontFamily: "InterSemiBold",
    letterSpacing: -0.4,
    color: "white",
    fontSize: 14
  },
  
  repButton: {
    flexDirection: "row",
    padding: 12,
    marginHorizontal: 4,
    borderRadius: 12,
    backgroundColor: "#ffffffff",
    alignItems: "center",
    width: "90%",
  },

  repBtnContainer: {
    gap: 6
  },

  repBtnIcon: {
    marginLeft: "auto"
  },
  
  repNameText: {
    fontFamily: "InterSemiBold",
    letterSpacing: -0.5,
    color: "black",
    fontSize: 16
  },

  repPartyText: {
    fontFamily: "InterRegular",
    letterSpacing: -0.2,
    color: "black",
    fontSize: 14
  }

});
