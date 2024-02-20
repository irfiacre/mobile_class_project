import { StyleSheet, Text, View } from "react-native";
import React from "react";
import { TouchableOpacity } from "react-native-gesture-handler";
import { SafeAreaView } from "react-native-safe-area-context";
import { AntDesign } from "@expo/vector-icons";
import { router } from "expo-router";
import LottieView from "lottie-react-native";

const LoginScreen = () => {
  return (
    <View style={styles.loginContainer}>
      <SafeAreaView />
      <View>
        <LottieView
          resizeMode="cover"
          autoPlay
          style={{
            width: 300,
            height: 300,
            // backgroundColor: "#eee",
          }}
          // Find more Lottie files at https://lottiefiles.com/featured
          source={require("../../assets/json/loginAnimation.json")}
        />
      </View>

      <Text style={styles.text}>Login using</Text>
      <TouchableOpacity
        onPress={() =>
          router.push({
            pathname: "/(tabs)",
            // params:
          })
        }
        style={styles.button}
      >
        <AntDesign name="google" size={48} color="white" />
      </TouchableOpacity>
    </View>
  );
};

export default LoginScreen;

const styles = StyleSheet.create({
  loginContainer: {
    flex: 1,
    padding: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  button: {
    backgroundColor: "#333333",
    display: "flex",
    height: 50,
    width: 50,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 100,
    margin: 5,
  },
  text: {
    // color: "#fff",
    textAlign: "center",
    fontSize: 24,
  },
});
