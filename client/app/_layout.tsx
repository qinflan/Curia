import { Stack, useRouter, useSegments, useRootNavigationState } from "expo-router";
import { useEffect } from "react";
import { useFonts } from "expo-font";
import { Text, View } from "react-native";
import { AuthProvider, useAuth } from "../hooks/AuthContext";
import Navbar from "@/components/navbar";
import Header from "@/components/header";

function AppNavigator() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const segments = useSegments();
  const navigationState = useRootNavigationState();

  // segment public (unauthenticated) routes
  const publicRoutes = ["index", "login", "signup"];
  const protectedRoutes = ["homeDashboard", "recommendedFeed", "trending", "accountSettings", "stateRepBills"];
  const setupRoute = "accountSetup";

  useEffect(() => {
    if (!navigationState?.key) return;
    if (loading) return;

    const currentRoute = segments[segments.length - 1] || "index";
    if (!user && !publicRoutes.includes(currentRoute)) {
      router.replace("/");
    }
    if (user && !user.setupComplete && currentRoute !== setupRoute) {
      router.replace("/accountSetup");
    }
    if (user && user.setupComplete && publicRoutes.includes(currentRoute)) {
      router.replace("/homeDashboard");
    }
  }, [user, loading, navigationState?.key, segments]);

  if (loading) return <Text>Loading...</Text>;
  const currentRoute = segments[segments.length - 1];
  const showNavbar = protectedRoutes.includes(currentRoute);

  return (
    <View style={{ flex: 1 }}>
      {showNavbar && <Header />}
      <Stack screenOptions={{ headerShown: false }}>
        {/* All screens are always available */}
        <Stack.Screen name="index" />
        <Stack.Screen name="login" />
        <Stack.Screen name="signup" />
        <Stack.Screen name="faq" />
        <Stack.Screen name="accountSetup" />
        <Stack.Screen name="homeDashboard" />
        <Stack.Screen name="stateRepBills" />
        <Stack.Screen name="recommendedFeed" />
        <Stack.Screen name="accountSettings" />
      </Stack>
      {showNavbar && <Navbar />}
      </View>

  );
}


export default function RootLayout() {
  // load custom fonts
  const [fontsLoaded] = useFonts({
    InterRegular: require("../assets/fonts/Inter-Regular.ttf"),
    InterSemiBold: require("../assets/fonts/Inter-SemiBold.ttf"),
  });

  if (!fontsLoaded) {
    return <Text>Loading...</Text>;
  }
  return (
    <AuthProvider>
      <AppNavigator />
    </AuthProvider>
  );
}