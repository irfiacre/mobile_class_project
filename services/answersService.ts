import { SQLiteDatabase } from "expo-sqlite";
import { Platform } from "react-native";
import * as SQLite from "expo-sqlite";
import {
  createDocEntry,
  deleteDocEntryById,
  updateDocEntry,
} from "./firebaseService";

interface AnswersObjInterface {
  id: string;
  questionId: string;
  content: string;
  isCorrect: string;
}

export const openDatabase = (): any => {
  if (Platform.OS === "web") {
    return {
      transaction: () => {
        return { executeSql: () => {} };
      },
    };
  }

  const db = SQLite.openDatabase("testDB");
  return db;
};

const readOnly = true;
export const findAnswersData = async (
  db: SQLiteDatabase,
  handleFoundData: (data: any) => void
) => {
  let result;
  try {
    await db.transactionAsync(async (tx) => {
      const result = await tx.executeSqlAsync("select * from answers", []);
      if (result.rows) {
        handleFoundData(result.rows);
      }
    }, readOnly);
  } catch (error) {
    console.log(error);
  }
  return result;
};

export const createAnswersTable = async (db: SQLiteDatabase) => {
  try {
    db.transaction((tx) => {
      tx.executeSql(
        "create table if not exists answers (id text primary key not null, question_id text, content text, is_correct text);"
      );
    });
    return true;
  } catch (error) {
    console.log(error);
    return false;
  }
};

export const addAnswer = async (
  db: SQLiteDatabase,
  quizObj: AnswersObjInterface
) => {
  const { id, questionId, content, isCorrect } = quizObj;
  try {
    db.transaction((tx) => {
      tx.executeSql(
        "insert into answers (id, question_id, content, is_correct) values (?, ?, ?,?)",
        [id, questionId, content, isCorrect]
      );
    });
    await createDocEntry("answers", {
      id,
      question_id: questionId,
      content,
      is_correct: isCorrect,
    });
    return true;
  } catch (error) {
    console.log(error);
    return false;
  }
};

export const dropTableAnswers = (db: SQLiteDatabase) => {
  try {
    db.transaction((tx) => {
      tx.executeSql("DROP TABLE answers");
    });
    return true;
  } catch (error) {
    console.log(error);
    return false;
  }
};

export const findQuestionAnswersById = async (
  db: SQLiteDatabase,
  quizId: string,
  handleFoundData: (data: any) => void
) => {
  try {
    await db.transactionAsync(async (tx) => {
      const result = await tx.executeSqlAsync(
        "select * from answers where question_id=?",
        [quizId]
      );
      if (result.rows) {
        handleFoundData(result.rows);
      } else {
        console.log("No result.rows");
      }
    }, readOnly);
  } catch (error) {
    console.log(error);
  }
};

export const findAnswerById = async (
  db: SQLiteDatabase,
  questionId: string,
  handleFoundData: (data: any) => void
) => {
  try {
    await db.transactionAsync(async (tx) => {
      const result = await tx.executeSqlAsync(
        "select * from answers where id=?",
        [questionId]
      );
      if (result.rows) {
        handleFoundData(result.rows);
      } else {
        console.log("No result.rows");
      }
    }, readOnly);
  } catch (error) {
    console.log(error);
  }
};

export const deleteAnswerById = async (
  db: SQLiteDatabase,
  answerId: string
) => {
  let recordDeleted = false;
  try {
    await db.transaction((tx) => {
      tx.executeSql("delete from answers where id=?", [answerId]);
    });
    await deleteDocEntryById("questions", answerId);
    recordDeleted = true;
  } catch (error) {
    console.log(error);
  }
  return recordDeleted;
};
