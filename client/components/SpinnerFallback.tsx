import { ActivityIndicator, View } from 'react-native';

const SpinnerFallback = () => {
  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <ActivityIndicator color={"#8b8b8bff"}/>
    </View>
  );
}

export default SpinnerFallback