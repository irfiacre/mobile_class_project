import { StyleSheet, Text, View } from "react-native";
import React from "react";
import { View as CustomView } from "@/components/Themed";
import { useRouter } from "expo-router";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { IconButton } from "native-base";

const QuestionDetails = (props: any) => {
  const { id, content, is_correct, optionNbr, handleDelete } = props;

  return (
    <View>
      <View
        style={[
          styles.Question,
          {
            backgroundColor: is_correct == "true" ? "#1d78d6" : "#DFE3E6",
          },
        ]}
      >
        <View style={styles.QuestionDetails}>
          <Text
            style={[
              styles.number,
              { color: is_correct == "true" ? "#fff" : "grey" },
            ]}
          >
            {optionNbr}
            {")"}
          </Text>
          <Text
            style={[
              styles.content,
              { color: is_correct == "true" ? "#fff" : "grey" },
            ]}
          >
            {content}
          </Text>
        </View>
        <IconButton
          onPress={() => handleDelete(id)}
          icon={
            <MaterialCommunityIcons
              name="delete"
              color={is_correct == "true" ? "#fff" : "grey"}
              size={24}
            />
          }
          borderRadius="full"
          _pressed={{
            backgroundColor: is_correct == "true" ? "grey" : "white",
          }}
        />
      </View>
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
