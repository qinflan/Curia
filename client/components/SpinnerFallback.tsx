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
      <ActivityIndicator />
    </View>
  );
}

export default SpinnerFallback