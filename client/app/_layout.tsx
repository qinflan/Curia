import { Stack } from "expo-router";

export default function RootLayout() {
  return (
  <Stack>
    <Stack.Screen name="index" options={{ title: "Curia" }} />
    <Stack.Screen name="login" options={{ title: "Login" }} />
    <Stack.Screen name="signup" options={{ title: "Sign Up" }} />
  </Stack>
  );
}
