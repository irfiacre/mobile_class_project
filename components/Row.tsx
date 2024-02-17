import { StyleSheet, Text, View } from "react-native";
import React from "react";

const Row = ({ children }: any) => {
  return <View style={styles.container}>{children}</View>;
};

export default Row;

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
  },
});
