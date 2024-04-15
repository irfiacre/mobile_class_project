import { Pressable, StyleSheet, Text, View } from "react-native";
import React, { useEffect, useState } from "react";
import { useNavigation } from "expo-router";
import { primaryColor } from "@/util/helpers";
import * as Brightness from "expo-brightness";
import ProgressComponent from "@/components/ProgressComponent";
import Torch from "react-native-torch";

const changeBrightness = async (value: number) => {
  const { status } = await Brightness.requestPermissionsAsync();
  if (status === "granted") {
    Brightness.setSystemBrightnessAsync(value);
  }
};

const LightScreen = () => {
  const navigation = useNavigation();
  const [state, setState] = useState({
    brightnessLevel: 0.2,
    isTorchOn: false,
  });
  useEffect(() => {
    navigation.getParent()?.setOptions({
      title: "Light Sensor",
      headerRight: () => "",
    });
  }, []);
  const handlePressTorch = () => {
    Torch.switchState(!state.isTorchOn);
    setState((prevState: any) => ({
      ...prevState,
      isTorchOn: prevState.isTorchOn,
    }));
  };
  return (
    <View style={styles.lightContainer}>
      <View>
        <Pressable onPress={handlePressTorch}>
          <Text style={styles.buttonTextStyle}>
            {state.isTorchOn ? "Turn off the Torch" : "Turn on the Torch"}
          </Text>
        </Pressable>
      </View>
      <View>
        <Text>Brightness Level: {state.brightnessLevel * 100} % </Text>
        <ProgressComponent
          onChangeValue={(value) => {
            setState((prevState: any) => ({
              ...prevState,
              brightnessLevel: value,
            }));
            changeBrightness(value);
          }}
        />
      </View>
    </View>
  );
};

export default LightScreen;

const styles = StyleSheet.create({
  lightContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },

  resetBtnContainer: {
    padding: 10,
  },
  resetBtnText: {
    color: primaryColor,
    fontWeight: "600",
    fontSize: 18,
  },
  buttonStyle: {
    justifyContent: "center",
    marginTop: 15,
    padding: 10,
    backgroundColor: "#8ad24e",
    marginRight: 2,
    marginLeft: 2,
  },
  buttonTextStyle: {
    color: primaryColor,
    textAlign: "center",
  },
});
