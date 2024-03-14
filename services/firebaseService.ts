import { generateRandomString } from "@/util/helpers";
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
  deleteDoc,
} from "firebase/firestore";

export const getCollectionEntries = async (collectionName: string) => {
  let result: any[] = [];
  try {
    const querySnapshot = await getDocs(collection(database, collectionName));
    result = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
  } catch (e) {
    console.error("Error adding document: ", e);
  }
  return result;
};

export const createDocEntry = async (collectionName: string, docObj: any) => {
  try {
    const docRef = doc(database, collectionName, docObj.id);
    await setDoc(docRef, docObj);
    return true;
  } catch (e) {
    console.error(`Error adding document to ${collectionName}: `, e);
    return false;
  }
};

export const updateDocEntry = async (
  collectionName: string,
  currentDocEntryId: string,
  docObj: any
): Promise<boolean> => {
  try {
    const quizDocRef = doc(database, collectionName, currentDocEntryId);
    await updateDoc(quizDocRef, docObj);
    return true;
  } catch (error) {
    console.error(`Error Updating document to ${collectionName}: `, error);
    return false;
  }
};

export const findDocEntryById = async (
  collectionName: string,
  currentDocEntryId: string
): Promise<any> => {
  try {
    const quizDocRef = doc(database, collectionName, currentDocEntryId);
    const quizSnapshot = await getDoc(quizDocRef);
    if (quizSnapshot.exists()) {
      const quizData = {
        id: quizSnapshot.id,
        ...quizSnapshot.data(),
      };
      return quizData;
    } else {
      throw new Error(`DocEntry from ${collectionName}: not found`);
    }
  } catch (error: any) {
    console.error(`Error getting document to ${collectionName}: `, error);

    throw error;
  }
};

export const deleteDocEntryById = async (
  collectionName: string,
  currentDocEntryId: string
): Promise<any> => {
  try {
    const quizDocRef = doc(database, collectionName, currentDocEntryId);
    await deleteDoc(quizDocRef);
    return true;
  } catch (error) {
    console.error(`Error deleting document to ${collectionName}: `, error);
    return false;
  }
};
