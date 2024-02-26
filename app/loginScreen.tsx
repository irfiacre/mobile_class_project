import { StyleSheet, Text, View } from "react-native";
import React, { useEffect, useState } from "react";
import { TouchableOpacity } from "react-native-gesture-handler";
import { AntDesign } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import LottieView from "lottie-react-native";
import * as WebBrowser from "expo-web-browser";
import * as Google from "expo-auth-session/providers/google";
import AsyncStorage from "@react-native-async-storage/async-storage";

const LoginScreen = () => {
  const [userInfo, setUserInfo] = useState(null);
  const router = useRouter();
  const [request, response, promptAsync] = Google.useAuthRequest({
    androidClientId:
      "1096089247583-odt2204vbuv51gkilvn29d0aoug5vqsb.apps.googleusercontent.com",
    iosClientId:
      "1096089247583-vsbhg8efh7r3inv18sv062qeo7b1ankr.apps.googleusercontent.com",
    webClientId:
      "1096089247583-cmmacd26vo8ub2d590g861aoglikgepq.apps.googleusercontent.com",
  });

  useEffect(() => {
    console.log("))))))))");

    handleSignInWithGoogle();
  }, [promptAsync]);

  const handleSignInWithGoogle = async () => {
    const user = await AsyncStorage.getItem("@user");
    console.log(user, "userrrrrrrrrrr");
    if (!user) {
      if (response?.type === "success") {
        const user = await getUserInfo(response.authentication?.accessToken);
        console.log(user, "========>>");
      }
    } else {
      setUserInfo(JSON.parse(user));
    }
    // console.log("----->", userInfo);
    if (userInfo) {
    }
  };

  const getUserInfo = async (token: any) => {
    if (!token) return;
    try {
      const response = await fetch(
        "https://www.googleapis.com/userinfo/v2/me",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const user = await response.json();
      await AsyncStorage.setItem("@user", JSON.stringify(user));
      setUserInfo(user);

      router.replace("/(tabs)");
    } catch (error) {
      console.log({ error });
    }
  };

  console.log(userInfo, "useringo 00000000");
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

      <Text style={styles.text}>Login using</Text>
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
