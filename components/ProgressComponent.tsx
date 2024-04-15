import React, { useEffect, useState } from "react";
import { View, StyleSheet, Text } from "react-native";
import Slider from "@react-native-community/slider";

const ProgressComponent = (props: { onChangeValue: (value: any) => void }) => {
  const [value, setValue] = useState(0.2);
  const { onChangeValue } = props;
  useEffect(() => {
    onChangeValue(value.toFixed(1));
  }, [value]);

  return (
    <View style={{ alignItems: "center" }}>
      <Slider
        step={0.2}
        style={styles.slider}
        {...props}
        value={value}
        onValueChange={setValue}
      />
    </View>
  );
};

export default ProgressComponent;

const styles = StyleSheet.create({
  slider: {
    width: 300,
    opacity: 1,
    marginTop: 10,
  },
});
