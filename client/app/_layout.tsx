import { Stack } from "expo-router";
import { useFonts } from "expo-font";
import { Text } from "react-native";

export default function RootLayout() {

  // load custiom fonts
  const [fontsLoaded] = useFonts({
  InterRegular: require("../assets/fonts/Inter-Regular.ttf"),
  InterSemiBold: require("../assets/fonts/Inter-SemiBold.ttf"),
  });
  
  if (!fontsLoaded) {
    return (
      <Text>Loading...</Text>
    )
  }

  // add state management here later
  // add navbar component here later

  
  // render app
  return (
  <Stack>
    <Stack.Screen name="index" options={{ headerShown: false }} />
    <Stack.Screen name="login" options={{ headerShown: false }} />
    <Stack.Screen name="signup" options={{ headerShown: false }} />

    {/* protect these routes once JWT works */}
    <Stack.Screen name="faq" options={{ headerShown: false }} />
    <Stack.Screen name="accountSetup" options={{ headerShown: false }} />
    <Stack.Screen name="homeDashboard" options={{ headerShown: false }} />
    <Stack.Screen name="recommendedFeed" options={{ headerShown: false }} />
    <Stack.Screen name="accountSettings" options={{ headerShown: false }} />
    {/*  */}
    
  </Stack>
  );
}
