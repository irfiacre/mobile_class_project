import { StyleSheet, Text, Button } from "react-native";
import React, { useState } from "react";
import { createStackNavigator } from "@react-navigation/stack";
import GenericScreen from "../Screens/GenericScreen";
import AboutUsScreen from "../Screens/AboutUs";

const Stack = createStackNavigator();

const DrawerNavigation = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen name="About Us" component={AboutUsScreen} />
      <Stack.Screen name="Stack1" component={GenericScreen} />
    </Stack.Navigator>
  );
};

export default DrawerNavigation;

const styles = StyleSheet.create({});
