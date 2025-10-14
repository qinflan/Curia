import { Text, View, StyleSheet, Button } from "react-native";
import { useAuth } from "@/hooks/AuthContext";

export default function AccountSettings() {
  const { user, logout } = useAuth();
  return (

    <View style={styles.container}>
      <Text>{user?.firstName} {user?.lastName} </Text>
      <Button title="Log Out" onPress={logout} />
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
