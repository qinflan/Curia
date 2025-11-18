import { View, TouchableOpacity, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter, usePathname } from "expo-router";
import Ionicons from "@expo/vector-icons/Ionicons";

type Route =  
  | "/homeDashboard"
  | "/recommendedFeed"
  | "/trending"
  | "/accountSettings";


export default function Navbar() {
  const router = useRouter();
  const pathname = usePathname();

  const navItems: {route: Route; icon: string}[] = [
    { route: "/homeDashboard", icon: "home" },
    { route: "/recommendedFeed", icon: "search" },
    { route: "/trending", icon: "flame" },
    { route: "/accountSettings", icon: "person-circle" },
  ];

  return (
    <SafeAreaView edges={['bottom']} style={styles.safeArea}>
      <View style={styles.container}>
        {navItems.map(({ route, icon }) => {
          const isActive = pathname === route;
          const iconName = isActive ? icon : `${icon}-outline`;

          return (
            <TouchableOpacity key={route} onPress={() => router.push(route)}>
              <Ionicons
                name={iconName}
                size={30}
                color="black"
              />
            </TouchableOpacity>
          );
        })}
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
    justifyContent: "center",
    gap: 50,
    bottom: 0,
    width: "100%",
    height: 65,
    backgroundColor: "#fff",
    borderTopWidth: 1,
    borderTopColor: "#ccc",
  },
});
