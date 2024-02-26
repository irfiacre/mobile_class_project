import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React, { useState } from "react";
import { TextInput } from "react-native-gesture-handler";
import PhoneInput from "react-native-international-phone-number";

const AddContactForm = (props: any) => {
  const { handleSubmit } = props;

  const [formState, setFormState] = useState({
    visible: false,
    firstName: "",
    lastName: "",
    digits: "",
    email: "",
    country: null,
  });

  const handleTextInput = (label: string, value: any) =>
    setFormState((prevState) => ({ ...prevState, [label]: value }));

  return (
    <View>
      <View>
        <TextInput
          style={styles.textInput}
          onChangeText={(text) => handleTextInput("firstName", text)}
          value={formState.firstName}
          placeholder="Enter first name..."
        />

        <TextInput
          style={styles.textInput}
          onChangeText={(text) => handleTextInput("lastName", text)}
          value={formState.lastName}
          placeholder="Enter last name..."
        />

        <PhoneInput
          value={formState.digits}
          onChangePhoneNumber={(phoneNbr) =>
            handleTextInput("digits", phoneNbr)
          }
          selectedCountry={formState.country}
          onChangeSelectedCountry={(selectedCountry) =>
            handleTextInput("country", selectedCountry)
          }
        />

        <TextInput
          style={styles.textInput}
          onChangeText={(text) => handleTextInput("email", text)}
          value={formState.email}
          placeholder="Enter Email..."
        />
      </View>
      <View style={styles.btnContainer}>
        <TouchableOpacity
          style={styles.btn}
          onPress={() => handleSubmit(formState)}
        >
          <Text>Submit</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default AddContactForm;

const styles = StyleSheet.create({
  textInput: {
    margin: 5,
    paddingHorizontal: 10,
    paddingVertical: 15,
    borderRadius: 6,
    borderColor: "gray",
    borderWidth: 1,
    backgroundColor: "#fff",
  },
  btn: {
    padding: 10,
    backgroundColor: "#1d78d6",
    color: "#fff",
    borderRadius: 6,
    width: 100,
    height: 45,
  },
  btnContainer: {
    alignContent: "center",
    justifyContent: "space-between",
  },
});
