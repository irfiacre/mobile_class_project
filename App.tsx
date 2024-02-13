import { useState } from "react";
import "react-native-gesture-handler";
import { StyleSheet, View } from "react-native";
import { NavigationContainer, DefaultTheme } from "@react-navigation/native";
import BottomNavigation from "./src/routes/BottomNavigation";

export default function App() {
  const MyTheme = {
    ...DefaultTheme,
    colors: {
      ...DefaultTheme.colors,
      primary: "rgb(255, 45, 85)",
    },
  };
  return (
    <View style={styles.container}>
      <NavigationContainer>
        <BottomNavigation />
      </NavigationContainer>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // backgroundColor: "#202020",
    justifyContent: "flex-end",
  },
});
