import { StyleSheet, Text, View } from "react-native";
import React from "react";
import { Skeleton } from "native-base";
import { generateRandomString, primaryColor } from "@/util/helpers";

const SkeletonComponent = (props: {
  numberOfSkeletons: number;
  startColor: string;
}) => {
  const { numberOfSkeletons } = props;
  return (
    <View>
      {Array.from({ length: numberOfSkeletons }).map((_, index) => (
        <Skeleton
          key={generateRandomString("skeleton")}
          borderWidth={1}
          borderColor="gray.100"
          style={{
            height: 100,
            borderRadius: 9,
            marginVertical: 2.5,
          }}
          startColor={"gray.300"}
        />
      ))}
    </View>
  );
};

export default SkeletonComponent;

const styles = StyleSheet.create({});
