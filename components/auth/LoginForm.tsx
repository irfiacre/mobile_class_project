import { StyleSheet, Text, View } from "react-native";
import React, { useState } from "react";
import { CustomButton, TextInput } from "../Themed";
import { primaryColor, validateEmail } from "@/util/helpers";

interface LoginUserDetails {
  email: string;
  password: string;
  errorMsg: string;
}

const LoginForm = ({
  handleSubmitForm,
}: {
  handleSubmitForm: ({
    email,
    password,
  }: {
    email: string;
    password: string;
  }) => void;
}) => {
  const [state, setState] = useState<LoginUserDetails>({
    email: "",
    password: "",
    errorMsg: "",
  });

  const handleSubmit = () => {
    const { email, password } = state;
    if (!email || !password) {
      setState((prevState: LoginUserDetails) => ({
        ...prevState,
        errorMsg: `Please Enter ${!email ? "Email" : "Password"}`,
      }));
    } else {
      if (!validateEmail(email)) {
        setState((prevState: LoginUserDetails) => ({
          ...prevState,
          errorMsg: "Invalid Email Address",
        }));
        return;
      }

      handleSubmitForm({ email, password });
    }
  };
  return (
    <View style={styles.container}>
      <Text style={styles.loginText}>Login</Text>
      <TextInput
        isMessageBox={false}
        onInputChangeText={(_, text: string) => {
          setState((prevState: LoginUserDetails) => ({
            ...prevState,
            errorMsg: "",
            email: text.toLowerCase(),
          }));
        }}
        textValue={state.email}
        identifier="Email"
        style={styles.inputStyle}
      />
      <TextInput
        isMessageBox={false}
        onInputChangeText={(_, text: string) => {
          setState((prevState: LoginUserDetails) => ({
            ...prevState,
            errorMsg: "",
            password: text,
          }));
        }}
        textValue={state.password}
        identifier="Password"
        style={styles.inputStyle}
      />
      <Text style={styles.errorText}>{state.errorMsg}</Text>
      <CustomButton
        style={{
          backgroundColor: primaryColor,
          borderColor: primaryColor,
          padding: 10,
          marginVertical: 10,
          borderRadius: 8,
        }}
        onPressBtn={() => handleSubmit()}
      >
        <Text style={styles.submitText}>login</Text>
      </CustomButton>
    </View>
  );
};

export default LoginForm;

const styles = StyleSheet.create({
  container: {
    width: "100%",
  },
  loginText: {
    textAlign: "left",
    width: "100%",
    fontWeight: "700",
    fontSize: 24,
    marginVertical: 15,
  },
  errorText: {
    fontSize: 16,
    paddingHorizontal: 10,
    width: "100%",
    textAlign: "left",
    color: "#F95368",
    paddingVertical: 5,
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
    fontSize: 18,
    fontWeight: "500",
  },
  inputStyle: {
    marginVertical: 2.5,
    paddingHorizontal: 10,
    paddingVertical: 15,
    fontSize: 16,
  },
});
