import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  SafeAreaView,
  StatusBar,
  FlatList,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
// import { getQuestionsByQuizId, getQuizById } from "@/util/database";
import { router, useLocalSearchParams, useNavigation } from "expo-router";
// import FormButton from "@/app-component/FormButton";
// import ResultModal from "@/app-component/ResultModal";
import Spinner from "react-native-loading-spinner-overlay";
import QuizItem from "@/components/QuizItem";
import { getRandomColor, primaryColor, shuffleArray } from "@/util/helpers";
import {
  findDocEntryByField,
  findDocEntryById,
} from "@/services/firebaseService";
import ResultModal from "@/components/ResultModal";
import {
  registerForPushNotificationsAsync,
  sendPushNotification,
} from "@/util/pushNotification";
import * as Notifications from "expo-notifications";

const { height, width } = Dimensions.get("window");

type QuestionType = {
  question: string;
  correct_answer: string;
  incorrect_answers: string[];
  imageUrl?: string;
  selectedOption?: string; // Adding selectedOption property
  allOptions?: string[]; // Adding allOptions property
};

type QuizType = {
  id: string;
  title: string;
  description: string;
};

const AttemptQuizScreen = () => {
  const { id } = useLocalSearchParams();
  const [expoPushToken, setExpoPushToken] = useState("");
  const [notification, setNotification] = useState(false);
  const notificationListener = useRef();
  const responseListener = useRef();
  const navigation = useNavigation();
  useEffect(() => {
    navigation.setOptions({
      title: "",
    });
    registerForPushNotificationsAsync().then((token: any) =>
      setExpoPushToken(token)
    );

    notificationListener.current =
      Notifications.addNotificationReceivedListener((notification: any) => {
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

  const [currentQuizId, setCurrentQuizId] = useState<string>(id as string);
  const [title, setTitle] = useState("");
  const [questions, setQuestions] = useState<QuestionType[]>([]);
  const [loading, setLoading] = useState(false);
  const listRef = useRef<FlatList<QuestionType>>(null);

  const [correctCount, setCorrectCount] = useState(0);
  const [incorrectCount, setIncorrectCount] = useState(0);
  const [isResultModalVisible, setIsResultModalVisible] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(1);
  const [scoreTrack, setScoreTrack] = useState({
    percentile: 0,
    actual: 0,
  });

  const getQuizAndQuestionDetails = async () => {
    setLoading(true);
    try {
      if (!questions[0]) {
        const currentQuiz: any = await findDocEntryById(
          "quizzes",
          id.toString()
        );
        setTitle(currentQuiz.title);
        navigation.setOptions({
          title: currentQuiz.title,
          headerRight: () => (
            <Text
              style={{
                marginRight: 20,
                fontSize: 18,
                fontWeight: "bold",
                color: primaryColor,
              }}
              onPress={() => {
                reset();
                listRef?.current?.scrollToIndex({ animated: true, index: 0 });
              }}
            >
              Reset
            </Text>
          ),
        });

        const questionsData = await findDocEntryByField(
          "questions",
          "quiz_id",
          id.toString()
        );
        const resultQuestions = [];
        for (const questionItem of questionsData) {
          const answers = await findDocEntryByField(
            "answers",
            "question_id",
            questionItem.id
          );

          const formattedQuestion = {
            question: questionItem.question,
            questionType: questionItem.type,
            correct_answer:
              answers.filter((elt: any) => elt.is_correct === "true")[0]
                ?.content || "",
            incorrect_answers: answers
              .filter((elt: any) => elt.is_correct !== "true")
              ?.map((elt: any) => elt.content),
          };
          resultQuestions.push(formattedQuestion);
        }

        const tempQuestions: QuestionType[] = resultQuestions.map(
          (question) => {
            const allOptions = shuffleArray([
              ...question.incorrect_answers,
              question.correct_answer,
            ]);
            return { ...question, allOptions };
          }
        );
        setQuestions(tempQuestions);
      }
    } catch (error: any) {
      console.error(
        "Error fetching quiz and questions details:",
        error.message
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getQuizAndQuestionDetails();
  }, []);

  const getOptionBgColor = (currentQuestion: any, currentOption: any) => {
    return getRandomColor();
  };

  const getOptionTextColor = (currentQuestion: any, currentOption: any) => {
    return "#fff";
  };

  const reset = () => {
    const updatedQuestions = questions.map((question) => {
      // Check if selectedOption exists, then remove it
      if (question.selectedOption) {
        const { selectedOption, ...rest } = question;
        return rest;
      }
      return question;
    });

    // Update state with the reset questions
    setQuestions(updatedQuestions);

    // Reset correct and incorrect counts
    setCorrectCount(0);
    setIncorrectCount(0);
    getQuizAndQuestionDetails();
  };

  const handleSubmitQuizAnswers = () => {
    setIsResultModalVisible(true);
    const scoreCount = correctCount / questions.length;
    setScoreTrack({
      percentile: scoreCount * 100,
      actual: scoreCount,
    });

    sendPushNotification({
      expoPushToken,
      title: `Attempt for : ${title}`,
      messageTxt: `${
        scoreCount * 100 < 50 ? "You can do better!" : "Congratulations!"
      } you got ${scoreCount * 100}/100`,
    });
  };

  return (
    <SafeAreaView
      style={{
        flex: 1,
      }}
    >
      <Spinner visible={loading} />
      {/* Top Bar */}
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          marginTop: 20,
        }}
      >
        <Text
          style={{
            fontSize: 18,
            fontWeight: "bold",
            marginLeft: 20,
            color: "#000",
          }}
        >
          Progress :{" " + currentIndex + "/" + questions.length}
        </Text>
      </View>

      {/* Questions and Options list */}
      <FlatList
        ref={listRef}
        data={questions}
        scrollEnabled={false}
        horizontal
        onScroll={(e) => {
          const x = e.nativeEvent.contentOffset.x / width + 1;
          setCurrentIndex(parseInt(x.toFixed(0), 10));
        }}
        showsVerticalScrollIndicator={false}
        keyExtractor={(item) => item.question}
        renderItem={({ item, index }) => {
          return (
            <QuizItem
              data={item}
              selectedOption={(x: any): any => {
                if (item.selectedOption) {
                  return null;
                }
                if (x == item.correct_answer) {
                  setCorrectCount(correctCount + 1);
                } else {
                  setIncorrectCount(incorrectCount + 1);
                }
                let tempQuestions = [...questions];
                tempQuestions[index].selectedOption = x;
                setQuestions([...tempQuestions]);
              }}
              currentIndex={currentIndex}
              getOptionBgColor={getOptionBgColor}
              getOptionTextColor={getOptionTextColor}
            />
          );
        }}
      />

      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          position: "absolute",
          bottom: 50,
          width: "100%",
        }}
      >
        <TouchableOpacity
          style={{
            backgroundColor: currentIndex > 1 ? "purple" : "gray",
            height: 50,
            width: 100,
            borderRadius: 10,
            marginLeft: 20,
            justifyContent: "center",
            alignItems: "center",
          }}
          onPress={() => {
            if (currentIndex > 1) {
              listRef?.current?.scrollToIndex({
                animated: true,
                index: currentIndex - 2,
              });
            }
          }}
        >
          <Text style={{ color: "#fff" }}>Previous</Text>
        </TouchableOpacity>
        {currentIndex == questions.length ? (
          <TouchableOpacity
            style={{
              backgroundColor: questions[currentIndex - 1]?.selectedOption
                ? "green"
                : "gray",
              height: 50,
              width: 100,
              borderRadius: 10,
              marginRight: 20,
              justifyContent: "center",
              alignItems: "center",
            }}
            onPress={() => {
              if (questions[currentIndex - 1].selectedOption) {
                handleSubmitQuizAnswers();
              }
            }}
          >
            <Text style={{ color: "#fff" }}>Submit</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            style={{
              backgroundColor: questions[currentIndex - 1]?.selectedOption
                ? "purple"
                : "gray",
              height: 50,
              width: 100,
              borderRadius: 10,
              marginRight: 20,
              justifyContent: "center",
              alignItems: "center",
            }}
            onPress={() => {
              if (questions[currentIndex - 1].selectedOption) {
                if (currentIndex < questions.length) {
                  listRef?.current?.scrollToIndex({
                    animated: true,
                    index: currentIndex,
                  });
                }
              }
            }}
          >
            <Text style={{ color: "#fff" }}>Next</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Result Modal */}
      <ResultModal
        isModalVisible={isResultModalVisible}
        correctCount={correctCount}
        incorrectCount={incorrectCount}
        totalCount={questions.length}
        handleOnClose={() => {
          setIsResultModalVisible(false);
        }}
        handleRetry={() => {
          setIsResultModalVisible(false);

          reset();
          listRef?.current?.scrollToIndex({
            animated: true,
            index: 0,
          });
        }}
        handleHome={() => {
          router.back();
          setIsResultModalVisible(false);
        }}
      />
    </SafeAreaView>
  );
};

export default AttemptQuizScreen;
