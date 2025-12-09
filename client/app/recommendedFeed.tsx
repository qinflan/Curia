import { Text, View, ScrollView, StyleSheet, RefreshControl, FlatList } from "react-native";
import { useState, useEffect, useCallback } from "react";
import { getUser } from "@/api/authHandler";
import { fetchRecommendedBills } from "@/api/billsHandler";
import BillWidget from "@/components/BillWidget";
import { Bill } from "@/components/types/BillWidgetTypes";
import SearchBar from "@/components/SearchBar";
import SpinnerFallback from "@/components/SpinnerFallback";

export default function RecommendedFeed() {
  const [bills, setBills] = useState<Bill[]>([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
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

  // INFINITE SCROLL
  const loadRecommendedBills = useCallback(async (pageNumber = 1) => {
    try {
      if (pageNumber === 1 && !refreshing) setLoading(true);
      else setLoadingMore(true);

      const response = await fetchRecommendedBills(pageNumber);
      const newBills = response.data;

      if (pageNumber === 1) {
      setBills(newBills);
    } else {
      setBills(prev => [...prev, ...newBills]);
    }

    setHasMore(newBills.length > 0);
    setPage(pageNumber);

    } catch (error) {
      console.error("Error fetching recommended bills:", error);
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  }, [refreshing]);

  useEffect(() => {
    loadRecommendedBills(1);
  }, [loadRecommendedBills]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    setHasMore(true);
    await loadRecommendedBills(1);
    setRefreshing(false);
  }, [loadRecommendedBills]);

  const loadMore = () => {
    if (loadingMore || !hasMore || searchTerm.length > 0) return;
    loadRecommendedBills(page + 1);
  };

  const handleSearch = useCallback(
    (results: Bill[], keyword: string) => {
      if (!keyword || keyword.length === 0) {
        setSearchTerm("");
        loadRecommendedBills(1);
        return;
      }
      setBills(results);
      setSearchTerm(keyword);
      setHasMore(false);
    },
    [loadRecommendedBills]
  );

  if (loading) {
    return (
      <SpinnerFallback />
    );
  }

  return (

    <View style={styles.container}>
      <FlatList 
        data={bills}
        keyExtractor={(item) => item._id}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => 
          user ?
            <View style={styles.billWrapper}> 
              <BillWidget bill={item} user={user}/> 
            </View>
            : null
        }

        ListHeaderComponent={
          <>
            <View style={styles.headerContainer}>
               <SearchBar onSearch={handleSearch} />
              <Text style={styles.headerText}>
                {searchTerm ? `Results for "${searchTerm}"` : "Recommended"}
              </Text>
            </View>
          </>
        }
        contentContainerStyle={styles.billsContainer}
        onEndReached={loadMore}
        onEndReachedThreshold={0.5}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
    alignItems: 'center',
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
    width: '100%',
    paddingBottom: 50,
    alignItems: 'center',
  },

  billWrapper: {
    alignSelf: "center",
    marginHorizontal: 16
  },

  headerContainer: {
    width: '90%',
    alignItems: 'center',
    marginTop: 16,
  }
});
