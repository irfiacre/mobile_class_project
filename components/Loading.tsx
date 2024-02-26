import { StyleSheet, View } from "react-native";
import React from "react";
import LottieView from "lottie-react-native";

const Loading = () => {
  return (
    <View style={styles.container}>
      <LottieView
        resizeMode="cover"
        autoPlay
        style={{
          width: 400,
          height: 600,
        }}
        source={require("../assets/json/loading-animation2.json")}
      />
    </View>
  );
};

export default Loading;

const styles = StyleSheet.create({
  container: {
    alignContent: "center",
    justifyContent: "center",
    alignItems: "center",
    flex: 0.8,
  },
});
