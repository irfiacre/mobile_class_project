import { StyleSheet, Text, View } from "react-native";
import React, { useState } from "react";
import { CustomButton, TextInput } from "../Themed";
import { primaryColor, validateEmail } from "@/util/helpers";

interface SignUpUserDetails {
  fname: string;
  lname: string;
  email: string;
  password: string;
  errorMsg: string;
}

const SignUpForm = ({
  handleSubmitForm,
}: {
  handleSubmitForm: ({
    fname,
    lname,
    email,
    password,
  }: {
    fname: string;
    lname: string;
    email: string;
    password: string;
  }) => void;
}) => {
  const [state, setState] = useState<SignUpUserDetails>({
    fname: "",
    lname: "",
    email: "",
    password: "",
    errorMsg: "",
  });

  const handleSubmit = () => {
    const { fname, lname, email, password } = state;
    if (!email || !password) {
      setState((prevState: SignUpUserDetails) => ({
        ...prevState,
        errorMsg: `Please Enter ${!email ? "Email" : "Password"}`,
      }));
    } else {
      if (!validateEmail(email)) {
        setState((prevState: SignUpUserDetails) => ({
          ...prevState,
          errorMsg: "Invalid Email Address",
        }));
        return;
      }

      handleSubmitForm({ fname, lname, email, password });
    }
  };
  return (
    <View style={styles.container}>
      <Text style={styles.loginText}>Sign Up</Text>
      <TextInput
        isMessageBox={false}
        onInputChangeText={(_, text: string) => {
          setState((prevState: SignUpUserDetails) => ({
            ...prevState,
            errorMsg: "",
            fname: text,
          }));
        }}
        textValue={state.fname}
        identifier="First Name"
        style={styles.inputStyle}
      />
      <TextInput
        isMessageBox={false}
        onInputChangeText={(_, text: string) => {
          setState((prevState: SignUpUserDetails) => ({
            ...prevState,
            errorMsg: "",
            lname: text,
          }));
        }}
        textValue={state.lname}
        identifier="Last Name"
        style={styles.inputStyle}
      />
      <TextInput
        isMessageBox={false}
        onInputChangeText={(_, text: string) => {
          setState((prevState: SignUpUserDetails) => ({
            ...prevState,
            errorMsg: "",
            email: text,
          }));
        }}
        textValue={state.email}
        identifier="Email"
        style={styles.inputStyle}
      />
      <TextInput
        isMessageBox={false}
        onInputChangeText={(_, text: string) => {
          setState((prevState: SignUpUserDetails) => ({
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
        <Text style={styles.submitText}>sign up</Text>
      </CustomButton>
    </View>
  );
};

export default SignUpForm;

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
    fontFamily: "poppins",
  },
  errorText: {
    fontSize: 16,
    paddingHorizontal: 10,
    fontFamily: "poppins",
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
    fontFamily: "poppins",
  },
  inputStyle: {
    marginVertical: 5,
    paddingHorizontal: 10,
    paddingVertical: 15,
    fontSize: 16,
  },
});
