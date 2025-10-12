import { Stack, useRouter, useSegments } from "expo-router";
import { useEffect } from "react";
import { useFonts } from "expo-font";
import { Text } from "react-native";
import { AuthProvider, useAuth } from "../hooks/AuthContext";

function AppNavigator() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const segments = useSegments();

  // segment public (unauthenticated) routes
  const publicRoutes = ["index", "login", "signup"];

  useEffect(() => {
    if (loading) return;
    const currentRoute = segments[segments.length - 1];
    if (!user && !publicRoutes.includes(currentRoute)) {
      router.replace("/");
    }
    if (user && publicRoutes.includes(currentRoute)) {
      router.replace("/homeDashboard");
    }
  }, [user, loading, segments]);

  if (loading) return <Text>Loading...</Text>;

  return (
    <Stack screenOptions={{ headerShown: false }}>
      {/* All screens are always available */}
      <Stack.Screen name="index" />
      <Stack.Screen name="login" />
      <Stack.Screen name="signup" />
      <Stack.Screen name="faq" />
      <Stack.Screen name="accountSetup" />
      <Stack.Screen name="homeDashboard" />
      <Stack.Screen name="recommendedFeed" />
      <Stack.Screen name="accountSettings" />
    </Stack>
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