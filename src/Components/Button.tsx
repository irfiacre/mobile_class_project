import { Dimensions, StyleSheet, Text, TouchableOpacity } from "react-native";
import React from "react";

interface BtnProps {
  onPress: () => void;
  text: string;
  size: string;
  theme: string;
}

const Button = ({
  onPress,
  text,
  size = "primary",
  theme = "light",
}: BtnProps) => {
  const btnStyles: Array<any> = [styles.button];
  const textStyles: Array<any> = [styles.text];
  if (size === "double") {
    btnStyles.push(styles.buttonDouble);
  }

  if (theme === "secondary") {
    btnStyles.push(styles.buttonSecondary);
    textStyles.push(styles.textSecondary);
  } else if (theme === "accent") {
    btnStyles.push(styles.buttonAccent);
  }
  return (
    <TouchableOpacity onPress={onPress} style={btnStyles}>
      <Text style={textStyles}>{text}</Text>
    </TouchableOpacity>
  );
};

export default Button;
const screen = Dimensions.get("window");
const buttonWidth = screen.width / 4;

const styles = StyleSheet.create({
  button: {
    backgroundColor: "#333333",
    flex: 1,
    height: Math.floor(buttonWidth - 10),
    alignItems: "center",
    justifyContent: "center",
    borderRadius: Math.floor(buttonWidth),
    margin: 5,
  },
  text: {
    color: "#fff",
    fontSize: 24,
  },
  textSecondary: {
    color: "#060606",
  },
  buttonDouble: {
    width: screen.width / 2 - 10,
    flex: 0,
    alignItems: "flex-start",
    paddingLeft: 40,
  },
  buttonSecondary: {
    backgroundColor: "#1d78d6",
  },
  buttonAccent: {
    backgroundColor: "#1d78d6",
  },
});
