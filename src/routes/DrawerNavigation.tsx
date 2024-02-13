import { StyleSheet, Text, Button } from "react-native";
import React, { useState } from "react";
import { createDrawerNavigator } from "@react-navigation/drawer";
import GenericScreen from "../Screens/GenericScreen";
import BottomNavigation from "./BottomNavigation";

const Drawer = createDrawerNavigator();

const DrawerNavigation = () => {
  return (
    <Drawer.Navigator>
      <Drawer.Screen name="Tab 1" component={GenericScreen} />
      <Drawer.Screen name="Tab 2" component={GenericScreen} />
    </Drawer.Navigator>
  );
};

export default DrawerNavigation;

const styles = StyleSheet.create({});
