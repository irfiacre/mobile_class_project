/**
 * Learn more about Light and Dark modes:
 * https://docs.expo.io/guides/color-schemes/
 */

import {
  Text as DefaultText,
  View as DefaultView,
  TextInput as DefaultTextInput,
  KeyboardAvoidingView,
  TouchableOpacity,
} from "react-native";

import Colors from "@/constants/Colors";

type ThemeProps = {
  customColor?: string;
};

export type TextProps = ThemeProps & DefaultText["props"];
export type ViewProps = ThemeProps & DefaultView["props"];
export type TextInputProps = ThemeProps &
  DefaultTextInput["props"] & {
    isMessageBox: boolean;
    onInputChangeText: (identifier: string, text: string) => void;
    identifier: any;
    textValue: string;
  };
export type ButtonProps = ThemeProps &
  TouchableOpacity["props"] & {
    onPressBtn: () => void;
  };

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

export function TextInput(props: TextInputProps) {
  const { style, isMessageBox, onInputChangeText, textValue, identifier } =
    props;
  return (
    <KeyboardAvoidingView behavior="padding" style={{ width: "100%" }}>
      <DefaultTextInput
        style={[
          {
            marginVertical: 2.5,
            paddingHorizontal: 10,
            paddingVertical: 15,
            minHeight: isMessageBox ? 100 : 0,
            borderRadius: 8,
            borderColor: "gray",
            borderWidth: 1,
            fontSize: 18,
          },
          style,
        ]}
        multiline={isMessageBox}
        numberOfLines={isMessageBox ? 10 : 0}
        onChangeText={(text) =>
          onInputChangeText(identifier.toLocaleLowerCase(), text)
        }
        placeholderTextColor="grey"
        defaultValue={textValue}
        placeholder={`Enter ${identifier}.....`}
        secureTextEntry={identifier.toLocaleLowerCase().includes("password")}
        autoCapitalize={"none"}
      />
    </KeyboardAvoidingView>
  );
}

export function CustomButton(props: ButtonProps) {
  const { style, onPressBtn, children } = props;
  return (
    <TouchableOpacity
      onPress={() => onPressBtn()}
      style={[
        {
          marginVertical: 2.5,
          paddingHorizontal: 10,
          paddingVertical: 15,
          borderRadius: 6,
          borderColor: "gray",
          borderWidth: 1.5,
          width: "100%",
          alignItems: "center",
          justifyContent: "center",
        },
        style,
      ]}
    >
      {children}
    </TouchableOpacity>
  );
}
