import { Text, View, StyleSheet, RefreshControl, FlatList } from "react-native";
import React, { useState, useEffect, useCallback } from 'react'
import { fetchTrendingBills } from "@/api/billsHandler";
import { getUser } from "@/api/authHandler";
import BillWidget from "@/components/BillWidget";
import type { Bill } from "@/components/types/BillWidgetTypes";
import SpinnerFallback from "@/components/SpinnerFallback";

export default function TrendingBills() {
  const [bills, setBills] = useState<Bill[]>([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
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

  const loadTrendingBills = useCallback(async (pageNumber = 1) => {
    try {
      const response = await fetchTrendingBills(pageNumber);
      const newBills = response.data;

      if (pageNumber === 1) {
        setBills(newBills);
      } else {
        setBills(prev => [...prev, ...newBills]);
      }

      setHasMore(newBills.length > 0);
      setPage(pageNumber);
      
    } catch (error) {
      console.error("Error fetching trending bills:", error);
    } finally {
      setLoading(false);
      setLoadingMore(false);
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

    const loadMore = () => {
    if (loadingMore || !hasMore) return;
    loadTrendingBills(page + 1);
  };

  if (loading) {
    return (
      <SpinnerFallback />
    );
  }

  return (
    <FlatList
      data={bills}
      keyExtractor={(item) => item._id}
      ListHeaderComponent={
        <View style={styles.headerContainer}>
          <Text style={styles.headerText}>Trending Bills</Text>
        </View>
      }
      renderItem={({ item }) => user && 
        <View style={styles.billWrapper}>
          <BillWidget bill={item} user={user} />
        </View>
      }
      showsVerticalScrollIndicator={false}
      contentContainerStyle={styles.billsContainer}
      onEndReached={loadMore }
      onEndReachedThreshold={0.5}
      ListFooterComponent={
        loadingMore ? <SpinnerFallback /> : null
      }
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
    />
  );  
}

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      width: '100%',
      alignItems: 'center',
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
      width: '100%',
      paddingBottom: 50,
    },

    billWrapper: {
      marginHorizontal: 16
    },

    headerContainer: {
      marginHorizontal: 16,
      marginTop: 16,
    }
  });

