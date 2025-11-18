import { Text, View, ScrollView, StyleSheet, RefreshControl } from "react-native";
import { useState, useEffect, useCallback } from "react";
import { getUser } from "@/api/authHandler";
import { fetchRecommendedBills } from "@/api/billsHandler";
import BillWidget from "@/components/BillWidget";
import { Bill } from "@/components/types/BillWidgetTypes";
import SearchBar from "@/components/SearchBar";
import SpinnerFallback from "@/components/SpinnerFallback";

export default function RecommendedFeed() {
  const [bills, setBills] = useState<Bill[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
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

  const loadRecommendedBills = useCallback(async () => {
    try {
      const bills = await fetchRecommendedBills();
      setBills(bills);
    } catch (error) {
      console.error("Error fetching recommended bills:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadRecommendedBills();
  }, [loadRecommendedBills]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await loadRecommendedBills();
    setRefreshing(false);
  }, [loadRecommendedBills]);

  if (loading) {
    return (
      <SpinnerFallback />
    );
  }

  return (

    <ScrollView contentContainerStyle={styles.scrollViewContainer} refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}>
      <SearchBar onSearch={(results, keyword) => {
        setBills(results);
        setSearchTerm(keyword);
      }} />
      <View style={styles.headerContainer}>
        <Text style={styles.headerText}>
          {searchTerm ? `Results for "${searchTerm}"` : "Recommended"}
        </Text>
      </View>
      <View style={styles.billsContainer}>
        {user && bills.map((bill) => (
          <BillWidget key={bill._id} bill={bill} user={user} />
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
