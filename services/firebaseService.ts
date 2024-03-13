import database from "../db/firestore";
import {
  collection,
  addDoc,
  getDocs,
  doc,
  setDoc,
  query,
  updateDoc,
  arrayUnion,
  getDoc,
} from "firebase/firestore";

export const createQuiz = async (
  docObj: any,
  setLoading: (value: boolean) => void
) => {
  setLoading(true);
  try {
    const docRef = doc(database, "quizzes", docObj.id);

    await setDoc(docRef, docObj);

    setLoading(false);
    return true;
  } catch (e) {
    console.error("Error adding document: ", e);
    return false;
  }
};

export const getQuizzes = async () => {
  let result: any[] = [];
  try {
    const querySnapshot = await getDocs(collection(database, "quizzes"));

    result = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
  } catch (e) {
    console.error("Error adding document: ", e);
  }
  return result;
};

export const addQuestionsToQuiz = async (
  currentQuizId: string,
  questionArr: any[]
) => {
  try {
    const quizDocRef = doc(database, "quizzes", currentQuizId);
    await updateDoc(quizDocRef, {
      questions: arrayUnion(...questionArr),
    });
    return true;
  } catch (error) {
    console.log(error);
    return false;
  }
};

export const getQuizById = async (currentQuizId: string): Promise<any> => {
  try {
    const quizDocRef = doc(database, "quizzes", currentQuizId);
    const quizSnapshot = await getDoc(quizDocRef);
    if (quizSnapshot.exists()) {
      const quizData = {
        id: quizSnapshot.id,
        ...quizSnapshot.data(),
      };
      return quizData;
    } else {
      throw new Error("Quiz not found");
    }
  } catch (error: any) {
    console.error("Error getting quiz by ID:", error.message);
    throw error;
  }
};
