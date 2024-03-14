import { findAnswersData } from "@/services/answersService";
import {
  createDocEntry,
  getCollectionEntries,
  updateDocEntry,
} from "@/services/firebaseService";
import { findQuestionData } from "@/services/questionService";
import { openDatabase, findQuizData } from "@/services/quizService";

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
    console.log("Sync Process Error: ", error);
    return false;
  }
};
export const handleSyncLocalToFirebase = async (
  setLoading?: (state: boolean) => void
) => {
  try {
    if (setLoading) setLoading(true);
    await findQuizData(localDatabase, foundQuizData);
    await findQuestionData(localDatabase, foundQuestionsData);
    await findAnswersData(localDatabase, foundAnswersData);
    let quizSynced = false;
    if (quizData.length > 0) {
      quizSynced = await handleSyncProcess("quizzes", quizData);
    } else {
      throw new Error("Could not sync quizzes");
    }
    let questionSynced = false;
    if (questionData.length > 0 && quizSynced) {
      questionSynced = await handleSyncProcess("questions", questionData);
    } else {
      throw new Error("Could not sync questions");
    }
    let answersSynced = false;
    if (answerData.length > 0 && questionSynced) {
      answersSynced = await handleSyncProcess("answers", answerData);
    } else {
      throw new Error("Could not sync answers");
    }
    if (answersSynced) {
      console.log("== Syncing Finished ^^' ===");
    }
    if (setLoading) setLoading(false);
  } catch (error) {
    console.log(error);
    throw error;
  }
};
