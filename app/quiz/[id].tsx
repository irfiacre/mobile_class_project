import {
  StyleSheet,
  Text,
  View,
  Pressable,
  TouchableOpacity,
} from "react-native";
import React, { useEffect, useRef, useState } from "react";
import { useLocalSearchParams, useRouter } from "expo-router";
import { MaterialIcons } from "@expo/vector-icons";
import {
  deleteQuizById,
  findQuizById,
  openDatabase,
  updateQuiz,
} from "@/services/quizService";
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
  findQuizQuestionsById,
} from "@/services/questionService";
import { generateRandomString } from "@/util/helpers";
import { CheckIcon, FormControl, Select } from "native-base";
import { FlatList } from "react-native-gesture-handler";
import QuestionDetails from "@/components/card/QuestionCard";
import ActionItems from "@/components/ActionItems";
import { useToast } from "react-native-toast-notifications";
import {
  registerForPushNotificationsAsync,
  sendPushNotification,
} from "@/util/pushNotification";
import * as Notifications from "expo-notifications";
import { createDocEntry } from "@/services/firebaseService";
import Spinner from "react-native-loading-spinner-overlay";
import { dropTableAnswers } from "@/services/answersService";
import { useNetInfo } from "@react-native-community/netinfo";
import { handleSyncLocalToFirebase } from "@/util/handleFirebaseSync";

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
});

const QuizScreen = () => {
  const { id } = useLocalSearchParams();
  const db = openDatabase();
  const [quizState, setQuizState] = useState<any>({});
  const [refreshState, setRefreshState] = useState(false);
  const [createQuestionState, setCreatedQuestionState] = useState({
    error: "",
    questionType: "",
    question: "",
    quizId: id.toString(),
    quizSaved: false,
  });
  const [modelValue, setModel] = useState(false);
  const [quizQuestionsState, setQuestionsState] = useState<any>([]);
  const [editMode, setEditMode] = useState({
    modelOpen: false,
    content: quizState.title ? quizState.title : "",
  });

  const { type, isConnected } = useNetInfo();
  useEffect(() => {
    const syncLocal = async () => await handleSyncLocalToFirebase();

    if (isConnected) {
      syncLocal();
    } else {
      console.log(" Can not sync Data at the moment");
    }
  }, []);

  useEffect(() => {
    findQuizById(db, id.toString(), foundQuizDataLocally);
  }, [refreshState]);

  useEffect(() => {
    (async () => {
      await findQuizQuestionsById(
        db,
        id.toString(),
        foundQuizQuestionsDataLocally
      );
    })();
  }, [createQuestionState.quizSaved, refreshState]);

  const foundQuizDataLocally = (data: any) => {
    setQuizState(data[0]);
    setRefreshState(false);
    setEditMode((prevState: any) => ({ ...prevState, content: data[0].title }));
  };
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
    setQuestionsState(data);
    setRefreshState(false);
  };
  const handleCreateQuizQuestion = () => {
    if (createQuestionState.question == "") {
      setCreatedQuestionState((prevState: any) => ({
        ...prevState,
        error: "Title Can not be empty",
      }));
    }
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
    setRefreshState(true);
  };

  const handleSubmitQuizEdit = () => {
    updateQuiz(db, {
      id: id.toString(),
      newTitle: editMode.content,
      newStatus: quizState.status,
    });

    setRefreshState(true);
    handleOpenCloseModel(false);
  };

  const [expoPushToken, setExpoPushToken] = useState("");
  const [notification, setNotification] = useState(false);
  const notificationListener = useRef();
  const responseListener = useRef();

  useEffect(() => {
    registerForPushNotificationsAsync().then((token) =>
      setExpoPushToken(token)
    );

    notificationListener.current =
      Notifications.addNotificationReceivedListener((notification) => {
        setNotification(notification);
      });

    responseListener.current =
      Notifications.addNotificationResponseReceivedListener((response) => {
        console.log(response);
      });

    return () => {
      Notifications.removeNotificationSubscription(
        notificationListener.current
      );
      Notifications.removeNotificationSubscription(responseListener.current);
    };
  }, []);
  const toast = useToast();
  const handleDeleteQuestion = () => {
    if (!quizQuestionsState[0]) {
      deleteQuizById(db, id.toString());
      router.push("/quiz/");
      sendPushNotification({
        expoPushToken,
        title: `Quiz: ${id.toString()}`,
        messageTxt: "Deleted successfully!",
      });
    } else {
      toast.show("Unable to delete QUIZ, Please first delete all Questions", {
        type: "danger",
        id: generateRandomString("toast"),
      });
    }
  };

  return (
    <View style={styles.container}>
      <Spinner
        visible={refreshState}
        textContent={"Updating..."}
        textStyle={styles.spinnerTextStyle}
      />
      {quizState.title ? (
        <View>
          {modelValue ? (
            <View>
              <ModalComponent
                title={
                  editMode.modelOpen
                    ? `Edit Quiz: ${quizState.title}`
                    : "Add Question"
                }
                isOpen
                handleCloseModel={() => handleOpenCloseModel(false)}
                handleOnSave={
                  editMode.modelOpen
                    ? handleSubmitQuizEdit
                    : handleCreateQuizQuestion
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
                )}
              </ModalComponent>
            </View>
          ) : (
            <View>
              <View style={styles.section1}>
                <View style={styles.quizTitle}>
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
                <View>
                  <TouchableOpacity onPress={() => setRefreshState(true)}>
                    <MaterialIcons
                      name="refresh"
                      size={38}
                      style={{ color: "#1d78d6" }}
                    />
                  </TouchableOpacity>
                </View>
              </View>
              <View
                style={{
                  marginVertical: "10%",
                  flexDirection: "row",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <View
                  style={{
                    backgroundColor:
                      quizState.status === "draft" ? "#BC9916" : "#439D44",
                    width: 100,
                    borderRadius: 50,
                  }}
                >
                  <Text style={styles.status}>{quizState.status}</Text>
                </View>
                <ActionItems
                  handleEdit={() => {
                    setEditMode((prevState) => ({
                      ...prevState,
                      modelOpen: true,
                    }));
                    handleOpenCloseModel(true);
                  }}
                  handleDelete={() => handleDeleteQuestion()}
                />
              </View>
              <View style={styles.section2}>
                <View>
                  <Text style={styles.subTitle}>Questions</Text>
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
                    <MaterialIcons name="add-circle" size={32} color="#fff" />
                  </CustomButton>
                </View>
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
    paddingTop: 10,
    paddingHorizontal: 16,
  },
  section1: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginLeft: -15,
  },
  quizTitle: {
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",
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
  spinnerTextStyle: {
    color: "#FFF",
  },
});
