import { FlatList, Pressable, StyleSheet, Text, View } from "react-native";
import React, { useEffect, useState } from "react";
import QuizDetails from "@/components/card/QuizCard";
import Loading from "@/components/Loading";
import { MaterialIcons } from "@expo/vector-icons";
import { FormControl } from "native-base";
import ModalComponent from "@/components/Model";
import { generateRandomString } from "@/util/helpers";
import { TextInput } from "@/components/Themed";
import {
  addQuiz,
  createQuizTable,
  findQuizData,
  openDatabase,
} from "@/services/quizService";
import { getCollectionEntries } from "@/services/firebaseService";
import SkeletonComponent from "@/components/SkeletonComponent";
import { useNetInfo } from "@react-native-community/netinfo";
import { handleSyncLocalToFirebase } from "@/util/handleFirebaseSync";
import AsyncStorage from "@react-native-async-storage/async-storage";
import TakeQuiz from "./takeQuiz";

const QuizScreen = () => {
  const { type, isConnected } = useNetInfo();

  useEffect(() => {
    const syncLocal = async () => await handleSyncLocalToFirebase();
    if (isConnected) {
      syncLocal();
    } else {
      console.log(" Can not sync Data at the moment");
    }
  }, []);

  const db = openDatabase();
  const [quizData, setQuizData] = useState<any>([]);
  const [publishedQuizState, setPublishedQuizState] = useState<any[]>([]);

  const [refreshState, setRefreshState] = useState(false);
  const [createQuizState, setCreateDQuizState] = useState({
    title: "",
    error: "",
    quizSaved: false,
  });
  const [userInfo, setUserInfo] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const foundQuizDataLocally = (data: any) => {
    setQuizData(data);
    setRefreshState(false);
  };
  const checkLocalUser = async () => {
    try {
      setLoading(true);
      const userJSON = await AsyncStorage.getItem("@user");
      const userData = userJSON ? JSON.parse(userJSON) : null;
      setUserInfo(userData);
    } catch (error) {
      console.log(" Check Local User error(Quizzes):", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkLocalUser();
    findQuizData(db, foundQuizDataLocally);
    const getPublishedData = async () => {
      const publishedQuizzes = await getCollectionEntries("quizzes");
      if (publishedQuizzes) {
        setPublishedQuizState(publishedQuizzes);
      }
    };
    getPublishedData();
  }, [createQuizState.quizSaved, refreshState]);

  const [modelValue, setModel] = useState(false);

  const handleOpenCloseModel = (condition: boolean) => setModel(condition);
  const handleCreateQuiz = () => {
    if (createQuizState.title == "") {
      setCreateDQuizState((prevState: any) => ({
        ...prevState,
        error: "Title Can not be empty",
      }));
    }
    // dropTableQuiz(db);
    createQuizTable(db);
    addQuiz(db, {
      id: generateRandomString(createQuizState.title),
      title: createQuizState.title,
    });
    setCreateDQuizState((prevState: any) => ({
      ...prevState,
      quizSaved: true,
    }));
    handleOpenCloseModel(false);
    setRefreshState(true);
  };
  const isModerator = userInfo?.email === "irfiacre@gmail.com" ? true : false;

  return (
    <View style={styles.container}>
      {quizData ? (
        <View>
          <View style={styles.head}>
            <Text style={styles.title}>Quizzes</Text>
            {isModerator && (
              <Pressable
                style={styles.camera}
                onPress={() => handleOpenCloseModel(true)}
              >
                <MaterialIcons name="bookmark-add" size={24} color="#fff" />
              </Pressable>
            )}
          </View>
          {isModerator ? (
            <View>
              {modelValue ? (
                <ModalComponent
                  title="Create Quiz"
                  isOpen
                  handleCloseModel={() => handleOpenCloseModel(false)}
                  handleOnSave={handleCreateQuiz}
                >
                  <FormControl>
                    <FormControl.Label fontSize={18}>
                      Quiz Title
                    </FormControl.Label>
                    <TextInput
                      isMessageBox={false}
                      onInputChangeText={(identifier: string, text: string) =>
                        setCreateDQuizState((prevState: any) => ({
                          ...prevState,
                          error: "",
                          title: text,
                        }))
                      }
                      textValue={createQuizState.title}
                      identifier="Title"
                      style={{
                        borderColor:
                          createQuizState.error !== "" ? "red" : "grey",
                      }}
                    />
                    {createQuizState.error !== "" && (
                      <Text style={{ color: "red" }}>
                        {createQuizState.error}
                      </Text>
                    )}
                  </FormControl>
                </ModalComponent>
              ) : (
                <View>
                  <Text style={{ ...styles.title, fontWeight: "500" }}>
                    Local Quizzes
                  </Text>
                  <FlatList
                    data={quizData}
                    keyExtractor={(item) => item.id}
                    renderItem={({ item }) => (
                      <View>
                        {!publishedQuizState[0] ? (
                          <SkeletonComponent
                            numberOfSkeletons={1}
                            startColor="#E2E8F0"
                          />
                        ) : (
                          <QuizDetails
                            {...item}
                            title={item.title}
                            status={item?.status}
                          />
                        )}
                      </View>
                    )}
                  />
                </View>
              )}
              <View>
                <Text style={{ ...styles.title, fontWeight: "500" }}>
                  More Quizzes
                </Text>
                <FlatList
                  data={publishedQuizState}
                  keyExtractor={(item) => item.id}
                  renderItem={({ item }) => (
                    <View>
                      {!publishedQuizState[0] ? (
                        <SkeletonComponent
                          numberOfSkeletons={3}
                          startColor="#E2E8F0"
                        />
                      ) : (
                        <QuizDetails
                          {...item}
                          title={item.title}
                          status={item?.status}
                        />
                      )}
                    </View>
                  )}
                />
              </View>
            </View>
          ) : (
            <View>
              <TakeQuiz userInfo={userInfo} />
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
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 16,
    color: "#1d78d6",
    padding: 5,
  },
  camera: {
    padding: 10,
    backgroundColor: "#1d78d6",
    borderRadius: 6,
    width: 45,
    height: 45,
  },
  head: {
    flexDirection: "row",
    alignContent: "center",
    justifyContent: "space-between",
  },
});
