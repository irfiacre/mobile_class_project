import { Pressable, StyleSheet, Text, View } from "react-native";
import React from "react";
import { View as CustomView } from "@/components/Themed";
import { useRouter } from "expo-router";
import { MaterialCommunityIcons } from "@expo/vector-icons";

const QuestionDetails = (props: any) => {
  const { id, content, is_correct, optionNbr, handleDelete } = props;

  const router = useRouter();

  return (
    <View>
      <Pressable
        style={[
          styles.Question,
          { backgroundColor: is_correct == "true" ? "#004225" : "#DFE3E6" },
        ]}
        onPress={() => console.log("-------")}
      >
        <View style={styles.QuestionDetails}>
          <Text
            style={[
              styles.number,
              { color: is_correct == "true" ? "#fff" : "" },
            ]}
          >
            {optionNbr}
            {")"}
          </Text>
          <Text
            style={[
              styles.content,
              { color: is_correct == "true" ? "#fff" : "" },
            ]}
          >
            {content}
          </Text>
        </View>
        <View>
          <MaterialCommunityIcons name="delete" color="red" size={28} />
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
    justifyContent: "space-between",
    flexDirection: "row",
    alignItems: "baseline",
    borderColor: "#DFE3E6",
    backgroundColor: "#DFE3E6",
    borderRadius: 9,
    marginVertical: 5,
  },
  QuestionDetails: { paddingVertical: 10, flexDirection: "row" },
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
