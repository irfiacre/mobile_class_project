import { StyleSheet, Animated, View, Easing, Text } from "react-native";
import React, { useEffect, useState } from "react";
import Compass from "@/components/Compass";
import * as Location from "expo-location";
import { useNavigation } from "expo-router";

const CompassScreen = () => {
  const navigation = useNavigation();
  const spinValue = new Animated.Value(0);
  const [state, setState] = useState({
    location: null,
    errorMessage: null,
    heading: 0,
    truenoth: null,
  });

  const getLocationAsync = async () => {
    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== "granted") {
      setState((prevState: any) => ({
        ...prevState,
        errorMessage: "Permission to access location was denied",
      }));
      return;
    }
    let location = await Location.getCurrentPositionAsync({});
    await Location.watchHeadingAsync((obj) =>
      setState((prevState: any) => ({ ...prevState, heading: obj.magHeading }))
    );

    setState((prevState: any) => ({ ...prevState, location: location }));
  };
  const spin = () => {
    let start = JSON.stringify(spinValue);
    let heading = Math.round(state.heading);

    let rot = +start;
    let rotM = rot % 360;

    if (rotM < 180 && heading > rotM + 180) rot -= 360;
    if (rotM >= 180 && heading <= rotM - 180) rot += 360;

    rot += heading - rotM;

    Animated.timing(spinValue, {
      toValue: rot,
      duration: 300,
      easing: Easing.ease,
      useNativeDriver: true,
    }).start();
  };
  useEffect(() => {
    navigation.getParent()?.setOptions({
      title: "Compass",
      headerRight: () => null,
    });
    getLocationAsync();
    spin();
  }, []);

  let LoadingText = "Loading...";
  let display: any = LoadingText;

  if (state.errorMessage) display = state.errorMessage;

  const componentSpin = spinValue.interpolate({
    inputRange: [0, 360],
    outputRange: ["-0deg", "-360deg"],
  });

  display = Math.round(JSON.stringify(spinValue));

  if (display < 0) display += 360;
  if (display > 360) display -= 360;

  return (
    <View>
      <Compass spin={componentSpin} display={display} />
    </View>
  );
};

export default CompassScreen;

const styles = StyleSheet.create({});
