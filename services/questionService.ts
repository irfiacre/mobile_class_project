import { SQLiteDatabase } from "expo-sqlite";
import { Platform } from "react-native";
import * as SQLite from "expo-sqlite";

interface QuestionObjInterface {
  id: string;
  quizId: string;
  question: string;
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
export const findQuestionData = async (
  db: SQLiteDatabase,
  handleFoundData: (data: any) => void
) => {
  let result;
  try {
    await db.transactionAsync(async (tx) => {
      const result = await tx.executeSqlAsync("SELECT * FROM QUIZZES", []);
      if (result.rows) {
        handleFoundData(result.rows);
      }
    }, readOnly);
  } catch (error) {
    console.log(error);
  }
  //   console.log("----", result.rows);
  return result;
};

export const createQuestionTable = async (db: SQLiteDatabase) => {
  try {
    db.transaction((tx) => {
      tx.executeSql(
        "create table if not exists questions (id text primary key not null, quiz_id text, question text, type text);"
      );
    });
    return true;
  } catch (error) {
    console.log(error);
    return false;
  }
};

export const addQuestion = async (
  db: SQLiteDatabase,
  quizObj: QuestionObjInterface
) => {
  const { id, quizId, question } = quizObj;
  try {
    db.transaction((tx) => {
      tx.executeSql(
        "insert into questions (id, title, status, type) values (?, ?, ?,?)",
        [id, quizId, question]
      );
    });
    return true;
  } catch (error) {
    console.log(error);
    return false;
  }
};

export const dropTableQuestion = (db: SQLiteDatabase) => {
  try {
    db.transaction((tx) => {
      tx.executeSql("DROP TABLE questions");
    });
    return true;
  } catch (error) {
    console.log(error);
    return false;
  }
};

export const findQuizQuestionsById = async (
  db: SQLiteDatabase,
  quizId: string,
  handleFoundData: (data: any) => void
) => {
  try {
    await db.transactionAsync(async (tx) => {
      const result = await tx.executeSqlAsync(
        "select * from questions where quiz_id=?",
        [quizId]
      );
      if (result.rows) {
        handleFoundData(result.rows);
      }
    }, readOnly);
  } catch (error) {
    console.log(error);
  }
};
