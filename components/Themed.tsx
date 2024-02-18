/**
 * Learn more about Light and Dark modes:
 * https://docs.expo.io/guides/color-schemes/
 */

import { Text as DefaultText, View as DefaultView } from "react-native";

import Colors from "@/constants/Colors";

type ThemeProps = {
  customColor?: string;
};

export type TextProps = ThemeProps & DefaultText["props"];
export type ViewProps = ThemeProps & DefaultView["props"];

export function Text(props: TextProps) {
  const { style, customColor, ...otherProps } = props;
  const color = customColor ? customColor : Colors["text"];

  return <DefaultText style={[{ color }, style]} {...otherProps} />;
}

export function View(props: ViewProps) {
  const { style, customColor, ...otherProps } = props;
  const backgroundColor = customColor ? customColor : Colors["background"];

  return <DefaultView style={[{ backgroundColor }, style]} {...otherProps} />;
}
