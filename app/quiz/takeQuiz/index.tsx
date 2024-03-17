import { FlatList, StyleSheet, Text, View } from "react-native";
import React, { useEffect, useState } from "react";
import TakeQuizCard from "@/components/card/TakeQuizCard";
import ModalComponent from "@/components/Model";
import { CustomButton } from "@/components/Themed";
import { getCollectionEntries } from "@/services/firebaseService";
import SkeletonComponent from "@/components/SkeletonComponent";
import { useNetInfo } from "@react-native-community/netinfo";
import { useRouter } from "expo-router";

const TakeQuiz = (props: { userInfo: any }) => {
  const { type, isConnected } = useNetInfo();
  const router = useRouter();
  const [publishedQuizState, setPublishedQuizState] = useState<any[]>([]);
  const [attemptedQuiz, setAttemptedQuiz] = useState({
    id: "",
  });
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    const getPublishedData = async () => {
      setLoading(true);
      const publishedQuizzes = await getCollectionEntries("quizzes");
      if (publishedQuizzes) {
        setPublishedQuizState(publishedQuizzes);
      }
      setLoading(false);
    };
    getPublishedData();
  }, []);

  const [modelValue, setModel] = useState(false);

  const handleOpenCloseModel = (condition: boolean) => setModel(condition);
  const handleTakeQuizConfirm = () => {
    setModel(false);
    router.navigate({
      pathname: "/quiz/takeQuiz/[id]",
      params: { id: attemptedQuiz?.id },
    });
  };

  return (
    <View style={styles.container}>
      {loading ? (
        <SkeletonComponent numberOfSkeletons={5} startColor="#E2E8F0" />
      ) : (
        <View>
          {modelValue ? (
            <ModalComponent
              title="Attempt Quiz"
              isOpen
              handleCloseModel={() => handleOpenCloseModel(false)}
              noFooter
            >
              <Text style={styles.attemptQuiz}>
                Would You Like to Attempt the {}?
              </Text>
              <CustomButton
                style={styles.attemptQuizBtn}
                onPressBtn={() => handleTakeQuizConfirm()}
              >
                <Text
                  style={{
                    ...styles.attemptQuiz,
                    color: "#fff",
                    fontWeight: "700",
                    paddingVertical: 10,
                    fontSize: 20,
                  }}
                >
                  Attempt
                </Text>
              </CustomButton>
            </ModalComponent>
          ) : (
            <View>
              <FlatList
                data={publishedQuizState}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                  <TakeQuizCard
                    {...item}
                    title={item.title}
                    status={item?.status}
                    handleAttempt={() => {
                      setAttemptedQuiz(item);
                      handleOpenCloseModel(true);
                    }}
                  />
                )}
              />
            </View>
          )}
        </View>
      )}
    </View>
  );
};

export default TakeQuiz;

const styles = StyleSheet.create({
  container: {
    paddingTop: 10,
  },
  attemptQuiz: {
    paddingVertical: 25,
    fontSize: 18,
    textTransform: "capitalize",
  },
  attemptQuizBtn: {
    backgroundColor: "#1d78d6",
    borderColor: "#1d78d6",
    paddingVertical: 10,
    paddingHorizontal: 10,
    flexDirection: "row",
  },
});
