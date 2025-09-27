import { Stack } from "expo-router";
import { useFonts } from "expo-font";
import { Text } from "react-native";

export default function RootLayout() {

  const [fontsLoaded] = useFonts({
  InterRegular: require("../assets/fonts/Inter-Regular.ttf"),
  InterSemiBold: require("../assets/fonts/Inter-SemiBold.ttf"),
  });
  
  // dont't render app before loading fonts
  // insert a loading animation pls
  if (!fontsLoaded) {
    return (
      <Text>Loading...</Text>
    )
  }

  return (
  <Stack>
    <Stack.Screen name="index" options={{ headerShown: false }} />
    <Stack.Screen name="login" options={{ title: "Login" }} />
    <Stack.Screen name="signup" options={{ title: "Sign Up" }} />
  </Stack>
  );
}
