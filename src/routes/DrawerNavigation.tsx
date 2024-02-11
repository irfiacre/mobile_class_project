import { StyleSheet, Text, Button } from "react-native";
import React, { useState } from "react";
import { createDrawerNavigator } from "@react-navigation/drawer";
import GenericScreen from "../Screens/GenericScreen";

const Drawer = createDrawerNavigator();

const DrawerNavigation = () => {
  return (
    <Drawer.Navigator>
      <Drawer.Screen name="Generic Screen 1" component={GenericScreen} />
      <Drawer.Screen name="Generic Screen 2" component={GenericScreen} />
    </Drawer.Navigator>
  );
};

export default DrawerNavigation;

const styles = StyleSheet.create({});
