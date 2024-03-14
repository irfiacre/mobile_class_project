import { StyleSheet, Text, View, Pressable } from "react-native";
import React, { useEffect, useState } from "react";
import { useLocalSearchParams, useRouter } from "expo-router";
import { MaterialIcons } from "@expo/vector-icons";
import { openDatabase } from "@/services/quizService";
import {
  CustomButton,
  View as CustomView,
  TextInput,
} from "@/components/Themed";
import Loading from "@/components/Loading";
import ModalComponent from "@/components/Model";
import {
  addAnswer,
  createAnswersTable,
  deleteAnswerById,
  findQuestionAnswersById,
} from "@/services/answersService";
import { generateRandomString, primaryColor } from "@/util/helpers";
import { FormControl, IconButton, Radio } from "native-base";
import { FlatList } from "react-native-gesture-handler";
import AnswerDetails from "@/components/card/AnswerCard";
import {
  deleteQuestionById,
  findQuestionById,
  updateQuestion,
} from "@/services/questionService";
import ActionItems from "@/components/ActionItems";
import { useToast } from "react-native-toast-notifications";
import Checkbox from "expo-checkbox";
import { useNetInfo } from "@react-native-community/netinfo";
import { handleSyncLocalToFirebase } from "@/util/handleFirebaseSync";

const QuizScreen = () => {
  const { id } = useLocalSearchParams();

  const db = openDatabase();
  const [fetchData, setFetchData] = useState({
    loading: true,
    updateData: true,
  });

  const [quizState, setQuizState] = useState<any>({});
  const [modelValue, setModel] = useState(false);

  const handleOpenCloseModel = (condition: boolean) => setModel(condition);
  const router = useRouter();
  const foundQuestionDataLocally = (data: any) => {
    setQuizState(data[0]);
    setFetchData({ loading: false, updateData: false });
  };

  const [createAnswerState, setCreatedAnswerState] = useState({
    error: "",
    isCorrect: "false",
    content: "",
    questionId: id.toString(),
    answerSaved: false,
  });
  const [answersState, setAnswersState] = useState([]);
  const foundAnswersDataLocally = (data: any) => {
    setAnswersState(data);
    setFetchData({ loading: false, updateData: false });
  };
  useEffect(() => {
    findQuestionAnswersById(db, id.toString(), foundAnswersDataLocally);
  }, [fetchData.updateData]);

  const handleCreateQuizAnswer = () => {
    if (createAnswerState.content == "") {
      setCreatedAnswerState((prevState: any) => ({
        ...prevState,
        error: "Title Can not be empty",
      }));
    }
    // dropTableAnswer(db);
    createAnswersTable(db);
    addAnswer(db, {
      id: generateRandomString(createAnswerState.content.substring(10)),
      questionId: createAnswerState.questionId,
      content: createAnswerState.content,
      isCorrect: createAnswerState.isCorrect,
    });
    setCreatedAnswerState((prevState: any) => ({
      ...prevState,
      quizSaved: true,
    }));
    setFetchData({ loading: true, updateData: true });

    handleOpenCloseModel(false);
  };

  const handleDeleteAnswer = (answerId: string) => {
    deleteAnswerById(db, answerId);
    setFetchData({ loading: true, updateData: true });
  };

  const toast = useToast();
  const handleDeleteQuestion = () => {
    if (!answersState[0]) {
      deleteQuestionById(db, id.toString());
      router.navigate({
        pathname: "/quiz/[id]",
        params: { id: quizState.quiz_id },
      });
    } else {
      toast.show("Unable to delete Question, Please first delete all answers", {
        type: "danger",
        id: generateRandomString("toast"),
      });
    }
  };
  const [editMode, setEditMode] = useState({
    modelOpen: false,
    content: quizState.question,
  });
  const handleSubmitQuestionEdit = () => {
    updateQuestion(db, {
      id: id.toString(),
      question: editMode.content,
    });
    setCreatedAnswerState((prevState: any) => ({
      ...prevState,
      quizSaved: true,
    }));
    setFetchData({ loading: true, updateData: true });
    handleOpenCloseModel(false);
  };

  return (
    <View style={styles.container}>
      {quizState.question ? (
        <View>
          {modelValue ? (
            <ModalComponent
              title={editMode.modelOpen ? "Edit" : "New Quiz Answer"}
              isOpen
              handleCloseModel={() => handleOpenCloseModel(false)}
              handleOnSave={
                editMode.modelOpen
                  ? handleSubmitQuestionEdit
                  : handleCreateQuizAnswer
              }
            >
              {editMode.modelOpen ? (
                <FormControl>
                  <TextInput
                    isMessageBox={true}
                    onInputChangeText={(_, text: string) => {
                      setEditMode((prevState: any) => ({
                        ...prevState,
                        error: "",
                        content: text,
                      }));
                    }}
                    textValue={editMode.content}
                    identifier="Edit question"
                  />
                </FormControl>
              ) : (
                <FormControl>
                  <FormControl.Label fontSize={18}>Content</FormControl.Label>
                  <TextInput
                    isMessageBox={true}
                    onInputChangeText={(_, text: string) => {
                      setCreatedAnswerState((prevState: any) => ({
                        ...prevState,
                        error: "",
                        content: text,
                      }));
                    }}
                    textValue={createAnswerState.content}
                    identifier="Answer Content"
                    style={{
                      borderColor:
                        createAnswerState.error !== "" ? "red" : "grey",
                    }}
                  />
                  {createAnswerState.error !== "" && (
                    <Text style={{ color: "red" }}>
                      {createAnswerState.error}
                    </Text>
                  )}

                  <View style={{ flexDirection: "row", alignItems: "center" }}>
                    <Checkbox
                      style={styles.checkbox}
                      value={createAnswerState.isCorrect == "true"}
                      onValueChange={(newValue) => {
                        console.log(newValue);

                        setCreatedAnswerState((prevState: any) => ({
                          ...prevState,
                          isCorrect: `${newValue}`,
                        }));
                      }}
                      color={
                        createAnswerState.isCorrect == "true"
                          ? primaryColor
                          : undefined
                      }
                    />
                    <FormControl.Label fontSize={24}>
                      Is correct answer
                    </FormControl.Label>
                  </View>
                </FormControl>
              )}
            </ModalComponent>
          ) : (
            <View>
              <Pressable
                onPress={() =>
                  router.push({
                    pathname: "/quiz/[id]",
                    params: { id: quizState.quiz_id },
                  })
                }
              >
                <MaterialIcons
                  name="chevron-left"
                  size={48}
                  style={{ color: "#1d78d6", marginLeft: -15 }}
                />
              </Pressable>
              <View style={styles.section1}>
                <Text style={styles.title}>{quizState.question}</Text>
                <ActionItems
                  handleEdit={() => {
                    setEditMode((prevState) => ({
                      ...prevState,
                      modelOpen: true,
                      content: quizState.question,
                    }));
                    handleOpenCloseModel(true);
                  }}
                  handleDelete={() => handleDeleteQuestion()}
                />
              </View>

              <View
                style={{
                  backgroundColor:
                    quizState.type === "open" ? "grey" : "#439D44",
                  width: 200,
                  borderRadius: 50,
                  marginVertical: "10%",
                }}
              >
                <Text style={styles.status}>{quizState.type}</Text>
              </View>
              {quizState.type !== "open" && (
                <View>
                  <View style={styles.section2}>
                    <View>
                      <Text style={styles.subTitle}>Answer Options</Text>
                    </View>
                    <View>
                      <CustomButton
                        style={{
                          backgroundColor: "#1d78d6",
                          borderColor: "#1d78d6",
                          paddingVertical: 10,
                          paddingHorizontal: 10,
                        }}
                        onPressBtn={() => handleOpenCloseModel(true)}
                      >
                        <MaterialIcons
                          name="add-circle"
                          size={24}
                          color="#fff"
                        />
                      </CustomButton>
                    </View>
                  </View>

                  <CustomView style={styles.separator} customColor="#1d78d6" />
                  <FlatList
                    data={answersState}
                    keyExtractor={(item) => item.id}
                    renderItem={({
                      item,
                      index,
                    }: {
                      item: any;
                      index: number;
                    }) => (
                      <AnswerDetails
                        {...item}
                        optionNbr={index + 1}
                        handleDelete={handleDeleteAnswer}
                      />
                    )}
                  />
                </View>
              )}
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
    paddingHorizontal: 16,
    paddingTop: 10,
  },
  section1: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginHorizontal: 10,
    marginTop: "10%",
  },
  section2: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  title: {
    paddingVertical: 10,
    fontSize: 24,
    fontWeight: "700",
    width: "80%",
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
  checkbox: {
    margin: 8,
  },
});
