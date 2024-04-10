import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Pressable,
} from "react-native";
import React, { useState } from "react";
import { AntDesign, MaterialIcons } from "@expo/vector-icons";
import LottieView from "lottie-react-native";
import { CustomButton, TextInput } from "@/components/Themed";
import {
  generateRandomString,
  primaryColor,
  validateEmail,
} from "@/util/helpers";
import { useToast } from "react-native-toast-notifications";
import { createUser, signInUser } from "@/services/firebaseService";
import { Button } from "native-base";
import LoginForm from "@/components/auth/LoginForm";
import SignUpForm from "@/components/auth/SignUpForm";

interface LoginUserDetails {
  email: string;
  password: string;
  errorMsg: string;
}

const LoginScreen = ({ promptAsync }: { promptAsync: () => void }) => {
  const toast = useToast();
  const [state, setState] = useState<LoginUserDetails>({
    email: "",
    password: "",
    errorMsg: "",
  });
  const [isLogin, setLogin] = useState<boolean>(false);

  const handleEmailLogin = async ({
    email,
    password,
  }: {
    email: string;
    password: string;
  }) => {
    const user = await signInUser({ email, password });
    console.log(user);
  };
  const handleEmailSignUp = async ({
    fname,
    lname,
    email,
    password,
  }: {
    fname: string;
    lname: string;
    email: string;
    password: string;
    errorMsg: string;
  }) => {
    const user = await createUser({
      name: `${fname} ${lname}`,
      email,
      password,
    });
    console.log(user);
  };
  return (
    <View style={styles.loginContainer}>
      <View style={styles.section}>
        <View>
          <LottieView
            resizeMode="cover"
            autoPlay
            style={{
              width: 200,
              height: 200,
            }}
            source={require("../assets/json/loginAnimation.json")}
          />
        </View>
      </View>
      <View style={styles.section}>
        {isLogin ? (
          <LoginForm handleSubmitForm={handleEmailLogin} />
        ) : (
          <SignUpForm handleSubmitForm={handleEmailSignUp} />
        )}
        <Pressable
          style={{
            paddingVertical: 15,
          }}
          onPress={() => setLogin((prevState: boolean) => !prevState)}
        >
          <Text
            style={{
              ...styles.text,
              width: "100%",
              color: primaryColor,
              fontWeight: "500",
              fontSize: 16,
              opacity: 0.9,
            }}
          >
            {isLogin ? "No Account! Sign Up" : "Has account! Login"}
          </Text>
        </Pressable>
      </View>
      {isLogin && (
        <View style={styles.section}>
          <View style={styles.loginWithGoogle}>
            <View style={styles.line}></View>
            <Text style={styles.text}>Or login With Google</Text>
            <View style={styles.line}></View>
          </View>

          <TouchableOpacity onPress={() => promptAsync()} style={styles.button}>
            <AntDesign name="google" size={48} color="white" />
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

export default LoginScreen;

const styles = StyleSheet.create({
  loginContainer: {
    flex: 1,
    marginTop: -50,
    padding: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  section: {
    width: "80%",
    alignItems: "center",
    justifyContent: "center",
    marginVertical: 5,
  },
  button: {
    backgroundColor: "#1d78d6",
    display: "flex",
    height: 70,
    width: 70,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 100,
    marginTop: 25,
  },
  text: {
    textAlign: "center",
    fontSize: 16,
    paddingHorizontal: 10,
    color: "#858597",
    fontFamily: "poppins",
  },
  loginWithGoogle: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  line: {
    height: 2,
    width: 50,
    backgroundColor: "#B8B8D2",
  },
});
