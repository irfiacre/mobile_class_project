import { StyleSheet, Text, View, TouchableOpacity } from "react-native";
import React from "react";
import { AntDesign } from "@expo/vector-icons";
import LottieView from "lottie-react-native";

const LoginScreen = ({ promptAsync }: { promptAsync: () => void }) => {
  return (
    <View style={styles.loginContainer}>
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
          source={require("../assets/json/loginAnimation.json")}
        />
      </View>
      <Text style={styles.text}>Login With Google</Text>
      <TouchableOpacity onPress={() => promptAsync()} style={styles.button}>
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
    backgroundColor: "#1d78d6",
    display: "flex",
    height: 50,
    width: 50,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 100,
    margin: 5,
  },
  text: {
    textAlign: "center",
    fontSize: 24,
  },
  submitBtn: {
    backgroundColor: "#1d78d6",
    borderColor: "#1d78d6",
    width: "50%",
    marginBottom: 45,
    marginVertical: 5,
  },
  submitText: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "700",
  },
});
