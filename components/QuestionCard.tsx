import { Pressable, StyleSheet, Text, View } from "react-native";
import React from "react";
import { View as CustomView } from "@/components/Themed";
import { useRouter } from "expo-router";

const QuestionDetails = (props: any) => {
  const { id, question, type, questionNbr } = props;
  const router = useRouter();

  return (
    <View>
      <Pressable
        style={styles.Question}
        onPress={
          () => console.log("=======")

          // router.push({
          //   pathname: "/questions/[id]",
          //   params: { id: id },
          // })
        }
      >
        <Text style={styles.number}>{questionNbr})</Text>
        <View style={styles.QuestionDetails}>
          <Text style={styles.content}>{question}</Text>
          <Text style={styles.type}>{type}</Text>
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
    alignItems: "baseline",
    borderColor: "#E2E8F0",
    backgroundColor: "#E2E8F0",
    borderRadius: 9,
    marginVertical: 5,
  },
  QuestionDetails: { paddingVertical: 10 },
  content: {
    fontSize: 24,
    fontWeight: "700",
  },
  type: {
    fontSize: 18,
    fontWeight: "400",
    color: "grey",
    paddingVertical: 10,
    paddingHorizontal: 5,
    textTransform: "capitalize",
  },
  number: {
    fontWeight: "700",
    fontSize: 24,
    paddingHorizontal: 10,
  },
});
