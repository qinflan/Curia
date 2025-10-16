import { Text, View, StyleSheet, Button } from "react-native";
import { useAuth } from "@/hooks/AuthContext";
import { useRouter } from "expo-router";

export default function AccountSettings() {
  const { user, logout } = useAuth();
  const router = useRouter();

  return (

    <View style={styles.container}>
      <Text>{user?.firstName} {user?.lastName} </Text>
      <Button title="Log Out" onPress={logout} />
      <Button title="FAQ" onPress={() => router.push("/faq")} />
    </View>

  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  }
});
