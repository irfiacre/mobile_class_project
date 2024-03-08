import { StyleSheet, Text, View, Pressable } from "react-native";
import React, { useEffect, useState } from "react";
import { useLocalSearchParams, useRouter } from "expo-router";
import { MaterialIcons } from "@expo/vector-icons";
import { findQuizById, openDatabase } from "@/services/quizService";
import {
  CustomButton,
  View as CustomView,
  TextInput,
} from "@/components/Themed";
import Loading from "@/components/Loading";
import ModalComponent from "@/components/Model";
import {
  addQuestion,
  createQuestionTable,
  dropTableQuestion,
  findQuizQuestionsById,
} from "@/services/questionService";
import { generateRandomString } from "@/util/helpers";
import { CheckIcon, FormControl, Select } from "native-base";
import { FlatList } from "react-native-gesture-handler";
import QuestionDetails from "@/components/card/QuestionCard";

const QuizScreen = () => {
  const { id } = useLocalSearchParams();
  const [quizState, setQuizState] = useState<any>({});
  const foundQuizDataLocally = (data: any) => {
    setQuizState(data[0]);
  };
  useEffect(() => {
    findQuizById(db, id.toString(), foundQuizDataLocally);
  }, []);
  const db = openDatabase();
  const [createQuestionState, setCreatedQuestionState] = useState({
    error: "",
    questionType: "",
    question: "",
    quizId: id.toString(),
    quizSaved: false,
  });
  const [modelValue, setModel] = useState(false);
  const [quizQuestionsState, setQuestionsState] = useState<any>([]);

  const handleOpenCloseModel = (condition: boolean) => {
    if (condition) {
      setCreatedQuestionState({
        error: "",
        questionType: "",
        question: "",
        quizId: id.toString(),
        quizSaved: false,
      });
    }
    setModel(condition);
  };
  const router = useRouter();
  const foundQuizQuestionsDataLocally = (data: any) => {
    console.log(")))))))))", data);
    setQuestionsState(data);
  };
  useEffect(() => {
    (async () => {
      await findQuizQuestionsById(
        db,
        id.toString(),
        foundQuizQuestionsDataLocally
      );
      console.log("---- await");
    })();
  }, [createQuestionState.quizSaved]);

  const handleCreateQuizQuestion = () => {
    if (createQuestionState.question == "") {
      setCreatedQuestionState((prevState: any) => ({
        ...prevState,
        error: "Title Can not be empty",
      }));
    }
    // dropTableQuestion(db);
    createQuestionTable(db);
    addQuestion(db, {
      id: generateRandomString(createQuestionState.question.substring(5)),
      quizId: createQuestionState.quizId,
      question: createQuestionState.question,
      questionType: createQuestionState.questionType,
    });

    setCreatedQuestionState((prevState: any) => ({
      ...prevState,
      quizSaved: true,
    }));
    handleOpenCloseModel(false);
  };

  return (
    <View style={styles.container}>
      {quizState.title ? (
        <View>
          {modelValue ? (
            <ModalComponent
              title="New Quiz Question"
              isOpen
              handleCloseModel={() => handleOpenCloseModel(false)}
              handleOnSave={handleCreateQuizQuestion}
            >
              <FormControl>
                <FormControl.Label fontSize={18}>Content</FormControl.Label>
                <TextInput
                  isMessageBox={true}
                  onInputChangeText={(_, text: string) => {
                    setCreatedQuestionState((prevState: any) => ({
                      ...prevState,
                      error: "",
                      question: text,
                    }));
                  }}
                  textValue={createQuestionState.question}
                  identifier="Question Content"
                  style={{
                    borderColor:
                      createQuestionState.error !== "" ? "red" : "grey",
                  }}
                />
                {createQuestionState.error !== "" && (
                  <Text style={{ color: "red" }}>
                    {createQuestionState.error}
                  </Text>
                )}
                <FormControl.Label fontSize={18}>Type</FormControl.Label>
                <Select
                  minWidth="200"
                  accessibilityLabel="Question Type"
                  placeholder="Question Type"
                  _selectedItem={{
                    bg: "teal.600",
                    borderBottomColor: "#000",
                    height: 150,
                    endIcon: <CheckIcon size={5} />,
                  }}
                  mt="1"
                  onValueChange={(itemValue) =>
                    setCreatedQuestionState((prevState: any) => ({
                      ...prevState,
                      questionType: itemValue,
                      error: "",
                    }))
                  }
                >
                  <Select.Item
                    label="Multiple Choice"
                    value="multiple-choice"
                  />
                  <Select.Item label="Open Ended" value="open" />
                </Select>
              </FormControl>
            </ModalComponent>
          ) : (
            <View>
              <View style={styles.section1}>
                <Pressable onPress={() => router.push("/quiz/")}>
                  <MaterialIcons
                    name="chevron-left"
                    size={48}
                    style={{ color: "#1d78d6" }}
                  />
                </Pressable>
                <View>
                  <Text style={styles.title}>{quizState.title}</Text>
                </View>
              </View>
              <View
                style={{
                  backgroundColor:
                    quizState.status === "draft" ? "#BC9916" : "#245B2C",
                  width: 100,
                  borderRadius: 50,
                  marginVertical: "10%",
                }}
              >
                <Text style={styles.status}>{quizState.status}</Text>
              </View>
              <View style={styles.section2}>
                <View>
                  <Text style={styles.subTitle}>Questions</Text>
                </View>
                <CustomButton
                  style={{
                    backgroundColor: "#1d78d6",
                    borderColor: "#1d78d6",
                    width: 50,
                    height: 55,
                  }}
                  onPressBtn={() => handleOpenCloseModel(true)}
                >
                  <MaterialIcons name="add-circle" size={24} color="#fff" />
                </CustomButton>
              </View>

              <CustomView style={styles.separator} customColor="#1d78d6" />
              <FlatList
                data={quizQuestionsState}
                keyExtractor={(item) => item.id}
                renderItem={({ item, index }) => (
                  <QuestionDetails
                    {...item}
                    questionNbr={index + 1}
                    title={item.title}
                    status={item?.status}
                  />
                )}
              />
            </View>
          )}
        </View>
      ) : (
        <Loading />
      )}
    </View>
  );
};

export default QuizScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // paddingTop: 50,
    paddingHorizontal: 16,
  },
  section1: {
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",
    marginLeft: -15,
  },
  section2: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  title: {
    fontSize: 28,
    fontWeight: "700",
    color: "#1d78d6",
  },
  subTitle: {
    fontSize: 24,
    fontWeight: "600",
    marginBottom: 5,
    color: "#1d78d6",
    padding: 5,
  },
  separator: {
    marginBottom: 30,
    height: 2,
    width: "100%",
    opacity: 0.5,
  },
  status: {
    fontSize: 18,
    fontWeight: "400",
    marginBottom: 5,
    padding: 5,
    textTransform: "capitalize",
    color: "#fff",
    textAlign: "center",
  },
});
