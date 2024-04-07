import { StyleSheet, Text, View } from "react-native";
import React, { useEffect, useState } from "react";
import Value from "@/components/steps/Value";
import RingProgress from "@/components/steps/AnimatedRing";
import { useNavigation } from "expo-router";
import { Pedometer } from "expo-sensors";

const StepsCounter = () => {
  const navigation = useNavigation();

  const [isPedometerAvailable, setIsPedometerAvailable] = useState("checking");
  const [pastStepCount, setPastStepCount] = useState(0);
  const [currentStepCount, setCurrentStepCount] = useState(0);
  const subscribe = async () => {
    const isAvailable = await Pedometer.isAvailableAsync();
    setIsPedometerAvailable(String(isAvailable));

    if (isAvailable) {
      const end = new Date();
      const start = new Date();
      start.setDate(end.getDate() - 1);

      const pastStepCountResult = await Pedometer.getStepCountAsync(start, end);

      if (pastStepCountResult) {
        setPastStepCount(pastStepCountResult.steps);
      }

      return Pedometer.watchStepCount((result) => {
        setCurrentStepCount(result.steps);
      });
    }
  };
  useEffect(() => {
    navigation.getParent()?.setOptions({
      title: "Steps Count",
      headerRight: () => null,
    });
    const subscription = subscribe();
    return () => subscription && subscription.remove();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Today</Text>
      <RingProgress progress={0.8} />
      <View style={styles.valuesContainer}>
        <View style={styles.values}>
          <Value label="Yesterday" value={`${pastStepCount}`} />
          <Value label="Today" value={`${currentStepCount}`} />
          <Value
            label="Steps Counter"
            value={`${
              isPedometerAvailable == "false" ? "On" : "Not Supported"
            }`}
          />
        </View>
      </View>
    </View>
  );
};

export default StepsCounter;

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center",
    padding: 16,
  },
  title: {
    fontSize: 34,
    fontWeight: "700",
    fontFamily: "poppins",
    paddingVertical: "10%",
  },
  valuesContainer: {
    paddingHorizontal: "10%",
    paddingVertical: "10%",
  },
  values: {
    flexDirection: "row",
    gap: 25,
    flexWrap: "wrap",
  },
});
