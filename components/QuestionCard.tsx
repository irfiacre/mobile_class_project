import { Pressable, StyleSheet, Text, View } from "react-native";
import React from "react";
import { View as CustomView } from "@/components/Themed";
import { useRouter } from "expo-router";

const QuestionDetails = (props: any) => {
  const { id, title, status } = props;
  const router = useRouter();

  return (
    <View>
      <Pressable
        style={styles.Question}
        onPress={() =>
          router.push({
            pathname: "/quiz/[id]",
            params: { id: id },
          })
        }
      >
        <View style={styles.QuestionDetails}>
          <Text style={styles.title}>{title}</Text>
          <CustomView style={styles.separator} customColor="#eee" />
          <Text style={styles.status}>{status}</Text>
        </View>
      </Pressable>
    </View>
  );
};

export default QuestionDetails;

const styles = StyleSheet.create({
  Question: {
    flex: 1,
    padding: 5,
    justifyContent: "flex-start",
    flexDirection: "row",
    alignItems: "center",
    borderColor: "#000",
    backgroundColor: "#E2E8F0",
    borderRadius: 9,
    marginVertical: 5,
  },
  thumbnail: { padding: 10, borderRadius: 50 },
  QuestionDetails: { padding: 10 },
  title: {
    fontSize: 24,
    fontWeight: "700",
  },
  status: {
    fontSize: 18,
    fontWeight: "400",
    color: "grey",
    paddingVertical: 10,
    paddingHorizontal: 5,
    textTransform: "capitalize",
  },
  separator: {
    height: 1,
    width: "100%",
  },
});
