import {
  Dimensions,
  StyleSheet,
  Text,
  View,
  Image,
  Animated,
  Easing,
} from "react-native";
import React from "react";

const Compass = (props: { display: string; spin: any }) => {
  const { display, spin } = props;

  return (
    <View style={styles.container}>
      <Text style={styles.text}>{display + "°"}</Text>

      <View style={styles.imageContainer}>
        <Animated.Image
          resizeMode="contain"
          source={require("../assets/images/compass/compass.png")}
          style={{
            width: deviceWidth - 10,
            height: deviceHeight / 2 - 10,
            left: deviceWidth / 2 - (deviceWidth - 10) / 2,
            top: deviceHeight / 2 - (deviceHeight / 2 - 10) / 2,
            transform: [{ rotate: spin }],
          }}
        />
      </View>
      <View style={styles.arrowContainer}>
        <Image
          resizeMode="contain"
          source={require("../assets/images/compass/arrow.png")}
          style={styles.arrow}
        />
      </View>
    </View>
  );
};

export default Compass;

const deviceWidth = Dimensions.get("window").width;
const deviceHeight = Dimensions.get("window").height;

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center",
  },
  text: {
    color: "#263544",
    fontSize: 80,
    transform: [{ translateY: 50 }],
  },
  imageContainer: {
    ...StyleSheet.absoluteFillObject,
  },
  arrowContainer: {
    ...StyleSheet.absoluteFillObject,
  },
  arrow: {
    width: deviceWidth / 7,
    height: deviceWidth / 7,
    left: deviceWidth / 2 - deviceWidth / 7 / 2,
    top: deviceHeight / 2 - deviceWidth / 7 / 2,
    opacity: 0.9,
  },
});
