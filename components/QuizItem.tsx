import {
  View,
  Text,
  Dimensions,
  FlatList,
  TouchableOpacity,
  Image,
} from "react-native";
import React from "react";
const { height, width } = Dimensions.get("window");
import { AntDesign, Entypo } from "@expo/vector-icons";

type QuestionType = {
  question: string;
  correct_answer: string;
  incorrect_answers: string[];
  imageUrl?: string;
  selectedOption?: string;
  allOptions?: string[];
};

const QuizItem = ({
  data,
  selectedOption,
  currentIndex,
  getOptionBgColor,
  getOptionTextColor,
}: {
  data: QuestionType;
  selectedOption: any;
  currentIndex: number;
  getOptionBgColor: (currentQuestion: any, currentOption: any) => string;
  getOptionTextColor: (currentQuestion: any, currentOption: any) => string;
}) => {
  return (
    <View
      style={{
        width: width,
        marginTop: 40,
      }}
    >
      <Text
        style={{
          fontSize: 25,
          fontWeight: "bold",
          color: "black",
          marginLeft: 20,
          marginRight: 20,
          marginBottom: 20,
          textTransform: "capitalize",
        }}
      >
        {"Question : " + data.question}
      </Text>
      <View style={{ marginTop: 20 }}>
        {data.allOptions && (
          <FlatList
            scrollEnabled={false}
            data={data.allOptions}
            renderItem={({ item, index }) => {
              return (
                <TouchableOpacity
                  style={{
                    width: "90%",
                    height: 60,
                    elevation: 3,
                    backgroundColor: getOptionBgColor(data, item),
                    marginTop: 10,
                    marginBottom: 10,
                    alignSelf: "center",
                    alignItems: "center",
                    paddingLeft: 15,
                    flexDirection: "row",
                    borderRadius: 9,
                  }}
                  onPress={() => {
                    selectedOption(item);
                  }}
                >
                  <View
                    style={{
                      width: 40,
                      height: 40,
                      borderRadius: 20,
                      backgroundColor:
                        data.selectedOption === item
                          ? data.selectedOption === data.correct_answer
                            ? "green"
                            : "white"
                          : "white",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    {data.selectedOption === item ? (
                      data.selectedOption === data.correct_answer ? (
                        <AntDesign name="check" size={22} color="white" />
                      ) : (
                        <Entypo
                          name="circle-with-cross"
                          size={24}
                          color="red"
                        />
                      )
                    ) : (
                      <Text style={{ fontWeight: "600", color: "#000" }}>
                        {index === 0
                          ? "A"
                          : index === 1
                          ? "B"
                          : index === 2
                          ? "C"
                          : "D"}
                      </Text>
                    )}
                  </View>
                  <Text
                    style={{
                      fontSize: 18,
                      fontWeight: "600",
                      marginLeft: 20,
                      color: getOptionTextColor(data, item),
                      textTransform: "capitalize",
                    }}
                  >
                    {item}
                  </Text>
                </TouchableOpacity>
              );
            }}
          />
        )}
      </View>
    </View>
  );
};

export default QuizItem;
