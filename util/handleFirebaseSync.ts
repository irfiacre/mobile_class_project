import { createAnswersTable, findAnswersData } from "@/services/answersService";
import {
  createDocEntry,
  getCollectionEntries,
  updateDocEntry,
} from "@/services/firebaseService";
import { findQuestionData } from "@/services/questionService";
import { openDatabase, findQuizData } from "@/services/quizService";
import AsyncStorage from "@react-native-async-storage/async-storage";

const localDatabase = openDatabase();

let quizData: any[], questionData: any[], answerData: any[];

const foundQuizData = async (data: any) => {
  quizData = data;
};
const foundQuestionsData = async (data: any) => {
  questionData = data;
};
const foundAnswersData = async (data: any) => {
  answerData = data;
};

const handleSyncProcess = async (collectionName: string, localData: any) => {
  try {
    let finished = false;
    console.log(`Synchronizing ${collectionName.toUpperCase()} ...`);
    const firebaseData: any[] = await getCollectionEntries(`${collectionName}`);

    for (const collectionObj of localData) {
      for (const firebaseDataObj of firebaseData) {
        let collectionUpdated = false;
        if (firebaseDataObj.id === collectionObj.id) {
          collectionUpdated = finished = await updateDocEntry(
            `${collectionName}`,
            collectionObj.id,
            collectionObj
          );
          break;
        }
        if (!collectionUpdated) {
          finished = await createDocEntry(`${collectionName}`, collectionObj);
        }
      }
    }
    return finished;
  } catch (error) {
    console.log("Sync Process Error:", error);
    return false;
  }
};
export const handleSyncLocalToFirebase = async (
  setLoading?: (state: boolean) => void
) => {
  try {
    if (setLoading) setLoading(true);
    const userJSON = await AsyncStorage.getItem("@user");
    const userData = userJSON ? JSON.parse(userJSON) : null;
    // check for moderator
    if (
      // userData?.email === "irfiacre@gmail.com"
      false
    ) {
      await findQuizData(localDatabase, foundQuizData);
      await findQuestionData(localDatabase, foundQuestionsData);
      await findAnswersData(localDatabase, foundAnswersData);
      let quizSynced = false;
      if (quizData.length > 0) {
        quizSynced = await handleSyncProcess("quizzes", quizData);
      } else {
        console.log("Could not sync quizzes");
      }
      let questionSynced = false;
      if (questionData.length > 0 && quizSynced) {
        questionSynced = await handleSyncProcess("questions", questionData);
      } else {
        console.log("Could not sync questions");
      }
      let answersSynced = false;
      if (answerData.length > 0 && questionSynced) {
        answersSynced = await handleSyncProcess("answers", answerData);
      } else {
        console.log("Could not sync answers");
      }
      if (answersSynced) {
        console.log("== Syncing Finished ^^' ===");
      }
    }
    if (setLoading) setLoading(false);
  } catch (error) {
    console.log(error);
    throw error;
  }
};
