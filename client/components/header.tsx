import { View, TouchableOpacity, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Logo from "../assets/images/lockup-light.svg";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useRouter } from "expo-router";

export default function Header() {
  const router = useRouter();

  return (
      <SafeAreaView edges={["top"]} style={styles.safeArea}>
        <View style={styles.container}>
          <Logo width={100} height={68} style={styles.logo} />
          <TouchableOpacity style={styles.bellIcon} onPress={() => router.push('/inbox')}>
            <Ionicons name="notifications" size={22} color="black" />
          </TouchableOpacity>
        </View>
      </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    backgroundColor: "#fff",
  },
  container: {
    flexDirection: "row",
    alignItems: "center",
    top: 0,
    width: "100%",
    height: 45,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#dadadaff",
  },

  logo: {
    width: "100%",
    marginLeft: 20
  },

  bellIcon: {
    position: "absolute",
    right: 25,
  }
});
