import { Text, View, TouchableOpacity, StyleSheet } from "react-native";
import { useRouter } from "expo-router";

export default function Navbar() {
  return (

    <View style={styles.container}>
      <TouchableOpacity>
        <Text>Home</Text>
      </TouchableOpacity>
            <TouchableOpacity>
        <Text>Feed</Text>
      </TouchableOpacity>
            <TouchableOpacity>
        <Text>Search</Text>
      </TouchableOpacity>
            <TouchableOpacity>
        <Text>profile</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({ 
  container: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    bottom: 0,
    width: "100%",
    height: 60,
    backgroundColor: "#fff",
    borderTopWidth: 1,
    borderTopColor: "#ccc",
  }
});
